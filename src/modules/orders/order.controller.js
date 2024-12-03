import { couponModel } from "../../../DB/Models/coupon.model.js"
import { orderModel } from "../../../DB/Models/order.model.js"
import { productModel } from "../../../DB/Models/product.model.js"
import { cartModel } from "../../../DB/Models/cart.model.js"
import { nanoid } from "nanoid"
import createInvoice from "../../utilities/pdfkit.js"
import { isCouponValid } from "../../utilities/copunValidations.js"
import { userModel } from "../../../DB/Models/user.model.js"
import { sendEmailService } from "../../services/sendEmailServecies.js"
import { qrCodeFunction } from "../../utilities/qrCode.js"
import { generateToken, verifyToken } from "../../utilities/tokenFunctions.js"
import { paymentFunction } from "../../utilities/payment.js"
import Stripe from "stripe"


// ^ ====================================== create order ======================================
export const createOrder = async(req,res,next) => {

    const userId = req.authUser._id

    const {
        productId,
        quantity,
        address,
        phoneNumber,
        paymentMethod,
        couponCode
    } =  req.body

    // ~  =================================== check the coupon =================================== 
    if(couponCode){

        const coupon = await couponModel.findOne({couponCode}).select('couponAmmount isPercentage isFixedAmmount couponAssginedToUsers')

        const couponValidResult = await isCouponValid({
            userId,
            couponCode,
            next
        })

        if(couponValidResult !== true){
            return next(new Error(couponValidResult.msg, {cause:400}))
        }
        
        req.coupon = coupon

        // console.log("req.coupon",req.coupon);
        // console.log("coupon",coupon);
    }

    // ~ =================================== check the product ===================================
    const products = []
    const isProductValid = await productModel.findOne({
        _id:productId,
        stock:{$gte: quantity}
    })
    if(!isProductValid){
        return next(new Error('product out of stock',{cause:404}))
    }


    
    const productObject = {
        productId,
        quantity,
        title: isProductValid.title,
        price: isProductValid.priceAfterDiscount,
        finalPrice: isProductValid.priceAfterDiscount * quantity
    }
    products.push(productObject)

    const subTotal = productObject.finalPrice

    // ~ =================================== paid Ammount ===================================

    let paidAmount = 0

    // console.log("req.coupon?.isPercentage",req.coupon?.isPercentage);
    // console.log("req.coupon?.isFixedAmount",req.coupon?.isFixedAmmount);
    

    if(req.coupon?.isPercentage){
        paidAmount = subTotal * (1 - (req.coupon.couponAmmount || 0) / 100)
        // console.log(paidAmount);
        
    }
    else if(req.coupon?.isFixedAmmount){
        paidAmount = subTotal - req.coupon.couponAmmount
    }
    else{
        paidAmount = subTotal
    }


  // ~ ======================= paymentMethod  + orderStatus ==================
      let orderStatus 
// console.log(products.length);

    paymentMethod == 'cash' ? (orderStatus = 'placed') : (orderStatus = 'pending')
 
    const orderObject = {
        userId,
        products,
        address,
        phoneNumber,
        orderStatus,
        paymentMethod,
        subTotal,   
        paidAmount,  
        productNumbers:products.length, 
        couponId: req.coupon?._id
    }
    // console.log(orderObject);
    
    const orderDB = await orderModel.create(orderObject)

    // handel the stock count minimize it by the quantity of the order
    if(!orderDB){
return next(new Error(`Fail To Create Order`,{cause:400}))
        
    }
        // & ============================= start payment function =================================== 
let orderSession 

if(orderDB.paymentMethod == 'card'){
    if(req.coupon){
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
        let coupon 
        // coupon = % precentage
        // console.log(req.coupon.couponAmmount);
        
        if(req.coupon.isPercentage){
            coupon = await stripe.coupons.create({
                percent_off: req.coupon.couponAmmount,
            })
        }

        // coupon = fixed ammount
        if(req.coupon.isFixedAmmount){
            coupon = await stripe.coupons.create({
                amount_off: req.coupon.couponAmmount * 100,
                currency: 'EGP'
            })
        }
        // console.log("req.couponId",req.couponId);
        // console.log("coupon.id",coupon.id);
        
        req.couponId = coupon.id
        // console.log("req.couponId",req.couponId);

    }
    const token = generateToken({payload:{orderId:orderDB._id},signature: process.env.ORDER_TOKEN,expiresIn:'1h'})
    orderSession = await paymentFunction({
        payment_method_types:['card'],
        mode:'payment',
        customer_email:req.authUser.email,
        metadata:{orderId: orderDB._id.toString()},
        success_url:`${req.protocol}://${req.headers.host}/order/successOrder?token=${token}`,
        cancel_url:`${req.protocol}://${req.headers.host}/order/cancelOrder?token=${token}`,
        line_items:orderDB.products.map((ele)=>{
            return{
                price_data:{
                    currency:'EGP',
                    product_data:{
                        name:ele.title
                    },
                    unit_amount:ele.price*100
                },
                quantity: ele.quantity,
            }
        }),
        discounts: req.couponId ? [{coupon: req.couponId}] : []
    })
} 


        // & ============================= end payment function =================================== 


        if(req.coupon){
        for (const user of req.coupon.couponAssginedToUsers) {
            if(user.userId.toString() == userId.toString()){
                user.usageCount += 1
            }
        }
            await req.coupon.save()
        }
        await productModel.findByIdAndUpdate(
            {_id: productId},
            {
                $inc:{stock: -parseInt(quantity)},
            }
        )


        // ============================ Qr Code ======================================

        const orderQr = await qrCodeFunction({data:{orderId:orderDB._id,products:orderDB.products}})

        //  =========================== create invoice =============================== 

        const user = await userModel.findById(userId)
        const orderCode = `${user.username}_${nanoid(3)}`

        // console.log(orderCode);
        

        const orderInvoice = {
            shipping:{
                name:req.authUser.userName,
                address:orderCode.address,
                city:'Cairo',
                state:'Cairo',
                country:'Cairo'
            },
            orderCode,
            date:orderDB.createdAt,
            items:orderDB.products,
            subTotal:orderDB.subTotal,
            paidAmount:orderDB.paidAmount,


        }
        await createInvoice(orderInvoice, `${orderCode}.pdf`)
        await sendEmailService({
            to: user.email,
            subject: 'order details',
            message: '<h1>Please find your invoice pdf bloew</h1>',
            attachments:[{
                path: `./Files/${orderCode}.pdf`
            }]
            
        })
        // console.log(`${orderCode}.pdf`)
    return res.status(201).json({message:"Done",orderDB, checkOut_URL:orderSession.url})
}



// ^ ========================== from cart to order ======================

export const fromCartToOrder = async (req,res,next) =>{
    const userId = req.authUser._id
    const {cartId} = req.query
    const {address, phoneNumber, paymentMethod, couponCode} = req.body 


    const cart = await cartModel.findById(cartId)

    if(!cart || !cart.products.length){
        return next(new Error('please fill your cart firnst',{cause:400}))
    }

    // ~  =================================== check the coupon =================================== 
    if(couponCode){

        const coupon = await couponModel.findOne({couponCode}).select('couponAmmount isPercentage isFixedAmmount couponAssginedToUsers')

        const couponValidResult = await isCouponValid({
            userId,
            couponCode,
            next
        })

        if(couponValidResult !== true){
            return couponValidResult
        }
        req.coupon = coupon
    }

    let subTotal = cart.subTotal


        // ~ =================================== paid Ammount ===================================

        let paidAmount = 0

        if(req.coupon?.isPercentage){
            paidAmount = subTotal * (1 - (req.coupon.couponAmount || 0) / 100)
        }
        else if(req.coupon?.isFixedAmount){
            paidAmount = subTotal - req.coupon.couponAmount
        }
        else{
            paidAmount = subTotal
        }
    
    // ~ ============================ payment method ===========================
        let orderStatus 
    
        paymentMethod == 'cash' ? (orderStatus = 'placed') : (orderStatus = 'pending')

        let orderProduct = []

        // console.log(cart.products);

        for (const product of cart.products) {
            const productExsist = await productModel.findById(product.productId)
            orderProduct.push({
                productId:product.productId,
                quantity:product.quantity,
                title:productExsist.title,
                price:productExsist.price,
                finalPrice:productExsist.priceAfterDiscount * product.quantity
             })
        }

        // console.log(orderProduct);
        
          
    const orderObject = {
        userId,
        products:orderProduct,
        address,
        phoneNumber,
        orderStatus,
        paymentMethod,
        subTotal,   
        paidAmount,  
        productNumbers:orderProduct.length, 
        couponId: req.coupon?._id
    }
    const orderDB = await orderModel.create(orderObject)
    if(orderDB){
        
        if(req.coupon){
        for (const user of req.coupon.couponAssginedToUsers) {
            if(user.userId.toString() == userId.toString()){
                user.usageCount += 1
            }
        }
            await req.coupon.save()
        }

        for (const product of cart.products) {

            await productModel.findByIdAndUpdate(
                {_id:product.productId}
                ,{
                    $inc:{stock: -parseInt(product.quantity)},
                }
            )
        }

        cart.products = []
        await cart.save()
    return res.status(201).json({message:"Done",orderDB, cart})
}

return next(new Error(`Fail To Create Order`,{cause:400}))

    }

// ^ ========================== Success Payment ======================


export const successCase = async(req,res,next) =>{

    const {token} = req.query

    const decodeData = verifyToken({token, signature:process.env.ORDER_TOKEN})

    const order = await orderModel.findOne({_id:decodeData.orderId, orderStatus:'pending'})

    if(!order){
        return next(new Error('InValid Order',{case:400}))
    }

    order.orderStatus = 'confirmed'

    await order.save()

    res.status(200).json({message:'Your Order Confimed',order})
}


// ^ ========================== Cancel Payment ======================

export const cancelCase = async(req,res,next) =>{

    const {token} = req.query

    const decodeData = verifyToken({token, signature:process.env.ORDER_TOKEN})

    const order = await orderModel.findOne({_id:decodeData.orderId})

    if(!order){
        return next(new Error('Not Found Order',{case:400}))
    }

    order.orderStatus = 'canceled'

    await order.save()



    for(let product of order.product){
        const product = await findByIdAndUpdate(product.productId,{
             $inc:{stock: parseInt(product.quantity)}
        })
    }

    

    res.status(200).json({message:'Your Order Canceled',order})
}
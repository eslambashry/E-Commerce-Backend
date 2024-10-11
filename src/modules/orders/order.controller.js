import { couponModel } from "../../../DB/Models/coupon.model.js"
import { orderModel } from "../../../DB/Models/order.model.js"
import { productModel } from "../../../DB/Models/product.model.js"
import { isCouponValid } from "../../units/copunValidations.js"


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
            return couponValidResult
        }
        req.coupon = coupon
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

    if(req.coupon?.isPercentage){
        paidAmount = subTotal * (1 - (req.coupon.couponAmount || 0) / 100)
    }
    else if(req.coupon?.isFixedAmount){
        paidAmount = subTotal - req.coupon.couponAmount
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
    const orderDB = await orderModel.create(orderObject)

    // handel the stock count minimize it by the quantity of the order
    if(orderDB){
        
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

    return res.status(201).json({message:"Done",orderDB})
}

return next(new Error(`Fail To Create Order`,{cause:400}))

}


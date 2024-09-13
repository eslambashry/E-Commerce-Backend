import { couponModel } from "../../../DB/Models/coupon.model"
import { productModel } from "../../../DB/Models/product.model"
import { isCouponValid } from "../../units/copunValidations"

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

    
    // ~ ===================================  ===================================
}


import { couponModel } from "../../../DB/Models/coupon.model.js"

export const createCoupon = async(req,res,next) => {
    const {
        couponCode,
        isPercentage,
        isFixedAmmount,
        couponAmmount,
        fromDate,
        toDate,
        couponAssginedToUsers,
    } = req.body
    

//IS COUPONCODE DOUPLICATED
    const isDoublicated = await couponModel.findOne({couponCode})
    if(isDoublicated){
        return res.status(400).json({message:"coupon code id doublicate"})
    }

//IF NO isPercentage AND isFixedAmmount SENT OR BOTH SENT
    if((!isPercentage && !isFixedAmmount) || (isPercentage && isFixedAmmount)){
        return res.status(400).json({message:"select if coupon is persentage or fixed ammount"})
    }

    const couponObject = {
        couponCode,
        couponAmmount,
        fromDate,
        toDate,
        isPercentage,
        isFixedAmmount,
        createdBy:req.authUser._id,
    }

    const couponDB = await couponModel.create(couponObject)
    if(!couponDB){
        return res.status(400).json({message:"Fail To Store Data"})
    }
    return res.status(200).json({message:"coupon created",couponDB})
}

export const deleteCoupon = async(req,res,next) => {
    const { _id } = req.query

        const isCouponExsist = await couponModel.findByIdAndDelete({_id})

        if(!isCouponExsist){
          return res.status(400).json({message: "Coupon Id Is Incorrect"})
        }

            res.status(200).json({message: "DONE"})
}


import { couponModel } from "../../DB/Models/coupon.model"

export const isCouponValid = async  ({userId, couponCode, next} = {}) =>{
    const coupon = await couponModel.findOne({ couponCode })

    if(!coupon){
        return next( new Error('please enter valid coupon code'))
    }

    if(coupon.coupunStatus == 'Expired'  || moment(coupon.toDate).isBefore(moment())){
        return next ( new Error('please enter valid coupon',{cause:400}))
    }

        for (const user of coupon.couponAssginedToUsers) {

            if(userId.toString() !== user.userId.toString())
            {
                return next(new Error('this coupon did not assigned to this user',{cause:400}))
            }

            if(user.maxUsage < user.usageCount){
                return next(new Error('u are exceed the max lenght',{cause:400}))
            }
            
        }


        return true;
}
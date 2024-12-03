import { couponModel } from "../../DB/Models/coupon.model.js"
import moment from 'moment';

export const isCouponValid = async  ({userId, couponCode, next} = {}) =>{
    const coupon = await couponModel.findOne({ couponCode })

    if(!coupon){
        // return next( new Error('please enter valid coupon code'))
        return{
            msg:'please enter valid coupon code'
        }
    }

    if(coupon.coupunStatus == 'Expired'  || moment( new Date(coupon.toDate)).isBefore(moment())){
        // return next ( new Error('please enter valid coupon',{cause:400}))
        return{
            msg:'please enter valid coupon'
        }
    }

    if(coupon.coupunStatus == 'Valid'  && 
        moment().isBefore(moment(new Date(coupon.fromDate)))){
        // return next ( new Error('please enter valid coupon',{cause:400}))
        return{
            msg:'coupon does not started yet'
        }
    }

    let notAssginedUser = []
    let exceedMaxUsage = false

        for (const user of coupon.couponAssginedToUsers) {


            notAssginedUser.push(user.userId.toString())
            if(user.maxUsage <= user.usageCount){
                 exceedMaxUsage = true
            
            }
            
        }

//=================================== loob for all user ================================== 
        if(!notAssginedUser.includes(userId.toString())){
            console.log(notAssginedUser);
            
            return{
                notAssgined: true,
                msg: 'this user not assgined to that coupon'
            }
        }

        if(exceedMaxUsage){
            return{
                 msg: 'u are exceed the max lenght'
            }
        }

        return true;
}
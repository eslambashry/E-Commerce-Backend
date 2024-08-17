import moment from "moment"
import { scheduleJob } from "node-schedule"
import { couponModel } from "../../DB/Models/coupon.model.js"


export const changeCouponStatesCorn = () => {
    scheduleJob('0 0 * * *', async function(){ // running every day at 12AM
        const validCoupons = await couponModel.find({ coupunStatus: 'Valid'})

            for(const coupon of validCoupons){
                // console.log({
                //     momentToDate:moment(coupon.toDate),
                //     now: moment(),
                //     cond: moment(coupon.toDate).isBefore(moment())
                // })
                if(moment(coupon.toDate).isBefore(moment())){
                coupon.coupunStatus = 'Expired'
                }
                await coupon.save()
            }
            console.log(`corn changeCouponStatesCorn() is running`);
    })
} 


// 0: Minute field (0th minute of the hour)
// 0: Hour field (0th hour of the day, which is 12:00 AM)
// *: Day of the month field (every day of the month)
// *: Month field (every month)
// *: Day of the week field (every day of the week)
import joi from 'joi'
import { generalFields } from '../../middelware/validation.js'
export const createcouponSchema = {
    body: joi
    .object({
        couponCode: joi.string().min(5).max(55).required(),
        couponAmmount: joi.number().positive().min(1).max(100).required(),
        fromDate: joi.date().greater(Date.now()).required(),
        toDate: joi.date().greater(joi.ref('fromDate')).required(),
        isPercentage: joi.boolean().optional(),
        isFixedAmmount: joi.boolean().optional(),
        couponAssginedToUsers: joi.optional(),
    })
    .required()
}

export const deleteCouponSchema = {
    query: joi.object({_id: generalFields._id.required()}).required(),
}



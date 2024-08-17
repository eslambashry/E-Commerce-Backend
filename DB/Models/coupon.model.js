import { Schema, model } from "mongoose";

const couponSchema = new Schema(
    {
        couponCode: {
            type: String,
            require: true,
            unique: true,
            lowercase: true,
        },
        couponAmmount: {
            type: Number,
            required: true,
            default: 1,
            min: 1,
            max: 100
        },
        isPercentage: {
            type: Boolean,
            required: true,
            default: false
        },
        isFixedAmmount: {
            type: Boolean,
            required: true,
            default: false
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        couponAssginedToUsers:[{
            userId:{
                type: Schema.Types.ObjectId,
                ref:'User',
                required:true,
            },
            maxUsage:{
                type:Number,
                required:true,
                default:1,
            }
        }],
        fromDate:{
            type:String,
            required:true,
        },
        toDate:{
            type:String,
            required:true,
        },
        coupunStatus:{
            type:String,
            required:true,
            enum:['Expired','Valid'],
            default:'Valid'
        }
    },
    { timestamps: true }
)

export const couponModel = model('coupon', couponSchema)

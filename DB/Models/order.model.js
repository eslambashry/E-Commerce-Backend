import { Schema , model} from "mongoose";


const orderSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'product',
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                required: true,
              },
              title: {
                type: String,
                required: true,
              },
              price: {
                type: Number,
                required: true,
              },
              finalPrice: {
                type: Number,
                required: true,
            },
        },
    ],

    subTotal:{
        type:Number,
        default: 0,
        required: true 
    },
    couponId: {
        type: Schema.Types.ObjectId,
        ref: 'coupon',
      },
    paidAmount:{
        type:Number,
        default: 0,
        required: true
    },
    productNumbers:{type:Number,required:true},
    orderStatus:{
        type:String,
        enum:[
            'pending',
            'confirmed',
            'placed',
            'preparation',
            'on way',
            'delivered',
            'canceled'
        ],
    },
    paymentMethod:{
        type:String,
        required:true,
        enum:['card','cash']
    },
    updatedBy:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    canceledBy:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    reason:String


}, { timestamps: true })

export const orderModel = model('order', orderSchema)
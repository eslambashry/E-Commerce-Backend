import { Schema } from "mongoose";


const orderSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
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
                required: true
            },
        },
    ],

    subTotal:{
        type:Number,
        default: 0,
        required: true 
    },
    paidAmount:{
        type:Number,
        default: 0,
        required: true
    },
    productNumbers:[{type:String,required:true}],

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
        enum:['cart','cash']
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
import { Schema,model } from "mongoose";

const categorySchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
        },
        Image: {
            secure_url:{
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            },
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required:true,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        customId: String,
    },
    {
    toObject:{virtuals: true}, // to show in log
    toJSON:{virtuals: true},   // to show in res
    timestamps: true,
    },
    )
    
    categorySchema.virtual('subCategory', {  // is virtual object do not store in database [is to conctenate two collection togther parant like(category) child like(subCategory)]
        ref: 'subCategory',
        foreignField: 'categoryId',
        localField: '_id'
    })
export const categoryModel = model('Category', categorySchema)
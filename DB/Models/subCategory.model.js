import { Schema, model } from "mongoose";

const subCategorySchema = new Schema(
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
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        
        customId: String,
    },
    {
    toObject:{virtuals: true}, // to show in log
    toJSON:{virtuals: true},
    timestamps: true,
    }
)

subCategorySchema.virtual('Brand', {
    ref: 'Brand',
    foreignField: 'subCategoryId',
    localField: '_id'
})

export const subCategoryModel = model('subCategory', subCategorySchema) 

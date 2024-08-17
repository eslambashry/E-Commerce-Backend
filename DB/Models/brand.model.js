import { Schema,model } from "mongoose";

const brandSchema = new Schema(
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
        logo: {
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
            required: true,
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
        subCategoryId: {
            type: Schema.Types.ObjectId,
            ref: 'subCategory',
            required: true,
        },
        customId: String,
    },
    {
    timestamps: true,
    }
)

export const brandModel = model('Brand', brandSchema) 

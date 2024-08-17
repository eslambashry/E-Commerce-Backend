import slugify from "slugify"
import { categoryModel } from "../../../DB/Models/category.model.js"
import { subCategoryModel } from "../../../DB/Models/subCategory.model.js"
import cloudinary from "../../units/cloudinaryConfigrations.js"
import { brandModel } from "../../../DB/Models/brand.model.js"
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)

// ================== Create brand =====================
export const createBrand = async (req, res, next) => {
    const { name } = req.body
    const { subCategoryId, categoryId  } = req.query

    const categoryIdExist = await categoryModel.findById(categoryId)
    const subCategoryIdExist = await subCategoryModel.findById(subCategoryId)

    if (!categoryIdExist || !subCategoryIdExist) {
        return next(new Error('Invalid CategoryId', { cause: 400 }))
    }

    const slug = slugify(name, {
        replacement: '_',
        lower: true
    })

    if (!req.file) {
        return next(new error('Please Upload Image', { cause: 400 }))
    }
    const customId = nanoid()
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
            folder: `${process.env.PROJECT_FOLDER}/Categories/${categoryIdExist.customId}/subCategories/${subCategoryIdExist.customId}/Brands/${customId}`  
        }
    )
    const brandObject = {
        name,
        slug,
        customId,
        logo: {secure_url, public_id},
        categoryId,
        subCategoryId,
    }

    const brandDb = await brandModel.create(brandObject)
    if(!brandDb){
        await cloudinary.uploader.destroy(public_id)
        return next(new Error('Try again later',{cause:400}))
    }
    res.status(201).json({message:'Prand Added',brandDb})
}

// ================== get all brand =====================
export const getAllBrand = async (req, res, next) => {

    const brand = await brandModel.find().populate([
        {
            path: 'categoryId',
        }
    ])

    res.status(200).json({ message: 'Done', brand })
}

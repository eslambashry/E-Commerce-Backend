import slugify from "slugify";
import { categoryModel } from "../../../DB/Models/category.model.js";
import cloudinary from "../../units/cloudinaryConfigrations.js"
import { subCategoryModel } from "../../../DB/Models/subCategory.model.js";
import { customAlphabet } from 'nanoid'
import { brandModel } from "../../../DB/Models/brand.model.js";
import { productModel } from "../../../DB/Models/product.model.js";
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)

//===================== Create Category =================
export const createCategory = async (req, res, next) => {
    const {_id} = req.authUser
    const { name } = req.body
    const slug = slugify(name, '_')

    if (await categoryModel.findOne({ name })) {
        return next(new Error('This category already exists', { cause: 400 }))
    }

    if (!req.file) {
        return next(new Error('Please upload category image', { cause: 400 }))
        console.log(req.file);
    }

    const customId = nanoid()
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path, {
        folder: `${process.env.PROJECT_FOLDER}/Categories/${customId}`
    })
    const categoryObject = {
        name,
        slug,
        customId,
        Image: {
            secure_url, public_id
        },
        createdBy:_id,
    }
    const category = await categoryModel.create(categoryObject)

    if (!category) {
        await cloudinary.uploader.destroy(public_id)
        return next(
            new Error('try again later , fail to add', { cause: 400 })
        )
    }
    res.status(200).json({ message: "added done", category })
}

//===================== Update Category =================
export const updateCategory = async (req, res, next) => {
    const {_id} = req.authUser
    const { categoryId } = req.params
    const { name } = req.body

    const category = await categoryModel.findOne({ _id:categoryId, createdBy:_id})

    if (!category) {
        return next(new Error('inValid category id', { cause: 400 }))
    }

    if (name) {

        if (category.name == name.toLowerCase()) {
            return next(new Error('Can not use same category name', { cause: 400 }))
        }
        if (await categoryModel.findOne({ name })) {
            return next(new Error('This category already exists', { cause: 400 }))
        }

        category.name = name
        category.slug = slugify(name, '_')
    }

    if (req.file) {

        await cloudinary.uploader.destroy(category.Image.public_id)

        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}`
        })

        category.Image = { secure_url, public_id }

    }
    category.updatedBy = _id
    await category.save()
    res.status(200).json({ message: 'Updated Done', category })
}

//===================== Get All Category =================
export const getAllCategory = async (req, res, next) => {
    const categories = await categoryModel.find().populate([{
        path: 'subCategory',
        populate: [{
            path: 'Brand',
        }]
    }])
    res.status(200).json({ message: 'Done', categories })
}

//===================== Delete Category =================
export const deleteCategory = async (req, res, next) => {
    const {_id} = req.authUser
    const { categoryId } = req.query

    const categoryExsist = await categoryModel.findOneAndDelete({categoryId, createdBy:_id})
    if (!categoryExsist) {
        return next(new Error('Invalid Id', { cause: 400 }))
    }
    //Deleted from cloudinary
    await cloudinary.api.delete_resources_by_prefix(
        `${process.env.PROJECT_FOLDER}/Categories/${categoryExsist.customId}`
    )

    await cloudinary.api.delete_folder(
        `${process.env.PROJECT_FOLDER}/Categories/${categoryExsist.customId}`
    )
    // deleted from DB
    const deleteRelatedSubCategories = await subCategoryModel.deleteMany({
        categoryId,
    }) // deleteMany() return deleteCount={}
    const deleteRelatedBrand = await brandModel.deleteMany({
        categoryId,
    })
    const deleteRelatedProduct = await productModel.deleteMany({
        categoryId
    })                           //==> brand Id is required in products

    if (!deleteRelatedSubCategories.deletedCount){
        return next(new Error('No Related SubCategory', { cause: 400 }))
    } 

      if(!deleteRelatedBrand.deletedCount){
        return next(new Error('No Related Brand', { cause: 400 }))
        }
        
        if(!deleteRelatedProduct.deletedCount){
            return next(new Error('No Related Product', { cause: 400 }))
            }
        res.status(200).json({ message: 'Category deleted' })
}


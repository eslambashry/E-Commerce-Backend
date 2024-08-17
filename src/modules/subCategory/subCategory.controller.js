import slugify from "slugify"
import { categoryModel } from "../../../DB/Models/category.model.js"
import { subCategoryModel } from "../../../DB/Models/subCategory.model.js"
import cloudinary from "../../units/cloudinaryConfigrations.js"
import { brandModel } from "../../../DB/Models/brand.model.js"
import { productModel } from "../../../DB/Models/product.model.js"
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)



//====================== Create Sub Category ============================
export const createSubCategory = async (req, res, next) => {
    const {_id} = req.authUser
    const { categoryId } = req.params
    const { name } = req.body

    const category = await categoryModel.findOne({ _id:categoryId, createdBy:_id})
    //check categoryId
    if (!category) {
        return next(new Error('invalid categoty id', { cause: 400 }))
    }

    //name is unique
    if (await subCategoryModel.findOne({ name })) {
        return next(new Error('this name is already exsist', { cause: 400 }))
    }

    //generate slug
    const slug = slugify(name, '_')

    //upload image
    if (!req.file) {
        return next(new Error('Please Upload An Image', { cause: 400 }))
    }
    const customId = nanoid()
    //host
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
            folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/subCategories/${customId}`,
        },
    )
    const subCategoryObject = {
        name,
        slug,
        customId,
        Image: {
            secure_url, public_id
        },
        categoryId,
        createdBy:_id,
    }
    const subCategory = await subCategoryModel.create(subCategoryObject)
    if (!subCategory) {
        await cloudinary.uploader.destroy(public_id)
        return next(new Error('try again later', { cause: 400 }))
    }
    res.status(201).json({ message: 'sub category added', subCategory })
}

//====================== get all Sub Category ============================
export const getAllSubCategory = async (req, res, next) => {
    const subCategory = await subCategoryModel.find().populate([
        {
            path: 'categoryId',
        }
    ])
    res.status(200).json({ message: 'Done', subCategory })
}

//====================== Update Sub Category ============================
export const UpdateSubCategory = async (req, res, next) => {

    //input 
    const {_id} = req.authUser
    const { subCategoryId } = req.query
    const { name } = req.body

    //check is sub categoryId is Exsist 
    const subCategoryIdExsist = await subCategoryModel.findOne({ _id:subCategoryId, createdBy:_id})
    if (!subCategoryIdExsist) {
        return next(new Error('Invalid id', { cause: 400 }))
    }

    //check new name is 1- = same name 2- already exsist
    if (name) {
        if (subCategoryIdExsist.name == name) {
            return next(new Error('Can Not Insert Same Sub Category Name', { cause: 400 }))
        }
        if (await subCategoryModel.findOne({ name })) {
            return next(new Error('Name Is Already Exsist', { cause: 400 }))
        }
    }

    // name&slug = new name

    subCategoryIdExsist.name = name
    subCategoryIdExsist.slug = slugify(name, '_')

    //if image destroy and store

    if (req.file) {
        await cloudinary.uploader.destroy(subCategoryIdExsist.Image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.PROJECT_FOLDER}/Categories/${subCategoryIdExsist.customId}`
        })
        subCategoryIdExsist.Image = { secure_url, public_id }
    }


    // category.save
    subCategoryIdExsist.updatedBy = _id
    await subCategoryIdExsist.save()
    res.status(200).json({ message: 'Updated Done', subCategoryIdExsist })
}

//====================== Delete Sub Category ============================
export const DeleteSubCategory = async (req, res, next) => {


//input subCategoryid

    const { subCategoryId,categoryId } = req.query


//find and delete

    const subCategoryIdExsist = await subCategoryModel.findByIdAndDelete(subCategoryId)
    const categoryIdExsist = await categoryModel.findById(categoryId)

    if (!subCategoryIdExsist || !categoryIdExsist) {
        return res.status(400).json({ message: 'Invalid Id' })
    }
//delete 1-resourse 2-foldeer

    await cloudinary.api.delete_resources_by_prefix(
        `${process.env.PROJECT_FOLDER}/Categories/${categoryIdExsist.customId}/subCategories/${subCategoryIdExsist.customId}`
    )

    await cloudinary.api.delete_folder(
        `${process.env.PROJECT_FOLDER}/Categories/${categoryIdExsist.customId}/subCategories/${subCategoryIdExsist.customId}`
    )

//delete related brand & Product        
    const deleteRelatedBrand = await brandModel.deleteMany({
        subCategoryId
    })
    
    const deleteRelatedproduct = await productModel.deleteMany({
        subCategoryId
    })
//check related is not found
    if (!deleteRelatedBrand.deletedCount || !deleteRelatedproduct.deletedCount) {
        return res.status(400).json({ message: 'Try again' })
    }

//deleted
    res.status(200).json({ message: 'Sub Category Deleted' })
}
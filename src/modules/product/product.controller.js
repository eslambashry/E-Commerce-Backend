import slugify from "slugify"
import { brandModel } from "../../../DB/Models/brand.model.js"
import { categoryModel } from "../../../DB/Models/category.model.js"
import { subCategoryModel } from "../../../DB/Models/subCategory.model.js"
import cloudinary from "../../units/cloudinaryConfigrations.js"
import { customAlphabet } from 'nanoid'
import { productModel } from "../../../DB/Models/product.model.js"
import { pagination } from "../../units/pagination.js"
import { apiFeatures } from "../../units/apiFeature.js"
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)


//======================= add new product =============================
export const addProduct = async (req, res, next) => {
    const { title, desc, price, appliedDiscount, colors, sizes, stock } = req.body
  
    const { categoryId, subCategoryId, brandId } = req.query
    // check Ids
    
    const categoryExists = await categoryModel.findById(categoryId)
    if (!categoryExists) {
        return next(new Error('invalid categoryId', { cause: 400 }))
    }
    const subCategoryExists = await subCategoryModel.findById(subCategoryId)
    
    if (!subCategoryExists) {
        return next(new Error('invalid subCategoryId', { cause: 400 }))
    }
    const brandExists = await brandModel.findById(brandId)
    if (!brandExists) {
        return next(new Error('invalid brandId', { cause: 400 }))
    }
    
  
    const slug = slugify(title, {
      replacement: '_',
    })
    //   if (appliedDiscount) {
    //   const priceAfterDiscount = price - price * ((appliedDiscount || 0) / 100)
    const priceAfterDiscount = price * (1 - (appliedDiscount || 0) / 100)
    //   }
  
    if (!req.files) {
      return next(new Error('please upload pictures', { cause: 400 }))
    }
    const customId = nanoid()
    console.log(customId);
    const Images = []
    const publicIds = []
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.PROJECT_FOLDER}/Categories/${categoryExists.customId}/subCategories/${subCategoryExists.customId}/Brands/${brandExists.customId}/Products/${customId}`,
        },
      )
      Images.push({ secure_url, public_id })
      publicIds.push(public_id)
    }
   
    req.imagePath = `${process.env.PROJECT_FOLDER}/Categories/${categoryExists.customId}/subCategories/${subCategoryExists.customId}/Brands/${brandExists.customId}/Products/${customId}`

    const productObject = {
      title,
      slug,
      desc,
      price,
      appliedDiscount,
      priceAfterDiscount,
      colors,
      sizes,
      stock,
      categoryId,
      subCategoryId,
      brandId,
      Images,
      customId,
    }
    productObject = 8
    const product = await productModel.create(productObject)
    // TODO: delete the uploaded pirctures if the function fail in catch scope
    if (!product) {
      await cloudinary.api.delete_resources(publicIds)
      return next(new Error('trye again later', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', product })
}

//======================= Update product =============================
export const updateproduct = async (req, res, next) => {

    const { title, desc, price, appliedDiscount, colors, sizes, stock } = req.body

    const { categoryId, subCategoryId, brandId, productId } = req.query

    const productExsist = await productModel.findById(productId)
    if (!productExsist) {
        return res.status(400).json({ message: 'InValid Product Id' })
    }
    const subCategoryIdExsist = await subCategoryModel.findById(
        subCategoryId || productExsist.subCategoryId)
    if (subCategoryId) {
        subCategoryIdExsist = await subCategoryModel.findById(subCategoryId)
        if (!subCategoryIdExsist) {
            res.status(400).json({ message: 'Invalid subCategory id' })
        }
        productExsist.subCategoryId = subCategoryId
    }
     const categoryIdExsist = await categoryModel.findById(
        categoryId || productExsist.categoryId)
    if (categoryId) {
        categoryIdExsist = await categoryModel.findById(categoryId)
        if (!categoryIdExsist) {
            res.status(400).json({ message: 'Invalid category id' })
        }
        productExsist.categoryId = categoryId
    }
     const brandIdExsist = await brandModel.findById(brandId || productExsist.brandId)
    if (brandId) {
        brandIdExsist = await brandModel.findById(brandId)
        if (!brandIdExsist) {
            res.status(400).json({ message: 'Invalid brand id' })
        }
        productExsist.brandId = brandId
    }

    if(title){
       productExsist.slug = slugify(title, {
            replacement: '_',
        })    }
    if (price && appliedDiscount) {
        const priceAfterDiscount = price - (price * (appliedDiscount || 0) / 100)
        productExsist.priceAfterDiscount = priceAfterDiscount
        productExsist.price = price
        productExsist.appliedDiscount = appliedDiscount
    }
    else if (price) {
        const priceAfterDiscount = price - price * (productExsist.appliedDiscount / 100)
        productExsist.priceAfterDiscount = priceAfterDiscount
        productExsist.price = price 
    }
    else if (appliedDiscount) {
        const priceAfterDiscount = productExsist.price - productExsist.price * (appliedDiscount / 100)
        productExsist.priceAfterDiscount = priceAfterDiscount
        productExsist.appliedDiscount = appliedDiscount
    }

    if (req.files?.length) {
        let imageArr = []
        for (const file of req.files) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(
                file.path, {
                folder: `${process.env.PROJECT_FOLDER}/Categories/${categoryIdExsist.customId}/subCategories/${subCategoryIdExsist.customId}/Brands/${brandIdExsist.customId}/Products/${productExsist.customId}`
            }
            )
            imageArr.push({ secure_url, public_id })
        }
        let public_ids = []
        for (const image of productExsist.Images) {
            public_ids.push(image.public_id)
        }
        await cloudinary.api.delete_resources(public_ids)
        productExsist.Images = imageArr
    }

    if(title)
        productExsist.title = title

    if(desc)
        productExsist.desc = desc
    
    if(colors)
        productExsist.colors = colors
    
    if(sizes)
        productExsist.sizes = sizes

    if(stock)
        productExsist.stock = stock   
           

        productExsist.save()

        res.status(200).json({message:'Update Done', productExsist})
}

//======================= list product page size =============================
export const productList = async(req,res,next) => {
    const {page, size} = req.query
    const {limit, skip} = pagination({page, size}) 

    const productList = await productModel.find().limit(limit).skip(skip)

    res.status(200).json({message:'Done', productList})
}

//======================= list product by name =============================
export const getProductByName = async(req,res,next) => {
    const {page, size,searchKey} = req.query
    const {limit, skip} = pagination({page, size}) 

    const productList = await productModel.find({
        $or: [
       { title:{$regex: searchKey, $options:'i'}}, // regex title contain those letters | options ont sensetive to uppercase i=insensitve
        {desc:{$regex: searchKey, $options:'i'}}   // regex title contain those letters | options ont sensetive to uppercase i=insensitve
        ],
    }).limit(limit).skip(skip)

    res.status(200).json({message:'Done', productList})
}

//======================= Delete product =============================
export const deleteProduct = async(req,res,next) => {


    //input id
    const {productId} = req.query
    
    //find product
    const product = await productModel.findByIdAndDelete(productId)
    if(!product){
       return res.status(400).json({message: ' in Valid Id || not found product'})
    }
 
    const category = await categoryModel.findById(product.categoryId)
    if(!category) return res.status(400).json({message: 'invalid categoryId'})
     
    const subCategory = await subCategoryModel.findById(product.subCategoryId)
    if(!subCategory) return res.status(400).json({message: 'invalid subcategoryId'})
 
    const brand = await brandModel.findById(product.brandId)
    if(!brand) return res.status(400).json({message: 'invalid brandId'})
 

    //delete folder
    await cloudinary.api.delete_resources_by_prefix(
        `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/subCategories/${subCategory.customId}/Brands/${brand.customId}/Products/${product.customId}`
    )
    await cloudinary.api.delete_folder(
        `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/subCategories/${subCategory.customId}/Brands/${brand.customId}/Products/${product.customId}`
    )

    //deleted

    res.status(200).json({ message: 'product Deleted'})
}

//======================= list product with class =============================
export const listProduct = async(req,res,next) => {

const apiFeatureInstance = new apiFeatures(productModel.find({}),req.query).pagination().sort().select().filter()
const products = await apiFeatureInstance.mongooQuery

    res.status(200).json({message:'Done', products})    
}


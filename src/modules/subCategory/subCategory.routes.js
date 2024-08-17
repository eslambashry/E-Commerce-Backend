import { Router } from "express";
import { isAuth } from "../../middelware/auth.js";
import { validationCoreFunction } from "../../middelware/validation.js";
import { multerCloudFunction } from "../../servecis/multerCloud.js";
import { allowedExtensions } from "../../units/allowedEtentions.js";
import { asynchandler } from "../../units/errorHandeling.js";
import * as sc from '../subCategory/subCategory.controller.js'
import * as validator from '../subCategory/subCategory.validationSchema.js'
const router = Router()

router.post('/:categoryId',isAuth(), multerCloudFunction(allowedExtensions.Image).single('image'),
validationCoreFunction(validator.createSubCategorySchema)
,asynchandler(sc.createSubCategory))

router.get('/',validationCoreFunction(validator.createSubCategorySchema)
,asynchandler(sc.getAllSubCategory))

router.put('/',isAuth(),multerCloudFunction(allowedExtensions.Image).single('image'),
validationCoreFunction(validator.UpdateSubCategorySchema)
,asynchandler(sc.UpdateSubCategory))

router.delete('/',asynchandler(sc.DeleteSubCategory))


export default router




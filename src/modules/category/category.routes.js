import { Router } from "express";
import { validationCoreFunction } from "../../middelware/validation.js";
import { multerCloudFunction } from "../../servecis/multerCloud.js";
import { allowedExtensions } from "../../units/allowedEtentions.js";
import { asynchandler } from "../../units/errorHandeling.js";
import * as cc from './category.controller.js'
import * as validator from './category.validationSchema.js'
import {isAuth} from '../../middelware/auth.js'
const router = Router()

router.post('/',isAuth(), multerCloudFunction(allowedExtensions.Image).single('image'),
validationCoreFunction(validator.createCategorySchema)
,asynchandler(cc.createCategory))

router.put('/:categoryId',isAuth(), multerCloudFunction(allowedExtensions.Image).single('image'),
validationCoreFunction(validator.updateCategorySchema), 
asynchandler(cc.updateCategory))


router.get('/',validationCoreFunction(validator.createCategorySchema)
,asynchandler(cc.getAllCategory))

router.delete('/',isAuth(),asynchandler(cc.deleteCategory))

export default router
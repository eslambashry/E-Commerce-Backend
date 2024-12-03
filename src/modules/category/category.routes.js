import { Router } from "express";
import { validationCoreFunction } from "../../middleware/validation.js";
import { multerCloudFunction } from "../../services/multerCloud.js";
import { allowedExtensions } from "../../utilities/allowedEtentions.js";
import { asynchandler } from "../../utilities/errorHandeling.js";
import * as cc from './category.controller.js'
import * as validator from './category.validationSchema.js'
import {isAuth} from '../../middleware/auth.js'
import { categoryEndpoints } from "./categoryEndpoints.js";
const router = Router()

router.post('/',isAuth(categoryEndpoints.CREATE_CATEGORY), multerCloudFunction(allowedExtensions.Image).single('image'),
validationCoreFunction(validator.createCategorySchema)
,asynchandler(cc.createCategory))

router.put('/:categoryId',isAuth(categoryEndpoints.UPDATE_CATEGORY), multerCloudFunction(allowedExtensions.Image).single('image'),
validationCoreFunction(validator.updateCategorySchema), 
asynchandler(cc.updateCategory))


router.get('/',validationCoreFunction(validator.createCategorySchema)
,asynchandler(cc.getAllCategory))

router.delete('/',isAuth(categoryEndpoints.DELETE_CATEGORY),asynchandler(cc.deleteCategory))

export default router
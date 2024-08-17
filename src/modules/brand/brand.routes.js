import { Router } from "express";
import { validationCoreFunction } from "../../middelware/validation.js";
import { multerCloudFunction } from "../../servecis/multerCloud.js";
import { allowedExtensions } from "../../units/allowedEtentions.js";
import { asynchandler } from "../../units/errorHandeling.js";
import * as bc from './brand.controller.js'
import * as validator from "./brand.validationSchema.js"

const router = Router()

router.post('/', multerCloudFunction(allowedExtensions.Image).single('logo'),validationCoreFunction(validator.createBrandSchema),
asynchandler(bc.createBrand))

router.get('/',asynchandler(bc.getAllBrand))

export default router
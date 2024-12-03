import { Router } from "express";
import { validationCoreFunction } from "../../middleware/validation.js";
import { multerCloudFunction } from "../../services/multerCloud.js";
import { allowedExtensions } from "../../utilities/allowedEtentions.js";
import { asynchandler } from "../../utilities/errorHandeling.js";
import * as bc from './brand.controller.js'
import * as validator from "./brand.validationSchema.js"

const router = Router()

router.post('/', multerCloudFunction(allowedExtensions.Image).single('logo'),validationCoreFunction(validator.createBrandSchema),
asynchandler(bc.createBrand))

router.get('/',asynchandler(bc.getAllBrand))

export default router
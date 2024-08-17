import { Router } from "express";
import { allowedExtensions } from "../../units/allowedEtentions.js";
import { asynchandler } from "../../units/errorHandeling.js";
import * as cc from './coupon.controller.js'
const router = Router()
import { validationCoreFunction } from "../../middelware/validation.js";
import { createcouponSchema, deleteCouponSchema } from "./coupon.validationSchema.js";
import { isAuth } from "../../middelware/auth.js";


router.post('/',isAuth() ,validationCoreFunction(createcouponSchema),asynchandler(cc.createCoupon))

router.delete('/',validationCoreFunction(deleteCouponSchema),asynchandler(cc.deleteCoupon))

export default router
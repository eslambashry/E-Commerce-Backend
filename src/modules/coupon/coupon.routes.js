import { Router } from "express";
 import { asynchandler } from "../../utilities/errorHandeling.js";
import * as cc from './coupon.controller.js'
const router = Router()
import { validationCoreFunction } from "../../middleware/validation.js";
import { createcouponSchema, deleteCouponSchema } from "./coupon.validationSchema.js";
import { isAuth } from "../../middleware/auth.js";
import { couponEndpoints } from "./couponEndPoint.js";


router.post('/',isAuth(couponEndpoints.CREATE_COUPON) ,validationCoreFunction(createcouponSchema),asynchandler(cc.createCoupon))

router.delete('/',validationCoreFunction(deleteCouponSchema),asynchandler(cc.deleteCoupon))

export default router
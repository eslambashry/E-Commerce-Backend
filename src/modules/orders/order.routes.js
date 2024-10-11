import { Router } from "express";
import { isAuth } from "../../middelware/auth.js";
import { asynchandler } from "../../units/errorHandeling.js";
import * as oc from "../orders/order.controller.js"
const router = Router()

router.post('/',isAuth(),oc.createOrder)

export default router
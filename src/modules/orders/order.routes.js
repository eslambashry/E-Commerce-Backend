import { Router } from "express";
import { isAuth } from "../../middleware/auth.js";
import { asynchandler } from "../../utilities/errorHandeling.js";
import * as oc from "../orders/order.controller.js"
import { orderApisRoles } from "./order.endpoints.js";
const router = Router()

router.post('/',isAuth(orderApisRoles.CREATE_ORDER),oc.createOrder)
router.post('/orderCart',isAuth(),asynchandler(oc.fromCartToOrder))
router.get('/successOrder',asynchandler(oc.successCase))
router.get('/cancelOrder',asynchandler(oc.cancelCase))



export default router
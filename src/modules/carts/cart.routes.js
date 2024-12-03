import { Router } from "express";

const router = Router()

import * as cc from '../carts/cart.controller.js'

import { asynchandler } from "../../utilities/errorHandeling.js";
import { isAuth } from "../../middleware/auth.js";

router.post('/',isAuth(),asynchandler(cc.addToCart))
router.delete('/',isAuth(),asynchandler(cc.deleteFromCart))

export default router
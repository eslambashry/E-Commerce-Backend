import { Router } from "express";

const router = Router()

import * as cc from '../carts/cart.controller.js'

import { asynchandler } from "../../units/errorHandeling.js";
import { isAuth } from "../../middelware/auth.js";

router.post('/',isAuth(),asynchandler(cc.addToCart))
router.delete('/',isAuth(),asynchandler(cc.deleteFromCart))

export default router
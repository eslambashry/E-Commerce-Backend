import * as ac from './auth.controller.js'
import { Router } from "express";
import {asynchandler} from '../../utilities/errorHandeling.js'
const router = Router()

router.post('/',asynchandler (ac.signup))

router.get('/confirm/:token',asynchandler (ac.confirmEmail))

router.post('/login',asynchandler (ac.login))

router.post('/forget',asynchandler (ac.forgetPassword))

router.post('/reset/:token',asynchandler (ac.resetPassword))

router.get('/users',asynchandler (ac.getAllUser))



export default router
 
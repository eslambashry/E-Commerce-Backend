import { Router } from 'express'
import * as pc from './product.controller.js'
import { asynchandler } from '../../utilities/errorHandeling.js'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utilities/allowedEtentions.js'
import * as validators from './product.validationSchema.js'
import { validationCoreFunction } from '../../middleware/validation.js'


const router = Router()

router.post(
    '/',
    multerCloudFunction(allowedExtensions.Image).array('image', 3),validationCoreFunction(validators.addProductSchema),
    asynchandler(pc.addProduct),
  )

router.put(
    '/',multerCloudFunction(allowedExtensions.Image).array('image',2),validationCoreFunction(validators.updateProductSchema),
    asynchandler(pc.updateproduct)
  )

  router.get('/pagination',asynchandler(pc.productList))
  router.get('/title',asynchandler(pc.getProductByName))
  router.get('/',asynchandler(pc.listProduct)) 

 router.delete('/',asynchandler(pc.deleteProduct)) 

 
export default router
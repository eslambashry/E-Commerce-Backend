import { connectionDB } from '../../DB/connection.js'
import { globalResponse } from './errorHandeling.js'
import * as routers from '../modules/index.routes.js'
import { changeCouponStatesCorn } from './corn.js'
 
export const initiateApp = (app, express) => {
    const port = process.env.PORT

app.use(express.json())
connectionDB()

app.use('/category', routers.categoryRouter)
app.use('/subCategory', routers.subCategoryRouter)
app.use('/brand', routers.brandRouter)
app.use('/product', routers.productRouter)
app.use('/coupon', routers.couponRouter)
app.use('/auth', routers.authRouter)
app.use('/cart', routers.cartRouter)
app.use('/order', routers.orderRouter)


app.use('*',(req,res,next) => res.status(404).json({message: '404 not found URL'}))

app.use(globalResponse)

changeCouponStatesCorn() //check coupon is expired every 12am 

app.get('/', (req,res)=>res.send('Hellow World!'))
app.listen(port, () => console.log(`3amo samy listening on port ${port}!`))
}
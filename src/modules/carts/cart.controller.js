import { cartModel } from "../../../DB/Models/cart.model.js"
import { productModel } from "../../../DB/Models/product.model.js"


//========================= Add To Cart ======================================
export const addToCart = async (req, res, next) => {
    const userId = req.authUser._id

    const { productId, quantaty } = req.body

    // Check Product 

    let product = await productModel.findOne({
        _id: productId,
        stock: { $gte: quantaty }
    })

    if (!product) {
        return res.status(400).json({ message: 'Product Not Found' })
    }


    const userCart = await cartModel.findOne({ userId })
    if (userCart) {
        //update quantaty
        let productExsist = false;
        for (const product of userCart.products) {
            if (productId == product.productId) {
                productExsist = true;
                product.quantaty = quantaty;
            }
        }
        //add product
        if (!productExsist) {
            userCart.products.push({ productId, quantaty })
        }
        let subTotal = 0;
        for (const product of userCart.products) {
            const productExsist = await productModel.findById(product.productId)
            subTotal += (productExsist.priceAfterDiscount * product.quantaty) || 0
        }
        const newCart = await cartModel.findOneAndUpdate(
            { userId },
            {
                subTotal,
                products: userCart.products
            },
            { new: true }
        )
        return res.status(200).json({ message: "Done", newCart })
    }

    const cartObject = {
        userId,
        products: [{ productId, quantaty }],
        subTotal: product.priceAfterDiscount * quantaty,
    }

    const cartDB = await cartModel.create(cartObject)

    res.status(201).json({ message: 'Cart Added', cartDB })
}

//============================== delete From Cart ============================
export const deleteFromCart = async (req, res, next) => {

    const userId = req.authUser._id
    const { productId } = req.body

    const product = await productModel.findOne({
        _id: productId,
    })
    let price = product.priceAfterDiscount
    // console.log("priceAfterDiscount: ",price);

    if (!productId) {
        res.status(400).json({ message: "product not found" })
    }

    const userCart = await cartModel.findOne({ userId, 'products.productId': productId }) // loop on productId and check if product match the given product

    userCart.products.forEach((ele) => {
        if (ele.productId == productId) {

            // console.log("subTotal - (Product: price*quantaty) = ", userCart.subTotal," - " ,price * ele.quantaty);
            userCart.subTotal -= (price * ele.quantaty) || 0
            userCart.products.splice(userCart.products.indexOf(ele), 1)

        }
    });

    if (!userCart) {
        return res.status(400).json({ message: 'Product not found' })
    }

        await userCart.save()
        return res.status(200).json({ message: 'Done', userCart })

}
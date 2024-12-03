import { cartModel } from "../../../DB/Models/cart.model.js"
import { productModel } from "../../../DB/Models/product.model.js"


//========================= Add To Cart ======================================
export const addToCart = async (req, res, next) => {
    const userId = req.authUser._id;
    const { productId, quantity } = req.body;

    // Check Product
    const product = await productModel.findOne({
        _id: productId,
        stock: { $gte: quantity }
    }).select('title price priceAfterDiscount'); // Ensure we get title, price, and priceAfterDiscount

    if (!product) {
        return res.status(400).json({ message: 'Product Not Found or not enough stock' });
    }

    const userCart = await cartModel.findOne({ userId });
    if (userCart) {
        // Update quantity or add product
        let productExists = false;

        for (const cartProduct of userCart.products) {
            if (cartProduct.productId.toString() === productId.toString()) { // Ensure comparison works with ObjectId
                productExists = true;
                cartProduct.quantity += quantity; // Increment quantity instead of overwriting
                break;
            }
        }

        // Add product if it doesn't exist
        if (!productExists) {
            userCart.products.push({
                productId: product._id,
                quantity,
                title: product.title, // Add the product title
                price: product.price, // Add the product price
                finalPrice: product.priceAfterDiscount || product.price // Add the price after discount or the base price
            });
        }

        // Calculate new subtotal
        let subTotal = 0;
        for (const cartProduct of userCart.products) {
            const productDetails = await productModel.findById(cartProduct.productId).select('priceAfterDiscount');
            subTotal += (productDetails.priceAfterDiscount * cartProduct.quantity) || 0;
        }

        // Update the cart with the new subtotal and products
        const updatedCart = await cartModel.findOneAndUpdate(
            { userId },
            {
                subTotal,
                products: userCart.products
            },
            { new: true }
        );

        return res.status(200).json({ message: "Cart Updated", updatedCart });
    }

    // Create new cart if it doesn't exist
    const cartObject = {
        userId,
        products: [{
            productId: product._id,
            quantity,
            title: product.title, // Add the product title
            price: product.price, // Add the product price
            finalPrice: product.priceAfterDiscount || product.price // Add the price after discount or the base price
        }],
        subTotal: product.priceAfterDiscount * quantity,
    };

    const cartDB = await cartModel.create(cartObject);
    res.status(201).json({ message: 'Cart Created', cartDB });
};

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

            // console.log("subTotal - (Product: price*quantity) = ", userCart.subTotal," - " ,price * ele.quantity);
            userCart.subTotal -= (price * ele.quantity) || 0
            userCart.products.splice(userCart.products.indexOf(ele), 1)

        }
    });

    if (!userCart) {
        return res.status(400).json({ message: 'Product not found' })
    }

        await userCart.save()
        return res.status(200).json({ message: 'Done', userCart })

}
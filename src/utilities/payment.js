import Stripe from "stripe";

export const paymentFunction = async({
    payment_method_types=['card'], //required // ! payment methods type -> (amazon_payment - paypal - )
    mode='payment', //required
    customer_email = '',//optinal
    metadata = {}, //optinal
    success_url, //required
    cancel_url, //optinal
    discounts = [], //optinal
    line_items=[] //required

}) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const paymentData = await stripe.checkout.sessions.create({
        payment_method_types:['card'], //required // ! payment methods type -> (amazon_payment - paypal - )
        mode:'payment', //required
        customer_email,//optinal
        metadata, //optinal
        success_url, //required
        cancel_url, //optinal
        discounts, //optinal
        line_items //required
    })
    return paymentData;
}



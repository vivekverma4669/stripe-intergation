require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
app.use(express.json());
app.use(cors());
const mongoose = require('mongoose');
const { paymentSchema } = require("./paymentModel");


(async ()=>{
    try {
        const URL = process.env.URL; 
        await   mongoose.connect(`${URL}stripe`); 
        console.log('connected succesfully')
    } catch (error) {
        console.log(error);
    }
})();




app.post("/api/create-checkout-session", async (req, res) => {
    const { products } = req.body;

    const lineItems = products.map((product) => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: product.title,
                images: [product.image]
            },
            unit_amount: Math.round(product.price * 10),
        },
        quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/success",  //front end side 
        cancel_url: "http://localhost:3000/cancel",
    });

 
    const payment = new paymentSchema({
        item: products[0].title, 
        status: true, 
        transId: session.id,
    });
    await payment.save();

    res.json({ id: session.id });
});

app.listen(7000, () => {
    console.log("server start at port 7000")
});
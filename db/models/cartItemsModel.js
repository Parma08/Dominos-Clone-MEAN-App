const mongoose = require('mongoose');
const connection = require('../connection');



const cartItems = new mongoose.Schema({
    customerId:{
        required:true,
     type:mongoose.Schema.Types.ObjectId
    },
    pizzaName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required:true
    }
});

const CartItems = connection.model("CartItems",cartItems);
module.exports = CartItems;


const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const connection = require('../connection');
const customer = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:Number,
        required:true
    },
    role:{
        type:String,
        default:"Customer"
    },
    address:{
        type:String,
        required:true
    },
    cartDetails:[{
           pizzaName: {default:""},
           quantity: {default:0}
    }],
    orderDetails:[{
         default:"",
         type:String,
         orderId:mongoose.Schema.Types.ObjectId
    }],
    date:{
        type:Date,
        default:new Date()
    }
});


const Customer = connection.model('Customer', customer);
module.exports = Customer;
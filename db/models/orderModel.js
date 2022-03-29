const mongoose = require('mongoose');
const connection = require('../connection');


const order = new mongoose.Schema({
    customerID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    pizzaName:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default: new Date()
    },
   address:{
       type:String,
       required:true
   },
   orderStatus:{
       type:String,
       required:true
   },
   price:{
       type:Number,
       required:true
   },
   comment:{
       type:String,
   }

});

const Order = connection.model('Order',order);
module.exports = Order;    
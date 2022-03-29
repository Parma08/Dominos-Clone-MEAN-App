const { application } = require('express');
const express = require('express');
const app = express();
app.use(express.json());
var jwt = require('jsonwebtoken');
require('dotenv').config()
var path = require('path')
var cors = require('cors')

  app.use(cors())

app.use(express.static(path.join(__dirname,'public')));

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'))
})

const customer = require('./db/models/customerModel')
const order = require('./db/models/orderModel')
const cart = require('./db/models/cartItemsModel')
const pizza = require('./db/models/pizzaModel');
const req = require('express/lib/request');
const res = require('express/lib/response');
const CartItems = require('./db/models/cartItemsModel');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        return res.status(200).json({});
    };
    next();
});


app.post('/',(req,res)=>{
    customer.create({name:req.body.name,
email:req.body.email,
password:req.body.password,
mobileNumber:req.body.mobileNumber,
role:req.body.role,
address:req.body.address,
orderDetails:req.body.orderDetails
    }).then(a=>res.send(a)).catch(a=>console.log(a.message));
})




app.post('/postPizzas',(req,res)=>{
    pizza.create({name:req.body.name,
        orderedStatus:req.body.orderedStatus,
        price:req.body.price,
        availableStatus:req.body.availableStatus,
    }).then(a=>res.send(a)).catch(a=>res.send(a.message));
})


app.post('/getPizzas',(req,res)=>{
    pizza.find().then(a=>res.send(a)).catch(e=>console.log(e.message))
})







app.post('/customers',(req,res)=>{
    customer.findOne({email: req.body.email}).then(a=>{
        if(a){
             let token = jwt.sign({email:a.email},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1h'});
             res.send([a,token])
        }
        else{
            res.send(a);
        }
    }).catch(e=>console.log(e))
})

var decodedToken;
app.post('/userName',(req,res)=>{
    let token= req.body.token
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,tokenData)=>{
        if(err){
            console.log("ERROR at /username: ",err.message);
            res.send("404")
        }
        if(tokenData){
            decodedToken = tokenData;
            res.send(decodedToken.email)
        }
    })
  
})


app.post('/getInfo',(req,res)=>{
    customer.findOne({email:req.body.email}).then(a=>res.send([a.name,a.address,a.mobileNumber,a.date,a._id,a.orderDetails,a.role,a.email])).catch(e=>res.send(e.message))
})
app.post('/getOrders',(req,res)=>{
    customer.findOne({_id:req.body._id}).then(a=>res.send(a.orderDetails)).catch(e=>res.send(e.message))
})

app.post('/getAllOrders',(req,res)=>{
    order.find({customerID:req.body.customerID}).then(a=>res.send(a)).catch(e=>res.send(e.message))
})


app.post('/addToCart',(req,res)=>{
                  
     cart.create({customerId:req.body.customerId,pizzaName:req.body.pizzaName,quantity:req.body.quantity,price:req.body.price}).then(a=>res.send(a)).catch(e=>res.send(e.message))
    })    

    
    app.post('/getCartItems',(req,res)=>{
                  
        cart.find({customerId:req.body.customerId}).then(a=>res.send(a)).catch(e=>res.send(e.message))
       })    
      
  

app.post('/orders',(req,res)=>{
    order.create({
        customerID:req.body.customerId,
        pizzaName:req.body.pizzaName,
        address:req.body.address,
        orderStatus:"Dilivery in 15Min",
        price: req.body.price
    }).then(a=>res.send(a)).catch(e=>res.send(e.message));
})


app.post('/deleteCartItem',(req,res)=>{
    CartItems.deleteOne({_id:req.body._id}).then(a=>res.send(a)).catch(e=>res.send(e))
})


app.post('/getCartItems',(req,res)=>{
    cart.find({customerId:req.body.customerID}).then(a=>res.send(a)).catch(e=>res.send(e));   
})


app.post('/emptyCartItems',(req,res)=>{
    cart.deleteMany({customerId:req.body.customerID}).then(a=>res.send(a)).catch(e=>res.send(e));
})
   
app.post('/filterOrders',(req,res)=>{
    order.find({customerID:req.body.customerID,date:  { $regex: '.*' +  req.body.date + '.*' }}).then(a=>res.send(a)).catch(e=>res.send(e))

    //
})


// **************
// ***********
// ADMIN STUFF
// ************


//GETS:-
app.post('/admin/getCustomer',(req,res)=>{
    customer.findOne({email:{$regex: req.body.email, $options: 'i'}}).then(a=>res.send(a)).catch(e=>res.send("error"));
})

app.post('/admin/getOrders',(req,res)=>{
    customer.findOne({email:req.body.email}).then(a=>{
      
      
        order.find({customerID:a._id}).then(a=>res.send(a)).catch(e=>res.send(e))
    }).catch(e=>res.send(e))
})


//MODIFIES:-
app.post('/admin/changePizzaAvailability',(req,res)=>{
    pizza.findOne({name:{$regex: req.body.name, $options: 'i'}}).then(a=>{
        pizza.updateOne({_id:a._id}, { $set: {price:req.body.price, availableStatus: req.body.availableStatus }}).then(a=>res.send(a)).catch(e=>res.send(e))
    }).catch(e=>res.send(e));
})


//ADDS:-
app.post('/admin/addPizza',(req,res)=>{
    pizza.create({name:req.body.name,price:req.body.price,availableStatus:req.body.availableStatus}).then(a=>res.send(a)).catch(a=>res.send(a))
})

app.post('/admin/addCustomer',(req,res)=>{
    customer.create({
        name:req.body.name,
        password:req.body.password,
        email:req.body.email,
        mobileNumber:req.body.mobileNumber,
        address:req.body.address,
    }).then(a=>res.send(a)).catch(e=>res.send(e));
})


//Delete:-

app.post('/admin/deleteCustomer',(req,res)=>{
    customer.deleteOne({email:{$regex: req.body.email, $options: 'i'}}).then(a=>res.send(a)).catch(e=>res.send(e))
})

app.post('/admin/deletePizza',(req,res)=>{
    pizza.deleteOne({name:{$regex: req.body.name, $options: 'i'}}).then(a=>res.send(a)).catch(e=>res.send(e))
})

//

app.post('/admin/checkForAdmin',(req,res)=>{
    customer.findOne({_id:req.body.id}).then(a=>res.send(a)).catch(e=>res.send(e))
})



const PORT = process.env.PORT || 8080

app.listen(PORT,()=>console.log(`Listening at port ${PORT}`));
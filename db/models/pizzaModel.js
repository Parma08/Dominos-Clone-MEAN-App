const mongoose = require('mongoose');
const connection = require('../connection');



const pizza = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    orderedStatus: {
        type: Boolean,
    },
    availableStatus: {
        type: Boolean,
        required: true
    }
});

const Pizza = connection.model("Pizza",pizza);
module.exports = Pizza;


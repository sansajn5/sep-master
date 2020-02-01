const mongoose = require('mongoose');

const transaction = mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('transaction', transaction);
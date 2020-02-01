const mongoose = require('mongoose');

const transaction = mongoose.Schema({
    merchantId: {
        type: String,
        required: true
    },
    sellerId: {
        type: String,
        required: true
    },
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
    paymentReference: {
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
    referenceId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('transaction', transaction);
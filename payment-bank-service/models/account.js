const mongoose = require('mongoose');

const account = mongoose.Schema({
    accountNumber: {
        type: String,
        required: true
    },
    pan: {
        type: String,
        required: true
    },
    securityCode: {
        type: String,
        required: true
    },
    cardHolderName: {
        type: String,
        required: true
    },
    expiry: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: false
    },
    clientId: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('account', account);
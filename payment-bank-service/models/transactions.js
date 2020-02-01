let mongoose = require('mongoose');

let transactionsSchema = mongoose.Schema({
    createdAt: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    merchantId: {    // scientific central id
        type: String,
        required: false
    },
    clientId: {   // journal id
        type: String,
        required: false
    },
    amount: {
        type: Number,
        required: true
    },
    merchantOrderId: {
        type: String,
        required:false
    },
    merchantOrderTimeStamp: {
        type: String,
        required:false
    },
    successUrl: {
        type: String,
        required:false
    },
    failedUrl: {
        type: String,
        required:false
    },
    errorUrl: {
        type: String,
        required:false
    }
});

module.exports = mongoose.model('Transaction', transactionsSchema);
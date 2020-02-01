const mongoose = require('mongoose');

const client = mongoose.Schema({
    clientId: {
        type: String,
        required: true
    },
    clientPassword: {
        type: String,
        required: true
    },
    referenceId: {    // external id in scientific centra
        type: String,
        required: true
    },
    merchantId: { // scientific central id
        type: String,
        required: true
    },
});

module.exports = mongoose.model('client', client);
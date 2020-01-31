const mongoose = require('mongoose');

const user = mongoose.Schema({
    referenceId : {
        type: String,
        required: true
    },
    merchantId: {
        type: String,
        required: true
    },
    paypalSecret: {
        type: String,
        required: true
    },
    paypalClient: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('user', user);

const mongoose = require('mongoose');

const bank = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    serviceUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('bank', bank);
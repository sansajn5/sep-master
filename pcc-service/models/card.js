const mongoose = require('mongoose');

const card = mongoose.Schema({
    pan: {
        type: String,
        required: true
    },
    bankCode: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('card', card);
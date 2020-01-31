const User = require('../models/User');

const createUser = async (req, res) => {
    const user = new User({
        referenceId: req.body.userId,
        merchantId: req.body.merchantId,
        paypalSecret: req.body.secret,
        paypalClient: req.body.clientId
    });
    user.save()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json({error: err}));
}

const getUser = async (merchantId, sellerId) => {
    return await User.findOne({merchantId: merchantId, referenceId: sellerId});
}

module.exports = {
    createUser,
    getUser
}
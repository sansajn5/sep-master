const paymentService = require('../services/paymentService');

module.exports.handler = async (req, res) => {

    try {
        const body = req.body;
        const response = await paymentService.createAcquirerResponse(body);
        res.status(201).json(response);
    } catch(error) {
        res.status(500).json(error);
    }
}
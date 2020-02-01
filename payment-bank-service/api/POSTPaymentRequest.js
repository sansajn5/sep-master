const paymentService = require('../services/paymentService');

module.exports.handler = async (req, res) => {

    try {
        const body = req.body;
        const response = await paymentService.createPaymentRequest(body);
        if (response) {
            res.status(201).json(response);
        } else {
            res.status(404).json({message: "Invalid merchant data!"});
        }
        
    } catch(error) {
        res.status(500).json(error);
    }
    
}
const paymentService = require('../services/paymentService');

module.exports.handler = async (req, res) => {

    try {
        const body = req.body;
        const response = await paymentService.paymentExecute(body);
        if (response.error) {
            res.status(500).json({message: response.error});
        } else {
            res.status(201).json({message: "Executed succ!"});
        }
    } catch(error) {
        res.status(500).json(error);
    }
    
}
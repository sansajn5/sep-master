const bankService = require('../services/bankService');

module.exports.handler = async (req, res) => {

    try {
        const body = req.body;
        const response = await bankService.createCard(body);
        res.status(201).json(response);
    } catch(error) {
        res.status(500).json(error);
    }
    
}
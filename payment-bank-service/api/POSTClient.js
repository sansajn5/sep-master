const clientService = require('../services/clientService');

module.exports.handler = async (req, res) => {

    try {
        const body = req.body;
        const response = await clientService.createClient(body);
        res.status(201).json(response);
    } catch(error) {
        res.status(500).json(error);
    }
    
}
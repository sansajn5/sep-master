const accountService = require('../services/accountService');

module.exports.handler = async (req, res) => {

    try {
        const body = req.body;
        const response = await accountService.createAccount(body);
        res.status(201).json(response);
    } catch(error) {
        res.status(500).json(error);
    }
    
}
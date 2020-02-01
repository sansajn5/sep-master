const Client = require('../models/client');

const createClient = async (body) => {

    const client = new Client(body);
    const result = client.save();

    return result;
}

const getClient = async (body) => {
    return await Client.findOne(body);
}


module.exports = {
    createClient,
    getClient
}

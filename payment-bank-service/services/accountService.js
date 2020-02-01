const Account = require('../models/account');

const createAccount = async (body) => {

    const account = new Account(body);
    const result = account.save();

    return result;
}

const getAccountByPan = async (pan) => {
    return await Account.findOne({pan: pan});
}

const getAccountByClientId = async (clientId) => {
    return await Account.findOne({clientId: clientId});
}

module.exports = {
    createAccount,
    getAccountByPan,
    getAccountByClientId
}
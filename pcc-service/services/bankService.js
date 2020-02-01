const Bank = require('../models/bank');
const Card = require('../models/card');
const axios = require('axios');

const createBank = async (body) => {

    const bank = new Bank(body);
    const result = bank.save();

    return result;
}

const createCard = async (body) => {

    const card = new Card(body);
    const result = card.save();

    return result;
}

const getBankByCode = async (code) => {
    return await Bank.findOne({code: code});
}

const getCardByPan = async (pan) => {
    return await Card.findOne({pan: pan});
}

const paymentTransfer = async (body) => {

    const result = {};

    const card = await getCardByPan(body.pan);
    if (card) {
        const bank = await getBankByCode(card.bankCode);
        const acquirerBank = await getBankByCode(body.acquirerBank);

        if (bank) {
            
            const data = {
                ...body
            };
            axios.post(bank.serviceUrl + 'api/acquirer-request', data,
                { headers: {}, params: {} })
                .then(function (response) {
                    console.log('ACQUIRER RESPONSE - SUCC');
                    console.log(response);
                    const resp = response.data;
                    
                    // return to acquirer bank
                    axios.post(acquirerBank.serviceUrl + 'api/issuer-response', resp,
                        { headers: {}, params: {} })
                        .then(function (responsee) {
                            console.log('POST2 - succ');
                            console.log(responsee);
                        })
                        .catch(function (errorr) {
                            console.log('POST2 - err');
                            console.log(errorr);
                    });

                })
                .catch(function (error) {
                    console.log('ACQUIRER RESPONSE - ERROR');
                    console.log(error);
            });
        }
    }

    return result;
}

module.exports = {
    createBank,
    createCard,
    getBankByCode,
    paymentTransfer
}
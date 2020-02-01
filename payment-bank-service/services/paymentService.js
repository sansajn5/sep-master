const transactionService = require('../services/transactionService');
const clientService = require('../services/clientService');
const config = require('../config/config.json');
const Transaction = require('../models/transactions');
const Account = require('../models/account');
const accountService = require('../services/accountService');
const axios = require('axios');

const createPaymentRequest = async (body) => {

    let result = null;

    const query = {
        clientId: body.merchantId,
        clientPassword: body.merchantPassword,
        merchantId: body.organizationId,
    };
    const merchant = await clientService.getClient(query);

    if (merchant) {

        const transaction = new Transaction({
            createdAt: (new Date()).toISOString(),
            status: 'created',
            clientId: body.merchantId,
            merchantId: body.organizationId,
            amount: body.amount,
            merchantOrderId: body.merchantOrderId,
            merchantOrderTimeStamp: body.merchantOrderTimeStamp,
            successUrl: body.successUrl,
            failedUrl: body.failedUrl,
            errorUrl: body.errorUrl
        });

        try {
            const savedTransaction = await transaction.save();
            result = {
                redirectUrl: config['clientAppUrl'] + 'payment?'
                                     + `transactionId=${savedTransaction.id}&amount=${savedTransaction.amount}`,
                paymentId: savedTransaction.id
            }  
        } catch(error) {
            result = error;
        }
        
    }
    return result;
}


const paymentExecute = async (body) => {

    let result = {};

    const transaction = await transactionService.getTransactionByid(body.transactionId);

     // merchant account
    const merchantAccount = await accountService.getAccountByClientId(transaction.clientId);

    const account = await accountService.getAccountByPan(body.pan); // buyer account

    if (account) {
        expiryReq = body.expiry.replace(/^0+/, '');
        const expiryAcc = new Date(Number(account.expiry.split('/')[1]), Number(account.expiry.split('/')[0]) ,1 , 0, 0 ,0);
        if (new Date() > expiryAcc) {
            result.error = 'Expired card!';
            return result;
        }
        if (body.cardHolderName !== account.cardHolderName ||
            body.securityCode !== account.securityCode ||
            expiryReq !== account.expiry) {
                result.error = 'Invalid card data!';
                return result;
        }

        if (account.balance >= transaction.amount) {

            merchantAccount.balance += transaction.amount;
            merchantAccount.save((error, res) => {
                if (error) {
                    result.error = error;
                    return result;
                }
            });

            account.balance -= transaction.amount;
            account.save((error, res) => {
                if (error) {
                    result.error = error;
                    return result;
                }
            });

            transaction.status = 'success';
            transaction.save((error, res) => {
                if (error) {
                    result.error = error;
                    return result;
                }
            });
   
        } else {
            transaction.status = 'failed';
            transaction.save((error, res) => {
                if (error) {
                    result.error = error;
                    return result;
                }
            });
        }

        console.log('ENDE')
        console.log(transaction);

        let messageUrl = '';

        switch (transaction.status) {
            case 'success':
                messageUrl = transaction.successUrl;
            break;
            case 'failed':
                messageUrl = transaction.failedUrl;
            break;
            default:
                messageUrl = transaction.errorUrl;
            break;

        }

    /* axios.post(messageUrl, data,
        { headers: {}, params: {} })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        }); */

        result = transaction;

    } else {
        const pccBody = {...body};
        pccBody.acquirerBank = merchantAccount.accountNumber.split('-')[0],
        pccBody.acquirerOrderId = transaction.id;
        pccBody.acquirerOrderTimestamp = transaction.createdAt;
        pccBody.amount = transaction.amount;

        const ress = await redirectToPcc(pccBody);
    }

    return result;
}


const redirectToPcc = async (data) => {

    axios.post('http://localhost:8020/api/payment-transfer', data,
       { headers: {}, params: {} })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
}


const createAcquirerRequest = async (body) => {

    let result = {};

    const transaction = new Transaction({
        createdAt: (new Date()).toISOString(),
        status: 'created',
        amount: body.amount
    });

    let savedTransaction;

    try {
        savedTransaction = await transaction.save(); // creating issuer transaction
    } catch(error) {
        result = error;
    }

    const account = await accountService.getAccountByPan(body.pan); // issuer account

    if (account) {
        expiryReq = body.expiry.replace(/^0+/, '');
        const expiryAcc = new Date(Number(account.expiry.split('/')[1]), Number(account.expiry.split('/')[0]) ,1 , 0, 0 ,0);
        if (new Date() > expiryAcc) {
            result.error = 'Expired card!';
            return result;
        }
        if (body.cardHolderName !== account.cardHolderName ||
            body.securityCode !== account.securityCode ||
            expiryReq !== account.expiry) {
                result.error = 'Invalid card data!';
                return result;
        }

        if (account.balance >= transaction.amount) {

            account.balance -= transaction.amount;
            account.save((error, res) => {
                if (error) {
                    result.error = error;
                    return result;
                }
            });

            savedTransaction.status = 'success';
            savedTransaction.save((error, res) => {
                if (error) {
                    result.error = error;
                    return result;
                }
            });
   
        } else {
            savedTransaction.status = 'success';
            savedTransaction.save((error, res) => {
                if (error) {
                    result.error = error;
                    return result;
                }
            }); 

        }

        result = {
            issuerOrderId: savedTransaction.id,            // issuer part
            issuerOrderTimeStamp: savedTransaction.createdAt,
            status: savedTransaction.status,
            merchantOrderId: body.acquirerOrderId,      // acquirer part 
            acquirerBank: body.acquirerBank
        }

    } else {
        result = {
            message: "Error! Not founded account"
        }
    }

    return result;

}

const createAcquirerResponse = async (body) => {

    let result = {};

    const transaction = await transactionService.getTransactionByid(body.merchantOrderId);
    transaction.status = body.status;
    transaction.save((error, res) => {
        if (error) {
            result.error = error;
            return result;
        }
    });
    
    const account = await accountService.getAccountByClientId(transaction.clientId);
    account.balance += transaction.amount;
    account.save((error, res) => {
        if (error) {
            result.error = error;
            return result;
        }
    });
    
    const returnData = {
        merchantOrderId: transaction.merchantOrderId,
        merchantOrderTimeStamp: transaction.merchantOrderTimeStamp,
        acquirerId: transaction.id,
        status: transaction.status
    }

    let messageUrl = '';

    switch (returnData.status) {
        case 'success':
            messageUrl = transaction.successUrl;
        break;
        case 'failed':
            messageUrl = transaction.failedUrl;
        break;
        default:
            messageUrl = transaction.errorUrl;
        break;

    }

    console.log('ENDE')
    console.log(returnData);

    /*
    axios.post(messageUrl, data,
       { headers: {}, params: {} })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      }); */

      result = returnData;

    return result;
}

module.exports = {
    createPaymentRequest: createPaymentRequest,
    paymentExecute: paymentExecute,
    createAcquirerRequest: createAcquirerRequest,
    createAcquirerResponse: createAcquirerResponse
}

const config = require('../config.json');
const userService = require('./user.service');
const transactionService = require('./transaction.service');
const request = require('request');

const PAYPAL_API = config.paypalApi;
const REDIRECT_URL = config.paymentRedirect;
const FAILED_URL = config.paymentFailedRedirectionURL;

module.exports.createPayment = async (req, res) => {
    try {
        const body = req.body;
        console.log(body)
        const user = await userService.getUser(body.merchantId, body.userId);
        if (!user) {
            res.status(500).json({error: 'User not found!'})
        }
        console.log(user)
        const CLIENT = user.paypalClient;
        const SECRET = user.paypalSecret;
        
        const transaction = {
            date: new Date().toISOString(),
            sellerId: body.userId,
            merchantId: body.merchantId,
            productId: body.productId,
            price: body.price,
            currency: 'USD',
            referenceId: body.referenceId
        }
        const result = await new Promise((resolve, reject) => {
            request.post(PAYPAL_API + '/v1/payments/payment', {
                auth: {
                    user: CLIENT,
                    pass: SECRET
                },
                body: {
                    intent: 'sale',
                    payer: {
                        payment_method: 'paypal'
                    },
                    transactions: [{
                        amount: {
                            total: body.price,
                            currency: 'USD'
                        },
                    }],
                    redirect_urls: {
                        return_url: REDIRECT_URL,
                        cancel_url: FAILED_URL
                    }
                },
                json: true
            }, (err, response) => {
                if (err) {
                    reject(err);
                }
                transaction.paymentReference = response.body.id;
                transaction.status = response.body.state;
                resolve({id: response.body.id});
            });
        })

        await transactionService.createTransaction(transaction);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({error: err});
    }
}

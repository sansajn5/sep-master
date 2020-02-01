const transactionService = require('../sevices/transaction.service');
const userService = require('../sevices/user.service');
const request = require('request');
const config = require('../config.json');

const PAYPAL_API = config.paypalApi;

module.exports.executePayment = async (req,res) => {
    try {        
      let body = req.body;
      const paymentReference = body.paymentID;
      const payerID = body.payerID;
      const transaction = await transactionService.getTransactionByPaymentreference(paymentReference);
      
      console.log(transaction.merchantId, transaction.sellerId)
      const user = await userService.getUser(transaction.merchantId, transaction.sellerId);
     
      console.log('---CLIENT----');
      console.log(user);

      if (!user) {
          res.status(500).json({error: 'User not found!'})
      }

      const CLIENT = user.paypalClient;
      const SECRET = user.paypalSecret;

      const response = await new Promise((resolve, reject) => {
        request.post(PAYPAL_API + '/v1/payments/payment/' + paymentReference +
        '/execute',
        {
          auth:
          {
            user: CLIENT,
            pass: SECRET
          },
          body:
          {
            payer_id: payerID,
            transactions: [
            {
              amount:
              {
                total: transaction.price,
                currency: transaction.currency
              }
            }]
          },
          json: true
        },
        (err, response) => {
          if (err) {
            reject(err);
          }
          transactionService.updateTransaction(transaction._id, {status: response.body.state})
          resolve({status: 'success'});
        });
      })
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({error: err});
    }
}
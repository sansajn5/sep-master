const request = require('request');
const config = require('../config.json');
const userService = require('../sevices/user.service');

const PAYPAL_API = config.paypalApi;

module.exports.executeAgreement = async (req,res) => {
    try {         
        const token = req.params.token;
        const merchantId = req.params.merchantId;
        const userId = req.params.userId;

        const user = await userService.getUser(merchantId, userId);
        console.log(user)

        if (!user) {
            res.status(500).json({error: 'User not found!'})
        }

        const CLIENT = user.paypalClient;
        const SECRET =  user.paypalSecret;

        const accessToken = await new Promise((resolve, reject) => {
            request.post({
                uri: "https://api.sandbox.paypal.com/v1/oauth2/token",
                headers: {
                    "Accept": "application/json",
                    "Accept-Language": "en_US",
                    "content-type": "application/x-www-form-urlencoded"
                },
                auth: {
                'user': CLIENT,
                'pass': SECRET,
            },
            form: {
                "grant_type": "client_credentials"
            }
            }, function(error, response, body) {
                console.log('-------TOKEN-------')
                console.log(JSON.parse(body).access_token)
                resolve(JSON.parse(body).access_token);
            });
        })

        const agreementOptions = {
            method: 'POST',
            json: true,
            url: PAYPAL_API + '/v1/payments/billing-agreements/' + token + '/agreement-execute',
            headers: {
                'Authorization':'Bearer ' + accessToken,
            },
            body: {}
        }

        
        agreementResult = await new Promise((resolve, reject) => {
            request.post(agreementOptions, (err, response) => {
                if (err) {
                    console.log('-----Failed for execute agreement----------')
                    reject(err);
                } else {
                    if (response.body.error) {
                        reject();
                    }
                    console.log('-------SUCCESSFULY EXECUTE AGREEMENT---------')
                    console.log(response)
                    console.log(response.statusCode)
                    resolve(response.statusCode);
                }
            });

            
        })

        res.status(200).json({
            url: 'http://localhost:4201/payment/success'
        });
    } catch (err) {
        console.log('-----CATCH----')
        console.log(err)
        res.status(500).json({
                url: 'http://localhost:4201/payment/canceled'
        });
    }
}
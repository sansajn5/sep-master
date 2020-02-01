const request = require('request');
const userService = require('../sevices/user.service');
const config = require('../config.json');

const PAYPAL_API = config.paypalApi;

module.exports.subscribe = async (req,res) => {
    try {        
        const body = req.body;
        let token;
        console.log(body);

        const user = await userService.getUser(body.merchantId, body.userId);
        console.log(user)
        if (!user) {
            res.status(500).json({error: 'User not found!'})
        }
  
        const CLIENT = user.paypalClient;
        const SECRET = user.paypalSecret;

        console.log(CLIENT)
        console.log(SECRET)

        // get token
        console.log('get token')
        await new Promise((resolve, reject) => {
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
                // 'sendImmediately': false
            },
            form: {
                "grant_type": "client_credentials"
            }
            }, function(error, response, body) {
                token = JSON.parse(body).access_token;
                console.log('-------TOKEN-------')
                console.log(token)
                resolve();
            });
        })

        // create plan
        console.log('create plan')

        console.log(body.amount)
        console.log(typeof body.amount)
        const options = { 
            method: 'POST',
            json: true,
            url: PAYPAL_API + '/v1/payments/billing-plans',
            headers: {
                'Authorization':'Bearer '+token,
            },
            body:  {
                "name": "Magazine subscription plan",
                "description": "Plan for accessing magazine.",
                "payment_definitions": [
                    {
                        "amount": {
                            "currency": "USD",
                            "value": body.amount
                        },
                        "cycles": body.period,
                        "frequency": body.frequency,
                        "frequency_interval": "1",
                        "name": "Regular 1",
                        "type": "REGULAR"
                    }
                ],
                "type": "fixed",
                "merchant_preferences": {
                    "return_url": "http://localhost:4201/subscription/success/merchantId/" + body.merchantId + "/userId/" + body.userId,
                    "cancel_url": 'http://localhost:4201/subscription/failed',
                    "auto_bill_amount": "YES",
                    "initial_fail_amount_action": "CONTINUE",
                    "max_fail_attempts": "0",
                    "setup_fee": {
                        "currency": "USD",
                        "value": "0"
                    }
                }
            }
        }
        const planResult = await new Promise((resolve, reject) => {
            request.post(options, (err, response) => {
                if (err) {
                    console.log('-----Failed----------')
                    reject(err);
                } else {
                    console.log('-------SUCCESSFULY CREATED PLAN---------')
                    console.log(response.body.id);
                    resolve(response.body.id);
                }
            });
        })

        console.log('activate plan')

        const activePlanOptions = {
            method: 'PATCH',
            json: true,
            url: PAYPAL_API + '/v1/payments/billing-plans/' + planResult,
            headers: {
                'Authorization':'Bearer ' + token,
            },
            body: [
                {
                    "op": "replace",
                    "path": "/",
                    "value": {
                        "state": "ACTIVE"
                    }
                }
            ]
        } 
        console.log(activePlanOptions)

        const activePlanResult = await new Promise((resolve, reject) => {
            request.patch(activePlanOptions, (err, response) => {
                console.log('err')

                console.log(err)
                if (err) {
                    console.log('-----Failed plan activation----------')
                    reject(err);
                } else {
                    console.log('-------SUCCESSFULY ACTIVATED PLAN---------')
                    console.log(response.statusCode)
                    resolve(response.statusCode);
                }
            });
        })
        let agreementResult;
        if (activePlanResult === 200) {
            console.log('create agreement')
            console.log( new Date().toISOString())
            const agreementOptions = {
                method: 'POST',
                json: true,
                url: PAYPAL_API + '/v1/payments/billing-agreements',
                headers: {
                    'Authorization':'Bearer ' + token,
                },
                body: {
                    "name": "Pretplata na casopis na mesecnom nivou.",
                    "description": "Pretplata na casopis na mesecnom za korisnika.",
                    "start_date": new Date().toISOString(),
                    "plan": {
                        "id": "P-0NJ10521L3680291SOAQIVTQ"
                    },
                    "payer": {
                        "payment_method": "paypal",
                        "payer_info": {
                            "email": "kovacevicmilica@gmail.com"
                        }
                    },
                    "plan": {
                        "id": planResult
                    }
                }
            }

            agreementResult = await new Promise((resolve, reject) => {
                request.post(agreementOptions, (err, response) => {
                    console.log('err')
    
                    console.log(err)
                    if (err) {
                        console.log('-----Failed for create agreement----------')
                        reject(err);
                    } else {
                        console.log('-------SUCCESSFULY CREATED AGREEMENT---------')
                        console.log(response)
                        console.log(response.statusCode)
                        resolve(response.body);
                    }
                });
            })

        }

        console.log(agreementResult.links)

        res.status(200).json({"approval_url": agreementResult.links[0].href});
    } catch (err) {
        console.log('-----CATCH----')
        console.log(err)
        res.status(500).json({error: err});
    }
}
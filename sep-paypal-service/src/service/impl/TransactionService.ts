import { injectable, inject } from "inversify";
import Axios from 'axios';
const request = require('request');

import { ITransactionService, IWebhookNotifier } from "..";
import { IClientRepository, ITransactionRepository, ISubscriptionRepository } from "../../database";
import { Constants } from "../../util";
import { Client, Transaction } from "../../entities";

@injectable()
class TransactionService implements ITransactionService {
   
    _clientRepository: IClientRepository;

    _transactionRepository: ITransactionRepository;

    _webhookNotifier: IWebhookNotifier;

    _subscriptionRepository: ISubscriptionRepository;

    private readonly _tokenServiceUrl: string = process.env.TOKEN_SERVICE;

    private readonly _paypalApiUrl: string = process.env.PAYPAL_API;

    private readonly _redirectApiUrl: string = process.env.REDIRECT_API;

    private readonly _failedApiUrl: string = process.env.FAILED_URL;

    constructor(@inject(Constants.IClientRepository) clientRepository: IClientRepository, @inject(Constants.ITransactionRepository) transactionRepository: ITransactionRepository,
    @inject(Constants.IWebhookNotifier) webhookNotifier: IWebhookNotifier, @inject(Constants.ISubscriptionRepository) subscriptionRepository: ISubscriptionRepository) {
        this._clientRepository = clientRepository;
        this._transactionRepository = transactionRepository;
        this._webhookNotifier = webhookNotifier;
        this._subscriptionRepository = subscriptionRepository;
    }

    public async createPayment(createPayment: any): Promise<any> {
        const client = await this._clientRepository.getRepo().findOne({where: {id: createPayment.sellerId}});
        console.log(client)
        if (!client) {
            Promise.reject('User not found')
        }

        const {data: { value } } = await Axios.get(`${this._tokenServiceUrl}/${client.secret}`);
        console.log(value);
        
        const transaction = new Transaction();
        Object.assign(transaction, {
            status: 'STARTED',
            timestamp: new Date(),
            currency: createPayment.currency,
            amount: createPayment.amount,
            sellerId: client.id,
            vendorId: client.vendorId,
            referenceBuyerId: createPayment.referenceBuyerId,
            referenceSellerId: client.referenceId,
            referenceTransactionId: createPayment.referenceTransactionId
        });
        console.log(transaction);

        await this._transactionRepository.getRepo().save(transaction);

        console.log(transaction);

        try {
            const result = await new Promise((resolve, reject) => {
                request.post(this._paypalApiUrl + '/v1/payments/payment', {
                    auth: {
                        user: client.client,
                        pass: value
                    },
                    body: {
                        intent: 'sale',
                        payer: {
                            payment_method: 'paypal'
                        },
                        transactions: [{
                            amount: {
                                total: transaction.amount,
                                currency: transaction.currency
                            },
                        }],
                        redirect_urls: {
                            return_url: this._redirectApiUrl,
                        cancel_url: this._failedApiUrl
                        }
                    },
                    json: true
                }, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve({id: response.body.id, status: response.body.state});
                });
            })
            console.log(result);
            transaction.paypalStatusReference = result['status'];
            transaction.paypalTransactionReference = result['id']
            await this._transactionRepository.getRepo().save(transaction);
        } catch (err) {
            transaction.status = 'FAILED';
            await this._transactionRepository.getRepo().save(transaction);
            // add webhook
            this._webhookNotifier.notifyMerchant(client.vendorId, 'failed', transaction.referenceTransactionId);
            Promise.reject(err);
        }
    }
    
    
    public async executePayment(executePayment: any): Promise<any> {
        const transaction = await this._transactionRepository.getRepo().findOne({where: {paypalTransactionReference: executePayment.paymentID}});
        console.log(transaction)
        const client = await this._clientRepository.getRepo().findOne({where: {id: transaction.sellerId}});
        console.log(client)
        if (!client) {
            Promise.reject('User not found')
        }

        const {data: { value } } = await Axios.get(`${this._tokenServiceUrl}/${client.secret}`);
        console.log(value);

        try {
            const response = await new Promise((resolve, reject) => {
                request.post(this._paypalApiUrl + '/v1/payments/payment/' + executePayment.paymentID +
                '/execute',
                {
                  auth:
                  {
                    user: client.client,
                    pass: value
                  },
                  body:
                  {
                    payer_id: executePayment.payerID,
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
                  resolve(response.body.state);
                });
              })
            transaction.status = response;
            await this._transactionRepository.getRepo().save(transaction);
            this._webhookNotifier.notifyMerchant(client.vendorId, 'success', transaction.referenceTransactionId);
            Promise.resolve();
        } catch (err) {
            transaction.status = 'FAILED';
            await this._transactionRepository.getRepo().save(transaction);
            // add webhook
            this._webhookNotifier.notifyMerchant(client.vendorId, 'failed', transaction.referenceTransactionId);
            Promise.reject(err);
        }

    }
    public async cancelPayment(cancelPayment: any): Promise<any> {
        const transaction = await this._transactionRepository.getRepo().findOne({where: {paypalTransactionReference: cancelPayment.paymentID}});
        console.log(transaction)
        const client = await this._clientRepository.getRepo().findOne({where: {id: transaction.sellerId}});
        console.log(client)
        if (!client) {
            Promise.reject('User not found')
        }

        transaction.status = 'CANCEL';

        this._webhookNotifier.notifyMerchant(client.vendorId, 'cancel', transaction.referenceTransactionId);
    }

    public async subscribe(subscribe: any): Promise<any> {
        const client = await this._clientRepository.getRepo().findOne({where: {id: subscribe.sellerId}});
        console.log(client)
        if (!client) {
            Promise.reject('User not found')
        }

        const {data: { value } } = await Axios.get(`${this._tokenServiceUrl}/${client.secret}`);
        console.log(value);

        try {
            let token;
            await new Promise((resolve, reject) => {
                request.post({
                    uri: "https://api.sandbox.paypal.com/v1/oauth2/token",
                    headers: {
                        "Accept": "application/json",
                        "Accept-Language": "en_US",
                        "content-type": "application/x-www-form-urlencoded"
                    },
                    auth: {
                        user: client.client,
                        pass: value,
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
            });
            const options = { 
                method: 'POST',
                json: true,
                url: this._paypalApiUrl + '/v1/payments/billing-plans',
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
                                "value": subscribe.amount
                            },
                            "cycles": subscribe.period,
                            "frequency": subscribe.frequency,
                            "frequency_interval": "1",
                            "name": "Regular 1",
                            "type": "REGULAR"
                        }
                    ],
                    "type": "fixed",
                    "merchant_preferences": {
                        "return_url": "http://localhost:4201/subscription/success/merchantId/" + subscribe.merchantId + "/sellerId/" + subscribe.sellerId + '/referenceBuyerId/' + subscribe.referenceBuyerId,
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
                url: this._paypalApiUrl + '/v1/payments/billing-plans/' + planResult,
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
                const today = new Date();
                const date = new Date(today);
                date.setMinutes(date.getMinutes() + 3);
                const agreementOptions = {
                    method: 'POST',
                    json: true,
                    url: this._paypalApiUrl + '/v1/payments/billing-agreements',
                    headers: {
                        'Authorization':'Bearer ' + token,
                    },
                    body: {
                        "name": "Pretplata na casopis na mesecnom nivou.",
                        "description": "Pretplata na casopis na mesecnom za korisnika.",
                        "start_date": date.toISOString(),
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
                            console.log(response.statusCode)
                            console.log(JSON.stringify(response.body))
                            resolve(response.body);
                        }
                    });
                })
                const subscription = {
                    referenceBuyerId: subscribe.userId,
                    vendorId: subscribe.merchantId,
                    period: subscribe.period,
                    frequency: subscribe.frequency,
                    amount: subscribe.amount,
                    timestamp: new Date(),
                    status: 'created',
                    currency: 'USD',
                    agreementId: null,
                    sellerId: subscribe.sellerId,
                    referenceSellerId: client.referenceId,
                }
                await this._subscriptionRepository.getRepo().save(subscription);
                Promise.resolve({"approval_url": agreementResult.links[0].href})
            }
        } catch (err) {
            Promise.reject(err);
        }
    }
    public async executeAgreement(executeAgreement: any): Promise<any> {
        const token = executeAgreement.token;
        const merchantId = executeAgreement.merchantId;
        const referenceBuyerId = executeAgreement.referenceBuyerId;
        const sellerId = executeAgreement.sellerId;

        const subscription = await this._subscriptionRepository.getRepo().findOne({where: {referenceBuyerId: referenceBuyerId, sellerId: sellerId, vendorId: merchantId}});

        const client = await this._clientRepository.getRepo().findOne({where: {id: sellerId}});
        console.log(client)
        if (!client) {
            Promise.reject('User not found')
        }

        try {
            const {data: { value } } = await Axios.get(`${this._tokenServiceUrl}/${client.secret}`);
        console.log(value);

        const accessToken = await new Promise((resolve, reject) => {
            request.post({
                uri: "https://api.sandbox.paypal.com/v1/oauth2/token",
                headers: {
                    "Accept": "application/json",
                    "Accept-Language": "en_US",
                    "content-type": "application/x-www-form-urlencoded"
                },
                auth: {
                    user: client.client,
                    pass: value,
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
            url: this._paypalApiUrl + '/v1/payments/billing-agreements/' + token + '/agreement-execute',
            headers: {
                'Authorization':'Bearer ' + accessToken,
            },
            body: {}
        }

        await new Promise((resolve, reject) => {
            request.post(agreementOptions, (err, response) => {
                if (err) {
                    console.log('-----Failed for execute agreement----------')
                    reject(err);
                } else {
                    if (response.body.error) {
                        reject();
                    }
                    console.log('-------SUCCESSFULY EXECUTE AGREEMENT---------')
                    console.log(response.statusCode)
                    console.log(response.body.id)

                    console.log('-----subscription -----')
                    console.log(subscription)

                    subscription.paypalAgreementId = response.body.id;
                    subscription.status = 'active';
                    resolve(response.statusCode);
                }
            });
        })
        await this._subscriptionRepository.getRepo().save(subscription);
        Promise.resolve({
            url: 'http://localhost:4201/payment/success'
        })
        this._webhookNotifier.notifyMerchantSub(client.vendorId, 'success', referenceBuyerId, true)
        }catch (err) {
            console.log(err);
            Promise.reject({
                url: 'http://localhost:4201/payment/canceled'
            })
        }
    }
    
    public async cancelWebhook(cancelWebhook: any): Promise<any> {
        const subscription = await this._subscriptionRepository.getRepo().findOne({where: {paypalAgreementId: referenceBuyerId, sellerId: sellerId, vendorId: merchantId}});

        const client = await this._clientRepository.getRepo().findOne({where: {id: sellerId}});
        console.log(client)
        if (!client) {
            Promise.reject('User not found')
        }
    }

}

export default TransactionService;
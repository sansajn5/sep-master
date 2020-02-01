import { injectable, inject } from "inversify";
import Axios from 'axios';

import { IClientService, IWebhookNotifier } from "..";
import { IClientRepository, ITransactionRepository } from "../../database";
import { Constants } from "../../util";
import { Client, Transaction } from "../../entities";

@injectable()
class ClientService implements IClientService {

    _clientRepository: IClientRepository;

    _transactionRepository: ITransactionRepository;

    _webhookNotifier: IWebhookNotifier;

    constructor(@inject(Constants.IClientRepository) clientRepository: IClientRepository, @inject(Constants.IWebhookNotifier) webhookNotifier: IWebhookNotifier, @inject(Constants.ITransactionRepository) transactionRepository: ITransactionRepository) {
        this._clientRepository = clientRepository;
        this._webhookNotifier = webhookNotifier;
        this._transactionRepository = transactionRepository;
    }

    public async create(createClientRequest: import("../../App").CreateClientRequest): Promise<any> {
        const client = new Client();
        client.userId = createClientRequest.userId;
        client.vendorId = createClientRequest.vendorId;
        client.merchantId = createClientRequest.merchantId;
        client.organizationId = createClientRequest.organizationId;
        client.password = createClientRequest.password;

        await this._clientRepository.getRepo().save(client);
    }
    public async createTransaction(merchantId: string, userId: string, referenceId: string, merchantIdOrderId: string, amount: string): Promise<any> {
        const client = await this._clientRepository.getRepo().findOne({where: {vendorId: merchantId, userId: userId}});

        try {
            const { data } = await Axios.post('http://localhost:8010', {
                merchantId: userId,
                merchantPassword: '123',
                organizationId: '11',
                amount: amount,
                merchantIdOrderId: merchantIdOrderId,
                successUrl: 'http://localhost:8003/api/payments/success',
                failedUrl: 'http://localhost:8003/api/payments/failed',
                errorUrl: 'http://localhost:8003/api/payments/failed'
            });
            const { redirectUrl, paymentId} = data;

            const transaction = new Transaction();
            transaction.clientId = client.id;
            transaction.merchantIdOrderId = merchantIdOrderId;
            transaction.referenceId = paymentId;
            transaction.status = 'PROCESSING';

            this._transactionRepository.getRepo().save(transaction);
        } catch (err) {
            console.log(err);
            throw err;
        }
        
    }
    public async updateTransaction(referenceId: string, status: 'success' | 'failed') {
        const transaction = await this._transactionRepository.getRepo().findOne({where: {referenceId: referenceId}});
        transaction.status = status;
        await this._transactionRepository.getRepo().save(transaction);

        const client = await this._clientRepository.getRepo().findOne({where: {id: transaction.clientId}});

        this._webhookNotifier.notifyMerchant(client.merchantId, status, transaction.merchantIdOrderId);
    }
    
}

export default ClientService;
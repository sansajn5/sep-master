import { injectable, inject } from "inversify";
import { hashSync } from 'bcrypt';
import { uuid } from 'uuidv4';

import { IClientService, IClientNotifier } from "..";
import { IClientRepository, IPaymentMethodRepository } from "../../database";
import { Constants } from "../../util";
import { Client } from "../../entities";

@injectable()
class ClientService implements IClientService {

    _clientRepository: IClientRepository;

    _paymentMethodRepository: IPaymentMethodRepository;

    _clientNotifier: IClientNotifier;

    constructor(@inject(Constants.IClientRepository) clientRepository: IClientRepository, @inject(Constants.IPaymentMethodRepository) paymentMethodRepository: IPaymentMethodRepository
    , @inject(Constants.IClientNotifier) clientNotifier: IClientNotifier) {
        this._clientRepository = clientRepository;
        this._paymentMethodRepository = paymentMethodRepository
        this._clientNotifier = clientNotifier;
    }
    
    // TODO Method need refactor and move from hardcore should enable easier creating and matching
    public async create(username: string, paymentMethods: string[], successUrl: string, failedUrl: string): Promise<any> {
        // TODO Change this THIS NEED REFACTOR NO NEEDED FOR THIS ITERATION
        const allPaymentMethods = await this._paymentMethodRepository.getAll();
        const client = new Client();
        client.username = username;
        client.successUrl = successUrl;
        client.failedUrl = failedUrl;
        const password = uuid();
        client.secret = hashSync(password, parseInt(process.env.SALT_LENGTH));
        const savedClient = await this._clientRepository.getRepo().save(client);

        this._clientNotifier.clientCreated(savedClient.id, savedClient.successUrl, savedClient.failedUrl);

        return Promise.resolve({...savedClient, password});
    }

    getClientPaymentMethods(merchantId: string): Promise<any> {
        // todo change this
        return this._paymentMethodRepository.getAll();
    }


}

export default ClientService;
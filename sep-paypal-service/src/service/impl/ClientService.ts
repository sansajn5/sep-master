import { injectable, inject } from "inversify";
import Axios from 'axios';

import { IClientService } from "..";
import { IClientRepository } from "../../database";
import { Constants } from "../../util";
import { Client } from "../../entities";

@injectable()
class ClientService implements IClientService {

    private readonly _tokenServiceUrl: string = process.env.TOKEN_SERVICE;

    _clientRepository: IClientRepository;

    constructor(@inject(Constants.IClientRepository) clientRepository: IClientRepository) {
        this._clientRepository = clientRepository;
    }

    public async create(createClientRequest: any): Promise<any> {
        const {
            vendorId,
            referenceId,
            client,
            secret
        } = createClientRequest;
        const newClient =  new Client();
        Object.assign(newClient, {
            vendorId,
            referenceId,
            client,
            secret
        });
        console.log(newClient);

        const { data: { token} } = await Axios.post(_tokenServiceUrl, {value: secret});
        console.log(token);
        client.secret = token;
        console.log(client)
        try {
            const savedClient = await this._clientRepository.getRepo().save(newClient);
            return Promise.resolve(savedClient);
        } catch (err) {
            console.log(err)
            Promise.reject(err);
        }
    }
}

export default ClientService;
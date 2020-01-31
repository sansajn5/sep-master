import { injectable, inject } from "inversify";

import { IClientService } from "..";
import { IClientRepository } from "../../database";
import { Constants } from "../../util";
import { Client } from "../../entities";

@injectable()
class ClientService implements IClientService {

    _clientRepository: IClientRepository;


    constructor(@inject(Constants.IClientRepository) clientRepository: IClientRepository) {
        this._clientRepository = clientRepository;
    }
    
    // TODO Method need refactor and move from hardcore should enable easier creating and matching
    public async create(id: string, successUrl: string, failedUrl: string): Promise<void> {
        const client = new Client();
        client.id = id;
        client.successUrl = successUrl;
        client.failedUrl = failedUrl;
        await this._clientRepository.getRepo().save(client);
    }

}

export default ClientService;
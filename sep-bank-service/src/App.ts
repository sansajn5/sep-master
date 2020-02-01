import { injectable, inject } from "inversify";
import { IClientService } from "./service";
import { Constants } from "./util";

export interface CreateClientRequest {
    userId: string,
    vendorId: string,
    organizationId: string,
    merchantId: string,
    password: string
}

export interface IApp {

    createClient(createClientRequest: CreateClientRequest): Promise<any>;

    prepareTransaction(merchantId: string, userId: string, referenceId: string, merchantIdOrderId: string, amount: string): Promise<any>;

    updateTransaction(merchantIdOrderId: string, status: string): Promise<any>;
}

@injectable()
export class App implements IApp {

    _clientService: IClientService;

    constructor(@inject(Constants.IClientService) clientService) {
        this._clientService = clientService;
    }

    public createClient(createClientRequest: CreateClientRequest): Promise<any> {
         return this._clientService.create(createClientRequest);
    }    

    public prepareTransaction(merchantId: string, userId: string, referenceId: string, merchantIdOrderId: string, amount: string): Promise<any> {
        return this._clientService.createTransaction(merchantId, userId, referenceId, merchantIdOrderId, amount);
    }

    public updateTransaction(merchantIdOrderId: string, status: string): Promise<any> {
        return this.updateTransaction(merchantIdOrderId, status);
    }
    

}
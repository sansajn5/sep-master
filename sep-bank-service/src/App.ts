import { injectable, inject } from "inversify";
import { IClientService, ICleanupListener } from "./service";
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

    listenCleanup(): Promise<void>;
}

@injectable()
export class App implements IApp {

    _clientService: IClientService;

    _cleanupListener: ICleanupListener;

    constructor(@inject(Constants.IClientService) clientService, @inject(Constants.ICleanupListener) cleanupListener: ICleanupListener) {
        this._clientService = clientService;
        this._cleanupListener = cleanupListener;
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

    public listenCleanup(): Promise<void> {
        return this._cleanupListener.listenCleanup();
    }
    

}
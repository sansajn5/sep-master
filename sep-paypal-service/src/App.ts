import { injectable, inject } from "inversify";
import { IClientService, ICleanupListener } from "./service";
import { Constants } from "./util";

export interface IApp {

    createPayment(createPaymentBody: any): Promise<any>;

    executePayment(executePaymentBody: any): Promise<any>;

    cancelPayment(cancelPaymentBody: any): Promise<any>;

    createClient(createClientRequest: any): Promise<any>;

    createSubscribe(createSubscrptionBody: any): Promise<any>;

    cancelSubscription(cancelSubscriptionBody: any): Promise<any>;

    executeAgreement(executeAgreementBody: any): Promise<any>;

    listenCancelWebhook(cancelWebhookBody: any): Promise<any>;

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
    
    public createPayment(createPaymentBody: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
    public executePayment(executePaymentBody: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
    public cancelPayment(cancelPaymentBody: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
    public createClient(createClientRequest: any): Promise<any> {
        return this._clientService.
    }
    
    public createSubscribe(createSubscrptionBody: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
    public cancelSubscription(cancelSubscriptionBody: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
    public executeAgreement(executeAgreementBody: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
    public listenCancelWebhook(cancelWebhookBody: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public listenCleanup(): Promise<void> {
        return this._cleanupListener.listenCleanup();
    }

}
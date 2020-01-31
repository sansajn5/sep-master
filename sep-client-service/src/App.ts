import { injectable, inject } from "inversify";
import { IAuthService, IClientService } from "./service";
import { Constants } from "./util";

interface LoginRequest {
    merchantId: string,
    password: string,
}

interface CreateClientRequest {
    username: string,
    paymentMethods: string[],
    successUrl: string,
    failedUrl: string
}

export interface IApp {

    createClient(createClientRequest: CreateClientRequest): Promise<any>;

    getClientPaymentMethods(merchantId: string): Promise<any>;

    authorize(loginRequest: LoginRequest): Promise<any>;
}

@injectable()
export class App implements IApp {

    _authService: IAuthService;

    _clientService: IClientService;

    constructor(@inject(Constants.IAuthService) authService, @inject(Constants.IClientService) clientService) {
        this._authService = authService;
        this._clientService = clientService;
    }

    public createClient(createClientRequest: CreateClientRequest): Promise<any> {
         return this._clientService.create(createClientRequest.username, createClientRequest.paymentMethods, createClientRequest.successUrl, createClientRequest.failedUrl);
    }    
    
    public getClientPaymentMethods(merchantId: string): Promise<any> {
        return this._clientService.getClientPaymentMethods(merchantId);
    }

    public authorize(loginRequest: LoginRequest): Promise<any> {
        return this._authService.login(loginRequest.merchantId, loginRequest.password);
    }
}
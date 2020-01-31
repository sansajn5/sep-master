export default interface IClientService {

    create(username: string, paymentMethods: string[], successUrl: string, failedUrl: string): Promise<any>;

    getClientPaymentMethods(merchantId: string): Promise<any>;
}
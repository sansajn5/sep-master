export default interface ITransactionService {

    createPayment(createPayment): Promise<any>;

    executePayment(executePayment): Promise<any>;

    cancelPayment(cancelPayment): Promise<any>;

    subscribe(subscribe): Promise<any>;

    executeAgreement(executeAgreement): Promise<any>;

    cancelWebhook(cancelWebhook): Promise<any>;
}
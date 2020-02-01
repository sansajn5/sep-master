import { CreateClientRequest } from "../App";

export default interface IClientService {

    create(createClientRequest: CreateClientRequest): Promise<any>;

    createTransaction(merchantId: string, userId: string, referenceId: string, merchantIdOrderId: string, amount: string): Promise<any>;

    updateTransaction(referenceId: string, status: 'success' | 'failed');
}
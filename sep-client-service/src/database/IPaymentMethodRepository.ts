import { PaymentMethod } from '../entities';

export default interface IPaymentMethodRepository {

    getAll(): Promise<PaymentMethod[]>;
}
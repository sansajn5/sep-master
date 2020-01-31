import { injectable, inject } from "inversify";
import { Connection, Repository } from "typeorm";
import { Constants } from "../../util";
import { IDatabaseConnection, IPaymentMethodRepository } from "..";
import { PaymentMethod } from '../../entities';

@injectable()
class PaymentMethodRepository implements IPaymentMethodRepository {

    private _db: Connection;

    private _dbConn: IDatabaseConnection;

    constructor(@inject(Constants.IDatabaseConnection) dbConn: IDatabaseConnection) {
        this._db = dbConn.get();
        this._dbConn = dbConn;
    }

    getAll(): Promise<PaymentMethod[]> {
        const repo = this._db.getRepository(PaymentMethod);
        return repo.find();
    }

}

export default PaymentMethodRepository;
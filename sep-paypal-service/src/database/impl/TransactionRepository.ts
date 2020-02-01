import { injectable, inject } from "inversify";
import { Connection, Repository } from "typeorm";
import { Constants } from "../../util";
import { IDatabaseConnection, ITransactionRepository } from "..";
import { Transaction } from '../../entities';

@injectable()
class TransactionRepository implements ITransactionRepository {

    private _db: Connection;

    private _dbConn: IDatabaseConnection;

    constructor(@inject(Constants.IDatabaseConnection) dbConn: IDatabaseConnection) {
        this._db = dbConn.get();
        this._dbConn = dbConn;
    }

    public getRepo(): Repository<Transaction> {
        return this._db.getRepository(Transaction);
    }

}

export default TransactionRepository;
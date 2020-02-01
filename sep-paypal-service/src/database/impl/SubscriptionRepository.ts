import { injectable, inject } from "inversify";
import { Connection, Repository } from "typeorm";
import { Constants } from "../../util";
import { IDatabaseConnection, ISubscriptionRepository } from "..";
import { Subscription } from '../../entities';

@injectable()
class SubscriptionRepository implements ISubscriptionRepository {

    private _db: Connection;

    private _dbConn: IDatabaseConnection;

    constructor(@inject(Constants.IDatabaseConnection) dbConn: IDatabaseConnection) {
        this._db = dbConn.get();
        this._dbConn = dbConn;
    }

    public getAll(): Promise<Subscription[]> {
        const repo = this._db.getRepository(Subscription);
        return repo.find();
    }

    public getRepo(): Repository<Subscription> {
        return this._db.getRepository(Subscription);
    }
}

export default SubscriptionRepository;
import { injectable, inject } from "inversify";
import { Connection, Repository } from "typeorm";
import { Constants } from "../../util";
import { IDatabaseConnection, IClientRepository } from "..";
import { Client } from '../../entities';

@injectable()
class ClientRepository implements IClientRepository {

    private _db: Connection;

    private _dbConn: IDatabaseConnection;

    constructor(@inject(Constants.IDatabaseConnection) dbConn: IDatabaseConnection) {
        this._db = dbConn.get();
        this._dbConn = dbConn;
    }

    public getAll(): Promise<Client[]> {
        // if (!this._db) {
        //     this._db = this._dbConn.get();
        // }
        const repo = this._db.getRepository(Client);
        return repo.find();
    }

    public getRepo(): Repository<Client> {
        return this._db.getRepository(Client);
    }
}

export default ClientRepository;
import { createConnection, Connection } from "typeorm";
import { injectable } from "inversify";

import { IDatabaseConnection } from "..";
import { Client, Transaction } from "../../entities";


const entities = [
    Client, Transaction,
];

@injectable()
class DatabaseConnection implements IDatabaseConnection {
  readonly _dbHost: string = process.env.DATABASE_HOST;
  readonly _dbPort: string = process.env.DATABASE_PORT;
  readonly _dbUsername: string = process.env.DATABASE_USER;
  readonly _dbPassword: string = process.env.DATABASE_PASSWORD;
  readonly _databaseName: string = process.env.DATABASE_DB;
  
  private _db: Connection;

  constructor() {}

  // TODO add migrations!!
  public async setup(): Promise<Connection> {
    this._db = await createConnection({
      type: "postgres",
      host: this._dbHost,
      port: parseInt(this._dbPort, 0),
      username: this._dbUsername,
      password: this._dbPassword,
      database: this._databaseName,
      entities: entities,
      synchronize: true
    });
    return this._db;
  }

  public get(): Connection {
    return this._db;
  }

}

export default DatabaseConnection;
import { Connection } from "typeorm";

export default interface IDatabaseConnection {

    get(): Connection;

    setup(): Promise<Connection>;

}

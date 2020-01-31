import { Client } from '../entities';
import { Repository } from 'typeorm';

export default interface IClientRepository {

    getRepo(): Repository<Client>;

    getAll(): Promise<Client[]>;
}
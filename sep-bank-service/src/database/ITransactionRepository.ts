import { Transaction } from '../entities';
import { Repository } from 'typeorm';

export default interface ITransactionRepository {

    getRepo(): Repository<Transaction>;
}
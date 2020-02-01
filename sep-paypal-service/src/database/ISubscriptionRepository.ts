import { Subscription } from '../entities';
import { Repository } from 'typeorm';

export default interface ISubscriptionRepository {

    getRepo(): Repository<Subscription>;

    getAll(): Promise<Subscription[]>;
}
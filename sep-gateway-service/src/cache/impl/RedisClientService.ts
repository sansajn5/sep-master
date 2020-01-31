import { injectable } from 'inversify';
import * as Redis from 'ioredis';

import { ICacheClientService } from '..';

@injectable()
class RedisClientService implements ICacheClientService {

  _client: Redis;

  _host: string = process.env.REDIS_HOST;
  _port: string = process.env.REDIS_PORT;

  constructor() {
    this._client = new Redis({
      host: this._host,
      port: parseInt(this._port, 0),
    });
  }

  public getValue(key: string): Promise<string> {
    return this._client.get(key);
  }

  public setValue(key: string, value: string, expiresIn: number): Promise<string> {
    return this._client.set(key, value, 'ex', expiresIn);
  }
}

export default RedisClientService;

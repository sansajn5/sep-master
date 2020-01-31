import { Channel, connect, Connection } from 'amqplib';
import { injectable } from 'inversify';

import { IAMQPMessagingConnection } from '..';
import { MessagingConstants } from '../../util';

@injectable()
class AMQPConnection implements IAMQPMessagingConnection {
  _conn: Connection = null;
  _channel: Channel = null;

  readonly _host: string = process.env.RABBITMQ_HOST;
  readonly _port: string = process.env.RABBITMQ_PORT;
  readonly _username: string = process.env.RABBITMQ_USERNAME;
  readonly _password: string = process.env.RABBITMQ_PASSWORD;

  // We fetch messages one-by-one across application.
  readonly PREFETCH_COUNT: number = 1;

  public async setup(): Promise<void> {
    this._conn = await connect(`amqp://${this._username}:${this._password}@${this._host}:${this._port}`);

    this._channel = await this._conn.createChannel();
    await this._channel.prefetch(this.PREFETCH_COUNT);

    await this._channel.assertExchange(MessagingConstants.LogExchangeName, 'topic', {
      durable: true,
    });

    await this._channel.assertExchange(MessagingConstants.ClientExchangeName, 'topic', {
      durable: true,
    });
  }

  public getChannel(): Channel {
    return this._channel;
  }
}

export default AMQPConnection;

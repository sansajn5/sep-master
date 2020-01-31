import { Channel } from 'amqplib';

export default interface IAMQPMessagingConnection {

  setup(): Promise<void>;

  getChannel(): Channel;
}

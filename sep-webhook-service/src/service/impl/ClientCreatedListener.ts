import { injectable, inject } from "inversify";
import { Message } from 'amqplib';

import { IClientCreatedListener } from "..";
import { ILogger } from "../../util/logging";
import { IAMQPMessagingConnection } from "../../messaging";
import { Constants, MessagingConstants } from "../../util";
import { ClientCreatedMessage } from "../../model";

@injectable()
class ClientCreatedListener implements IClientCreatedListener {
    
    _logger: ILogger;
    _amqpConnection: IAMQPMessagingConnection;

    constructor(@inject(Constants.ILogger) logger: ILogger,
                @inject(Constants.IAMQPMessagingConnection) amqpConnection: IAMQPMessagingConnection) {
                    this._logger = logger;
                    this._amqpConnection = amqpConnection;
                }
    
    public async listen(): Promise<void> {
        const channel = this._amqpConnection.getChannel();

        await channel.consume(MessagingConstants.ClientCreatedQueueName, this.processMessage.bind(this), {
            consumerTag: 'webhook',
            noAck: false
        })

        this._logger.info('Webhook Service is connected to rabbitmq!');
    }

    private async processMessage(msg: Message): Promise<any> {
            let message: ClientCreatedMessage = {
                id: '',
                successUrl: '',
                failedUrl: '',
            };
        try {
            message = JSON.parse(msg.content.toString('utf8'));
        } catch (err) {
            console.log(err);
            return null;
        }

        const channel = this._amqpConnection.getChannel();
        await channel.ack(msg);
    
    }
}

export default ClientCreatedListener;
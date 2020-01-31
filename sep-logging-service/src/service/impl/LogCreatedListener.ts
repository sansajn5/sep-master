import { injectable, inject } from "inversify";
import { Message } from 'amqplib';

import { ILogCreatedListener } from "..";
import { ILogger } from "../../util/logging";
import { IAMQPMessagingConnection } from "../../messaging";
import { Constants, MessagingConstants } from "../../util";
import { LogMessage } from "../../model";

@injectable()
class LogCreatedListner implements ILogCreatedListener {
    
    _logger: ILogger;
    _amqpConnection: IAMQPMessagingConnection;

    constructor(@inject(Constants.ILogger) logger: ILogger,
                @inject(Constants.IAMQPMessagingConnection) amqpConnection: IAMQPMessagingConnection) {
                    this._logger = logger;
                    this._amqpConnection = amqpConnection;
                }
    
    public async listen(): Promise<void> {
        const channel = this._amqpConnection.getChannel();

        await channel.consume(MessagingConstants.LogCreatedQueueName, this.processMessage.bind(this), {
            consumerTag: 'logger',
            noAck: false
        })

        this._logger.info('Logger Service is connected to rabbitmq!');
    }

    private async processMessage(msg: Message): Promise<any> {
            let message: LogMessage = {
                correlationId: '',
                logType: 'info',
                timestamp: '',
                serviceName: '',
                description: '',
            };
        try {
            message = JSON.parse(msg.content.toString('utf8'));
        } catch (err) {
            console.log(err);
            return null;
        }

        this._logger.info(`Service: [Service-${message.serviceName}] Request: [${message.correlationId}] Time: [${message.timestamp}] Type: [${message.logType.toUpperCase()}] descrption: [${message.description}]`);

        const channel = this._amqpConnection.getChannel();
        await channel.ack(msg);
    }
}

export default LogCreatedListner;
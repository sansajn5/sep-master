import { Message } from 'amqplib';
import { injectable, inject } from "inversify";
import Axios from 'axios';

import { IWebhookListener } from "..";
import { ILogger } from "../../util/logging";
import { IAMQPMessagingConnection } from "../../messaging";
import { Constants, MessagingConstants } from "../../util";
import { WebhookMessage } from '../../model';
import { IClientRepository } from '../../database';

@injectable()
class WebhookListener implements IWebhookListener {

    _logger: ILogger;
    _amqpConnection: IAMQPMessagingConnection;
    _clientRepository: IClientRepository;

    constructor(
        @inject(Constants.ILogger) logger: ILogger,
        @inject(Constants.IAMQPMessagingConnection) amqpConnection: IAMQPMessagingConnection,
        @inject(Constants.IClientRepository) clientRepository: IClientRepository
        ) {
            this._logger = logger;
            this._amqpConnection = amqpConnection;
            this._clientRepository = clientRepository;
    }

    public async listenWebhooks(): Promise<any> {
        const channel = this._amqpConnection.getChannel();

        await channel.consume(MessagingConstants.WebhookNotifyQueueName, this.processMessage.bind(this), {
            consumerTag: 'webhook',
            noAck: false
        })

        this._logger.info('Webhook Service is connected to rabbitmq for webhooks!');
    }

    private async processMessage(msg: Message): Promise<any> {
        let message: WebhookMessage = {
            referenceId: '',
            status: 'success',
            merchantId: ''
        };

        try {
            message = JSON.parse(msg.content.toString('utf8'));
        } catch (err) {
            console.log(err);
            return null;
        }

        const channel = this._amqpConnection.getChannel();
        await channel.ack(msg);
        
        const client = await this._clientRepository.getRepo().findOne({ where: { id: message.merchantId } });

        if (message.status === 'success') {
            await Axios.post(client.successUrl, {
                referenceId: message.referenceId 
            })
        } else {
            await Axios.post(client.failedUrl, {
                referenceId: message.referenceId 
            })
        }
    }

}

export default WebhookListener;
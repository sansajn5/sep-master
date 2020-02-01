import { injectable, inject } from "inversify";
import { IWebhookNotifier } from "..";
import { IAMQPMessagingConnection } from "../../messaging";
import { Constants, MessagingConstants } from "../../util";
import { WebhookMessage } from "../../model";
import ILogNotifer from "../ILogNotifier";

@injectable()
class WebhookNotifier implements IWebhookNotifier {
    
    _amqpConnection: IAMQPMessagingConnection;

    _logNotifier: ILogNotifer;

    constructor(@inject(Constants.IAMQPMessagingConnection) amqpConnection: IAMQPMessagingConnection, @inject(Constants.ILogNotifer) logNotifier: ILogNotifer) {
        this._amqpConnection = amqpConnection;
        this._logNotifier = logNotifier;
    }
    
    public async notifyMerchant(merchantId: string, status: 'success' | 'failed', referenceId: string): Promise<void> {
        const channel = this._amqpConnection.getChannel();

        const message: WebhookMessage = {
            merchantId,
            status,
            referenceId
        };

        this._logNotifier.fireLog('RabbitMQ', 'info', 'Call webhook!')

        channel.publish(
            MessagingConstants.WebbookExchangeName,
            MessagingConstants.WebhookNotifyRoutingKey,
            Buffer.from(JSON.stringify(message))
        );
    }

}

export default WebhookNotifier;
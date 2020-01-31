import { injectable, inject } from "inversify";
import { IClientNotifier } from "..";
import { IAMQPMessagingConnection } from "../../messaging";
import { Constants, MessagingConstants } from "../../util";
import { ClientCreatedMessage } from "../../model";
import ILogNotifer from "../ILogNotifier";

@injectable()
class ClientNotifier implements IClientNotifier {
    
    _amqpConnection: IAMQPMessagingConnection;

    _logNotifier: ILogNotifer;

    constructor(@inject(Constants.IAMQPMessagingConnection) amqpConnection: IAMQPMessagingConnection, @inject(Constants.ILogNotifer) logNotifier: ILogNotifer) {
        this._amqpConnection = amqpConnection;
        this._logNotifier = logNotifier;
    }
    
    public async clientCreated(id: string, successUrl: string, failedUrl: string): Promise<void> {
        const channel = this._amqpConnection.getChannel();

        const message: ClientCreatedMessage = {
            id,
            successUrl,
            failedUrl
        };

        this._logNotifier.fireLog('RabbitMQ', 'info', 'Created Client')

        channel.publish(
            MessagingConstants.ClientExchangeName,
            MessagingConstants.ClientCreatedRoutingKey,
            Buffer.from(JSON.stringify(message))
        );
    }

}

export default ClientNotifier;
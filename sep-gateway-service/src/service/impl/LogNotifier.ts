import { injectable, inject } from "inversify";
import * as moment from 'moment';

import ILogNotifer from "../ILogNotifier";
import { IAMQPMessagingConnection } from "../../messaging";
import { Constants, MessagingConstants } from "../../util";
import { LogMessage } from "../../model";

@injectable()
class LogNotifier implements ILogNotifer {

    _amqpConnection: IAMQPMessagingConnection;

    constructor(@inject(Constants.IAMQPMessagingConnection) amqpConnection: IAMQPMessagingConnection) {
        this._amqpConnection = amqpConnection;
    }

    public async fireLog(colerrationId: string, type: 'info' | 'error', description: string): Promise<void> {
        const channel = this._amqpConnection.getChannel();

        const logMessage: LogMessage = {
            correlationId: colerrationId,
            logType: type,
            description: description,
            serviceName: 'Gateway',
            timestamp: moment().format('LLLL')
        }
        
        channel.publish(
            MessagingConstants.LogExchangeName,
            MessagingConstants.LogCreatedRoutingKey,
            Buffer.from(JSON.stringify(logMessage))
        );
    }
}

export default LogNotifier;
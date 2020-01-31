import { injectable, inject } from "inversify";
import * as moment from 'moment';

import { IAMQPMessagingConnection } from "../../messaging";
import { Constants, MessagingConstants } from "../../util";
import { LogMessage } from "../../model";
import { ILogger } from "../../util/logging";
import { ILogNotifier } from '..';

@injectable()
class LogNotifier implements ILogNotifier {

    _amqpConnection: IAMQPMessagingConnection;

    _logger: ILogger;

    constructor(@inject(Constants.IAMQPMessagingConnection) amqpConnection: IAMQPMessagingConnection, @inject(Constants.ILogger) logger) {
        this._amqpConnection = amqpConnection;
        this._logger = logger;
    }

    public async fireLog(colerrationId: string, type: 'info' | 'error', description: string): Promise<void> {
        const channel = this._amqpConnection.getChannel();

        const logMessage: LogMessage = {
            correlationId: colerrationId,
            logType: type,
            description: description,
            serviceName: 'Client',
            timestamp: moment().format('LLLL')
        }
        
        type === 'info' && this._logger.info(JSON.stringify(logMessage));

        this._logger.info(JSON.stringify(logMessage));

        channel.publish(
            MessagingConstants.LogExchangeName,
            MessagingConstants.LogCreatedRoutingKey,
            Buffer.from(JSON.stringify(logMessage))
        );
    }
}

export default LogNotifier;
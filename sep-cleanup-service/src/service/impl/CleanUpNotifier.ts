import { injectable, inject, Container } from "inversify";
import * as moment from 'moment';

import { IAMQPMessagingConnection } from "../../messaging";
import { Constants, MessagingConstants } from "../../util";
import { ILogger } from "../../util/logging";
import { ICleanUpNotifier, ILogNotifier } from "..";

@injectable()
class CleanUpNotifier implements ICleanUpNotifier {

    _amqpConnection: IAMQPMessagingConnection;

    _logNotifer: ILogNotifier;

    _logger: ILogger;

    constructor(@inject(Constants.IAMQPMessagingConnection) amqpConnection: IAMQPMessagingConnection, @inject(Constants.ILogger) logger, @inject(Constants.ILogNotifier) logNotifier: ILogNotifier) {
        this._amqpConnection = amqpConnection;
        this._logNotifer = logNotifier;
        this._logger = logger;
    }

    public async initCleanUp(): Promise<void> {
        const channel = this._amqpConnection.getChannel();

        this._logger.info('Starting cleanup at ' + moment().format('LLLL'));

        channel.publish(
            MessagingConstants.CleanUpExchangeName,
            MessagingConstants.CleanUpRoutingKey,
            Buffer.from('Start cleanup')
        );

        this._logNotifer.fireLog('CRON', 'info', 'CRON CLEAN UP STARTED');
    }
}

export default CleanUpNotifier;
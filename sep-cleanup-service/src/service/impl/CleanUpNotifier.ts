import { injectable, inject, Container } from "inversify";

import { IAMQPMessagingConnection } from "../../messaging";
import { Constants, MessagingConstants } from "../../util";
import { ICleanUpNotifier, ILogNotifier } from "..";

@injectable()
class CleanUpNotifier implements ICleanUpNotifier {

    _amqpConnection: IAMQPMessagingConnection;

    _logNotifer: ILogNotifier;


    constructor(@inject(Constants.IAMQPMessagingConnection) amqpConnection: IAMQPMessagingConnection, @inject(Constants.ILogger) logger, @inject(Constants.ILogNotifier) logNotifier: ILogNotifier) {
        this._amqpConnection = amqpConnection;
        this._logNotifer = logNotifier;
    }

    public async initCleanUp(): Promise<void> {
        const channel = this._amqpConnection.getChannel();

        channel.publish(
            MessagingConstants.CleanUpExchangeName,
            MessagingConstants.CleanUpRoutingKey,
            Buffer.from('Start cleanup')
        );

        this._logNotifer.fireLog('CRON', 'info', 'CRON CLEAN UP STARTED');
    }
}

export default CleanUpNotifier;
import { injectable, inject } from "inversify";
import { ICleanupListener, IWebhookNotifier } from "..";
import { IAMQPMessagingConnection } from "../../messaging";
import { Constants, MessagingConstants } from "../../util";
import { ILogger } from "../../util/logging";
import { ITransactionRepository } from "../../database";

@injectable()
class CleanupListener implements ICleanupListener {

    _logger: ILogger;
    _amqpConnection: IAMQPMessagingConnection;

    _transactionRepository: ITransactionRepository;

    _webhookNotifier: IWebhookNotifier;

    constructor(@inject(Constants.ILogger) logger: ILogger,
                @inject(Constants.IAMQPMessagingConnection) amqpConnection: IAMQPMessagingConnection,
                @inject(Constants.IWebhookNotifier) webhookNotifier: IWebhookNotifier, @inject(Constants.ITransactionRepository) transactionRepository: ITransactionRepository) {
                    this._logger = logger;
                    this._amqpConnection = amqpConnection;
                    this._webhookNotifier = webhookNotifier;
                    this._transactionRepository = transactionRepository;
                }
    
    public async listenCleanup(): Promise<void> {
        const channel = this._amqpConnection.getChannel();

        await channel.consume(MessagingConstants.CleanupStartQueueName, this.processMessage.bind(this), {
            consumerTag: 'logger',
            noAck: false
        })

        this._logger.info('Bank Service is connected to cleanup rabbitmq!');
    }

    // TODO REFACTOR
    private async processMessage(msg): Promise<any> {
    try {
        console.log('cleanup!')
        const date = new Date().getTime() - 3000000;
        const transactions = await this._transactionRepository.getRepo().find();
        for (let i =0; i< transactions.length; i++) {
            if (transactions[i].timestamp.getTime() < date && transactions[i].status === 'CREATED') {
                transactions[i].status = 'CANCEL';
                await this._transactionRepository.getRepo().save(transactions[i])
            } 
        }
    } catch (err) {
        console.log(err);
        return null;
    }

    console.log('cleanup started!')

    const channel = this._amqpConnection.getChannel();
    await channel.ack(msg);
    }

}

export default CleanupListener;
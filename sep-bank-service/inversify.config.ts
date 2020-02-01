import { Container } from 'inversify';

import { ILogger } from './src/util/logging';
import { Constants } from './src/util';
import { Logger } from './src/util/logging/impl';
import { IDatabaseConnection, IClientRepository, ITransactionRepository } from './src/database';
import { DatabaseConnection, ClientRepository, TransactionRepository } from './src/database/impl';
import { IAMQPMessagingConnection } from './src/messaging';
import { AMQPConnection } from './src/messaging/impl';
import ILogNotifer from './src/service/ILogNotifier';
import { LogNotifier, ClientService, WebhookNotifier } from './src/service/impl';
import { IClientService, IWebhookNotifier } from './src/service';
import { IApp, App } from './src/App';

const container = new Container();

container.bind<IApp>(Constants.IApp).to(App);

// singletons
container.bind<ILogger>(Constants.ILogger).to(Logger).inSingletonScope();
container.bind<IDatabaseConnection>(Constants.IDatabaseConnection).to(DatabaseConnection).inSingletonScope();
container.bind<IAMQPMessagingConnection>(Constants.IAMQPMessagingConnection).to(AMQPConnection).inSingletonScope();

container.bind<ILogNotifer>(Constants.ILogNotifer).to(LogNotifier);
container.bind<IWebhookNotifier>(Constants.IWebhookNotifier).to(WebhookNotifier);
container.bind<IClientRepository>(Constants.IClientRepository).to(ClientRepository);
container.bind<ITransactionRepository>(Constants.ITransactionRepository).to(TransactionRepository);
container.bind<IClientService>(Constants.IClientService).to(ClientService).inRequestScope();

export default container;

import { Container } from 'inversify';

import { ILogger } from './src/util/logging';
import { Constants } from './src/util';
import { Logger } from './src/util/logging/impl';
import { IAMQPMessagingConnection } from './src/messaging';
import { AMQPConnection } from './src/messaging/impl';
import { IApp, App } from './src/App';
import { IDatabaseConnection, IClientRepository } from './src/database';
import { IClientService, IClientCreatedListener, IWebhookListener } from './src/service';
import { ClientService, ClientCreatedListener, WebhookListener } from './src/service/impl';
import { ClientRepository, DatabaseConnection } from './src/database/impl';

const container = new Container();

container.bind<IApp>(Constants.IApp).to(App);

// singletons
container.bind<ILogger>(Constants.ILogger).to(Logger).inSingletonScope();
container.bind<IAMQPMessagingConnection>(Constants.IAMQPMessagingConnection).to(AMQPConnection).inSingletonScope();
container.bind<IDatabaseConnection>(Constants.IDatabaseConnection).to(DatabaseConnection).inSingletonScope();

container.bind<IClientCreatedListener>(Constants.IClientCreatedListener).to(ClientCreatedListener);
container.bind<IWebhookListener>(Constants.IWebhookListener).to(WebhookListener);
container.bind<IClientRepository>(Constants.IClientRepository).to(ClientRepository);
container.bind<IClientService>(Constants.IClientService).to(ClientService).inRequestScope();

export default container;

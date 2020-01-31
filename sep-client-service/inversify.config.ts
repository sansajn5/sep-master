import { Container } from 'inversify';

import { ILogger } from './src/util/logging';
import { Constants } from './src/util';
import { Logger } from './src/util/logging/impl';
import { IDatabaseConnection, IClientRepository, IPaymentMethodRepository } from './src/database';
import { DatabaseConnection, ClientRepository, PaymentMethodRepository } from './src/database/impl';
import { IAMQPMessagingConnection } from './src/messaging';
import { AMQPConnection } from './src/messaging/impl';
import ILogNotifer from './src/service/ILogNotifier';
import { LogNotifier, AuthService, ClientService, ClientNotifier } from './src/service/impl';
import { RedisClientService } from './src/cache/impl';
import { ICacheClientService } from './src/cache';
import { IAuthService, IClientService, IClientNotifier } from './src/service';
import { IApp, App } from './src/App';

const container = new Container();

container.bind<IApp>(Constants.IApp).to(App);

// singletons
container.bind<ILogger>(Constants.ILogger).to(Logger).inSingletonScope();
container.bind<IDatabaseConnection>(Constants.IDatabaseConnection).to(DatabaseConnection).inSingletonScope();
container.bind<IAMQPMessagingConnection>(Constants.IAMQPMessagingConnection).to(AMQPConnection).inSingletonScope();
container.bind<ICacheClientService>(Constants.ICacheClientService).to(RedisClientService).inSingletonScope();

container.bind<ILogNotifer>(Constants.ILogNotifer).to(LogNotifier);
container.bind<IClientNotifier>(Constants.IClientNotifier).to(ClientNotifier);
container.bind<IClientRepository>(Constants.IClientRepository).to(ClientRepository);
container.bind<IPaymentMethodRepository>(Constants.IPaymentMethodRepository).to(PaymentMethodRepository);
container.bind<IAuthService>(Constants.IAuthService).to(AuthService).inRequestScope();
container.bind<IClientService>(Constants.IClientService).to(ClientService).inRequestScope();

export default container;

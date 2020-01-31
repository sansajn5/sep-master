import { Container } from 'inversify';

import { ILogger } from './src/util/logging';
import { Constants } from './src/util';
import { Logger } from './src/util/logging/impl';
import { IAMQPMessagingConnection } from './src/messaging';
import { AMQPConnection } from './src/messaging/impl';
import { ILogCreatedListener } from './src/service';
import { LogCreatedListener } from './src/service/impl';
import { IApp, App } from './src/App';

const container = new Container();

container.bind<IApp>(Constants.IApp).to(App);

// singletons
container.bind<ILogger>(Constants.ILogger).to(Logger).inSingletonScope();
container.bind<IAMQPMessagingConnection>(Constants.IAMQPMessagingConnection).to(AMQPConnection).inSingletonScope();

container.bind<ILogCreatedListener>(Constants.ILogCreatedListner).to(LogCreatedListener);

export default container;

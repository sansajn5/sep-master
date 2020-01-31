import { Container } from 'inversify';

import { ILogger } from './src/util/logging';
import { Constants } from './src/util';
import { Logger } from './src/util/logging/impl';
import { IAMQPMessagingConnection } from './src/messaging';
import { AMQPConnection } from './src/messaging/impl';
import { ILogNotifier, ICleanUpNotifier } from './src/service';
import { LogNotifier, CleanUpNotifier } from './src/service/impl';

const container = new Container();

// singletons
container.bind<ILogger>(Constants.ILogger).to(Logger).inSingletonScope();
container.bind<IAMQPMessagingConnection>(Constants.IAMQPMessagingConnection).to(AMQPConnection).inSingletonScope();

container.bind<ILogNotifier>(Constants.ILogNotifier).to(LogNotifier);
container.bind<ICleanUpNotifier>(Constants.ICleanUpNotifier).to(CleanUpNotifier);

export default container;

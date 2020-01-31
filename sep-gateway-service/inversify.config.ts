import { Container } from 'inversify';

import { ILogger } from './src/util/logging';
import { Constants } from './src/util';
import { Logger } from './src/util/logging/impl';
import { IProxy } from './src/util/communication';
import { Proxy } from './src/util/communication/impl';
import { IAMQPMessagingConnection } from './src/messaging';
import ILogNotifer from './src/service/ILogNotifier';
import { LogNotifier } from './src/service/impl';
import { AMQPConnection } from './src/messaging/impl';
import { ICacheClientService } from './src/cache';
import { RedisClientService } from './src/cache/impl';

const container = new Container();

container.bind<ILogger>(Constants.ILogger).to(Logger).inSingletonScope();
container.bind<IAMQPMessagingConnection>(Constants.IAMQPMessagingConnection).to(AMQPConnection).inSingletonScope();
container.bind<ICacheClientService>(Constants.ICacheClientService).to(RedisClientService).inSingletonScope();

container.bind<ILogNotifer>(Constants.ILogNotifer).to(LogNotifier);
container.bind<IProxy>(Constants.IProxy).to(Proxy).inRequestScope().whenTargetNamed(Constants.Proxy);

export default container;

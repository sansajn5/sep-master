import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import { json } from 'body-parser';

import inversifyConfig from '../inversify.config';
import { ILogger } from './util/logging';
import { Constants } from './util';
import { IAMQPMessagingConnection } from './messaging';
import { ICleanUpNotifier } from './service';

dotenvConfig();

const startCron = async (cleanUpNotifier: ICleanUpNotifier, logger: ILogger): Promise<void> => {
  setInterval(async () => {
    logger.info('Cleanup is Ready to Start!');
    await cleanUpNotifier.initCleanUp();
  }, 5 * 60 * 1000)
}

const start = async (): Promise<void> => {
  const logger: ILogger = inversifyConfig.get(Constants.ILogger);
  const amqpConnection: IAMQPMessagingConnection = inversifyConfig.get(Constants.IAMQPMessagingConnection);
  
  await amqpConnection.setup();

  const expressApp: express.Application = express();
  expressApp.use(json());
  expressApp.use(morgan('combined'));
  
  const cleanUpNotifier: ICleanUpNotifier = inversifyConfig.get(Constants.ICleanUpNotifier);

  startCron(cleanUpNotifier, logger);

  expressApp.use((req, res, next) => {
    if (req.url === '/health') return next();
  
    const authHeader = req.header(Constants.SepHeader);
  
    if (!authHeader) {
      return res.status(401).send();
    }
  
    next();
  });
  
  
  expressApp.get('/health', (req: express.Request, res: express.Response) => {
    return res.status(200).json();
  });
  
  const port = process.env.CLEANUP_HTTP_PORT || 3000;
  expressApp.listen(port, () => {
    logger.info(`Cleanup Service is listening on port ${port}!`);
  });
}

start();



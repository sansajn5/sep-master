import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import { json } from 'body-parser';

import inversifyConfig from '../inversify.config';
import { ILogger } from './util/logging';
import { Constants } from './util';
import { IAMQPMessagingConnection } from './messaging';
import { IApp } from './App';
import { IDatabaseConnection } from './database';

dotenvConfig();

const start = async (): Promise<void> => {
  
  const db: IDatabaseConnection = inversifyConfig.get(Constants.IDatabaseConnection);
  const logger: ILogger = inversifyConfig.get(Constants.ILogger);
  const amqpConnection: IAMQPMessagingConnection = inversifyConfig.get(Constants.IAMQPMessagingConnection);
  
  await db.setup();
  await amqpConnection.setup();
  
  const app: IApp = inversifyConfig.get(Constants.IApp);
  
  await app.listenClientCreated();

  const expressApp: express.Application = express();
  expressApp.use(json());
  expressApp.use(morgan('combined'));
  
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
  
  const port = process.env.WEBHOOK_HTTP_PORT || 3000;
  expressApp.listen(port, () => {
    logger.info(`Webhook Service is listening on port ${port}!`);
  });
}

start();



import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as expressJwt from 'express-jwt';

import inversifyConfig from '../inversify.config';
import { ILogger } from './util/logging';
import { Constants } from './util';
import { IDatabaseConnection } from './database';
import ILogNotifer from './service/ILogNotifier';
import { IAMQPMessagingConnection } from './messaging';
import { IApp } from './App';

dotenvConfig();

const start = async (): Promise<void> => {

  const logger: ILogger = inversifyConfig.get(Constants.ILogger);
  const db: IDatabaseConnection = inversifyConfig.get(Constants.IDatabaseConnection);
  const amqpConnection: IAMQPMessagingConnection = inversifyConfig.get(Constants.IAMQPMessagingConnection);
  
  await amqpConnection.setup();
  await db.setup();
  
  const app: IApp = inversifyConfig.get(Constants.IApp);
  const serviceLogger: ILogNotifer = inversifyConfig.get(Constants.ILogNotifer);

  logger.info('BankService connected on database');
  
  await app.listenCleanup();

  const expressApp: express.Application = express();
  expressApp.use(bodyParser.urlencoded({
    extended: true
  }));
  expressApp.use(bodyParser.json());
  expressApp.use(morgan('combined'));

  const jwtAuth = expressJwt({
    secret: process.env.JWT_SECRET,
  }).unless({ path: ['/api/auth/register', '/api/auth/login', '/api/health', '/api/payments','/api/payments/success', '/api/payments/failed'] });

  expressApp.use((req, res, next) => {
    if (req.url === '/api/health') return next();
    // TODO check other headers!
    next();
  });

  expressApp.use(jwtAuth);

  expressApp.get('/api/health', async (req: express.Request, res: express.Response) => {
    serviceLogger.fireLog(req.header(Constants.RequestId), 'info', 'Healt Check');
    return res.status(200).json();
  });

  expressApp.post('/api/auth/register', (req: express.Request, res: express.Response) => {
    serviceLogger.fireLog(req.header(Constants.RequestId), 'info', 'Enter method POST /api/auth/register');
    return app.createClient(req.body).then((data) => {
      res.status(200).json(data)
    }).catch((err) => {
      res.status(400).json(err);
    })
  });

  expressApp.post('/api/payments', (req: express.Request, res: express.Response) => {
    serviceLogger.fireLog(req.header(Constants.RequestId), 'info', 'Enter method POST /api/payments');
    const { merchantId, userId, referenceId, merchantIdOrderId, amount } = req.body;
    return app.prepareTransaction(merchantId, userId, referenceId, merchantIdOrderId, amount).then((data) => {
      res.status(200).json(data)
    }).catch((err) => {
      res.status(400).json(err);
    })
  });

  expressApp.post('/api/payments/success', (req: express.Request, res: express.Response) => {
    serviceLogger.fireLog(req.header(Constants.RequestId), 'info', 'Enter method POST /api/payments/success');
    console.log(req.body);
    const { merchantIdOrderId, status } = req.body;
    return app.updateTransaction(merchantIdOrderId, status).then((data) => {
      res.status(200).json(data)
    }).catch((err) => {
      res.status(400).json(err);
    })
  });

  expressApp.post('/api/payments/failed', (req: express.Request, res: express.Response) => {
    serviceLogger.fireLog(req.header(Constants.RequestId), 'info', 'Enter method POST /api/payments/failed');
    const { merchantIdOrderId, status } = req.body;
    return app.updateTransaction(merchantIdOrderId, status).then((data) => {
      res.status(200).json(data)
    }).catch((err) => {
      res.status(400).json(err);
    })
  });


  const port = process.env.BANK_HTTP_PORT || 3000;
  expressApp.listen(port, async () => {
    logger.info(`BankService is listening on port ${port}!`);
  });
}
start();
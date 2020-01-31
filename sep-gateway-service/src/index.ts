import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as expressJwt from 'express-jwt';
import { readFileSync } from 'fs';
import * as path from 'path';
import * as https from 'https';

import inversifyConfig from '../inversify.config';
import { ILogger } from './util/logging';
import { Constants } from './util';
import { IProxy } from './util/communication';
import { IAMQPMessagingConnection } from './messaging';
import { ICacheClientService } from './cache';
import { http } from 'winston';

dotenvConfig();

const opts = {
  key: readFileSync(path.resolve(__dirname, '../../certificates/server_key.pem')),
  cert: readFileSync(path.resolve(__dirname, '../../certificates/server_cert.pem')),
  requestCert: true,
	rejectUnauthorized: true,
	ca: [
		readFileSync(path.resolve(__dirname, '../../certificates/server_cert.pem')),
	]
}

const ANNONYMUS_ROUTES = ['/api/client/auth/register', '/api/client/auth/login', '/api/client/health'];

const start = async (): Promise<void> => {
  const logger: ILogger = inversifyConfig.get(Constants.ILogger);
  const amqpConnection: IAMQPMessagingConnection = inversifyConfig.get(Constants.IAMQPMessagingConnection);
  
  await amqpConnection.setup();

  const cacheService: ICacheClientService = inversifyConfig.get(Constants.ICacheClientService);

  const expressApp: express.Application = express();
  expressApp.use(bodyParser.urlencoded({
    extended: true
  }));
  expressApp.use(bodyParser.json());
  expressApp.use(morgan('combined'));

  const jwtAuth = expressJwt({
    secret: process.env.JWT_SECRET,
    getToken: function fromHeaderOrQuerystring (req) {
      return req.header(Constants.SepHeader);
    }
  }).unless({ path: ANNONYMUS_ROUTES });

  
  expressApp.use(async (req, res, next) => {
    if (req.url === '/health') return next();
    const authHeader = req.header(Constants.SepHeader);

    if (!authHeader) {
      return res.status(401).send();
    }

    const cacheUser = await cacheService.getValue(`${Constants.SESSION_PREFIX}${authHeader}`);
    if (!cacheUser && !ANNONYMUS_ROUTES.some(route => req.url === route)) {
      return res.status(401).send();  
    }
    
    next();
  });

  expressApp.use(jwtAuth);

  expressApp.get('/health', (req: express.Request, res: express.Response) => {
    return res.status(200).json();
  });

  expressApp.all('/api/*', (req: express.Request, res: express.Response) => {
    const proxy: IProxy = inversifyConfig.getNamed(Constants.IProxy, Constants.Proxy);
    const url = req.url.replace('api/', '');
    return proxy.forwardRequest(url, req, res);
  });

  const port = process.env.GATEWAY_HTTP_PORT || 3000;
  const server = https.createServer(opts, expressApp);
  server.listen(port, () => {
    logger.info(`External gateway is listening on port ${port}!`);
  });
}
start();

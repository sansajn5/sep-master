import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import Axios from 'axios';

import { IProxy } from '..';
import BaseProxy from './BaseProxy';
import { ILogger } from '../../logging';
import { Constants } from '../../index';
import {ILogNotifier} from '../../../service';

@injectable()
export default class Proxy extends BaseProxy implements IProxy {

  _logger: ILogger;
  _logNotifier: ILogNotifier;

  constructor(@inject(Constants.ILogger) logger: ILogger, @inject(Constants.ILogNotifer) logNotifer: ILogNotifier) {
    super();
    this._logger = logger;
    this._logNotifier = logNotifer;
  }

  async forwardRequest(url: string, req: Request, res: Response): Promise<Response> {
    try {
      const response = await Axios.request({
        baseURL: `${this.getMircoService(url)}`,
        method: this.getMethod(req),
        data: req.body,
        params: req.query,
        headers: this.checkAndGetHeaders(req),
      });

      this._logger.info(JSON.stringify({
        timestamp: new Date(),
        colerrationId: req.headers[Constants.RequestId],
        target: url
      }));
      // @ts-ignore
      this._logNotifier.fireLog(req.headers['ColerrationId'], 'info', 'start')

      return res.status(response.status).send(response.data);
    } catch (err) {
      if (!err.response) {
        this._logger.error(err);
        return res.status(500).send('Internal server error');
      }
      return res.status(err.response.status).send(err.response.data);
    }
  }

  private getMircoService = (requestUrl: string): string => {
    const service = requestUrl.split('/')[1];
    let base = '';
    switch (service) {
      case 'client':
        requestUrl = requestUrl.replace('client/', '');
        base = `${process.env.SERVICE_CLIENT}`;
      break;
      default:
        throw new Error('Microservice not found');
    }
    return `${base}/api${requestUrl}`
  }
}

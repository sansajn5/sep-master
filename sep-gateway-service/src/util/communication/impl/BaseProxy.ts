import { Request } from 'express';
import { Method } from 'axios';
import { injectable } from 'inversify';
import { uuid } from 'uuidv4';

import { Constants } from '../..';

@injectable()
export default class BaseProxy {

  // Support only GET methods for now.
  protected getMethod(req: Request): Method {
    switch (req.method) {
      case 'GET':
      case 'get':
        return 'GET';
      case 'POST':
      case 'post':
        return 'POST';
      default:
        throw new Error('HTTP method not allowed!');
    }
  }

  protected checkAndGetHeaders(req: Request): any {
    const { headers } = req;

    if (!headers[Constants.SepHeader]) {
      throw new Error('Sep auth header not found!');
    }

    headers['Authorization'] = `Bearer ${headers[Constants.SepHeader]}`;
    headers[Constants.RequestId] = uuid();

    return headers;
  }
}

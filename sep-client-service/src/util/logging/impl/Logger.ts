import { createLogger, format, Logger as WinstonLogger, transports } from 'winston';
import { injectable } from 'inversify';
import * as moment from 'moment';

import { ILogger } from '..';

@injectable()
class Logger implements ILogger {
  _logger: WinstonLogger;

  constructor() {
    this._logger = createLogger({
      level: 'debug',
      format: format.json(),
      transports: [
        new transports.Console({
          format: format.simple(),
        }),
        new transports.File({ filename: `logs/${moment().format('L')}-logs.log`})
      ],
    });
  }

  public info(message: string) {
    this._logger.info(message);
  }

  public error(err: Error) {
    this._logger.error(err.message);
  }
}

export default Logger;

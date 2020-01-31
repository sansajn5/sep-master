import { Request, Response } from 'express';

export default interface IProxy {
  forwardRequest(url: string, req: Request, res: Response): Promise<Response>;
}

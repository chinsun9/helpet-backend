import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  return !(req.session as any).user ? res.json('no session') : next();
};

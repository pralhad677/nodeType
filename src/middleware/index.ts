import { Request, Response, NextFunction } from 'express';

const sampleMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('Sample Middleware executed');
  next();
};

export default sampleMiddleware;
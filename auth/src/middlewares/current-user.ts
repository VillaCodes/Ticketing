import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

//First three keyword pairs are how we reach into an existing type definition to augment it
//Noteably, we did not have to extend Request. We name the exact interface and add an additional property to it
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    //extract payload and attach to currentUser to work with in other middleware
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}

  //whether or not we decode successfully, we always want to move on to next middleware
  next();
};
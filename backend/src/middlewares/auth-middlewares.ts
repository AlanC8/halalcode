import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../auth/models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
  ) {
      try {
          token = req.headers.authorization.split(' ')[1];

          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

          const user = await User.findById(decoded.id).select('-password');
          if (user) {
              req.user = user as IUser; // Приведение типов
              next();
          } else {
              res.status(401).json({ message: 'Not authorized, user not found' });
          }
      } catch (error) {
          res.status(401).json({ message: 'Not authorized, token failed' });
      }
  } else {
      res.status(401).json({ message: 'Not authorized, no token' });
  }
};
import { Role } from '../types/role';
import { NextFunction, Request, Response } from 'express';

export default function roleMiddleware(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
  
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }
    
      next();
    };
}
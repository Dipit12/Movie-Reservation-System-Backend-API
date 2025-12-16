import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import {Request,Response,NextFunction} from 'express'
dotenv.config()
export function authenticateToken(req:Request, res:Response, next:NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }
  const secret = process.env.JWT_SECRET
  if(!secret){
    return res.status(500).json({ message: 'JWT secret not configured' });
  }
  
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    // Attach decoded token payload to req.user
    if (decoded && typeof decoded === 'object') {
      req.user = decoded as Express.UserPayload;
    }
    
    next();
  });
}
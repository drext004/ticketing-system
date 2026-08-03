import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

//middleware to authenticate JWT token

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token){
    res.status(401).json({message: "Access denied. No token provided"});
    return;
  }

  const secret= process.env.JWT_SECRET ;
  if (!secret){
    res.status(500).json({message: "Server error. JWT secret not configured"});
    return;
  }
  jwt.verify(token, secret, (err, decoded)=>{
    if (err){

      res.status(403).json({message: "Invalid or expired token"});
      return;
    }

    (req as any).user = decoded;

    next();
  })

  


}

export default authenticateToken;
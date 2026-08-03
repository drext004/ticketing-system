import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


//login block and JWT creation
const login = async(req: Request, res: Response)=> {
  const {email, password} = req.body;

  try{
    const user = await prisma.user.findUnique({
      where: {email}
    });

    if (!user){
      res.status(404).json({message:"user not found!"});
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
      res.status(401).json({message: "Invalid credentials"});
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ message: "Server error. JWT secret not configured" });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn: '1h' }
    );

    res.status(200).json({message:"Token created", token});

  }

  catch (error) {
    console.error("[LOGIN ERROR]:", error);
    res.status(500).json({error: "Internal server error"});
  }

};

export default login;





import bcrypt from 'bcrypt';

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const register = async(req: Request, res: Response, ) => {
  const {name, email, password } = req.body;
  
  try{
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser= await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
      });
      
      res.status(201).json({
        message:"new user created", 
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
      }
    });
    }
    catch(error) {
      console.error("Error logging", error);
      res.status(400).json({ error: "Email already in use or invalid data" });

    }
};


export default register;
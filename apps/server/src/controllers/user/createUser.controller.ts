import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '@repo/db';
import { createUserSchema } from '../../validators/user.validator';

export default async function createUserController(req: Request, res: Response) {
  try {
    const result = createUserSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: result.error.issues,
      });
    }

    const { name, email, password, role } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    console.log('create user error:', err);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
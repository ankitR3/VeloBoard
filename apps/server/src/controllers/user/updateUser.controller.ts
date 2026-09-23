import { Request, Response } from 'express';
import prisma from '@repo/db';
import { updateUserSchema } from '../../validators/user.validator';

export default async function updateUserController(req: Request<{ userId: string }>, res: Response) {
  try {
    const { userId } = req.params;

    const result = updateUserSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: 'Invalid request data',
        error: result.error.issues,
      });
    }
  
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      return res.status(404).json({
        message: 'user not found'
      });
    }

    const { name, email, password, role, isActive } = result.data;

    const data: {
      name?: string;
      email?: string;
      password?: string;
      role?: 'ADMIN' | 'PROJECT_MANAGER' | 'DEVELOPER';
      isActive?: boolean;
    } = {};

    if (name !== undefined) {
      data.name = name;
    }

    if (email !== undefined) {
      data.email = email;
    }

    if (password !== undefined) {
      data.password = await bcrypt.hash(password, 10);
    }

    if (role !== undefined) {
      data.role = role;
    }

    if (isActive !== undefined) {
      data.isActive = isActive;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    console.log('update user error: ', err);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
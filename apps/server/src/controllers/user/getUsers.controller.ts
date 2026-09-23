import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function getUsersController(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
    });

    return res.status(200).json({
      message: 'users fetched successfully',
      users,
    });
  } catch (err) {
    console.log('get users error:', err);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
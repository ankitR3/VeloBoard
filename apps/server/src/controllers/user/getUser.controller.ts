import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function getUserController(req: Request<{ userId: string }>, res: Response) {
  try {
    const { userId } = req.params;
  
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
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
  
    if (!user) {
      return res.status(404).json({
        message: 'user not found'
      });
    } 

    return res.status(200).json({
      message: 'user fetched successfully',
      user
    });
  } catch (err) {
    console.log('get user error: ', err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
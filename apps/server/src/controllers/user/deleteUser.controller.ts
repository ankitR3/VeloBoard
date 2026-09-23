import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function deleteUserController(req: Request<{ userId: string }>, res: Response) {
  try {
    const { userId } = req.params;
  
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
  
    await prisma.user.delete({
      where: {
        id: userId
      }
    });

    return res.status(200).json({
      message: 'user deleted successfully'
    });
  } catch (err) {
    console.log('delete user error: ', err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
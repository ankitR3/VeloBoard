import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function getNotificationController(req: Request, res: Response) {
  try {
    const userId = req.user.id;

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      message: 'Notifications fetched successfully',
      notifications
    });
  } catch (err) {
    console.log('get notifications error: ', err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
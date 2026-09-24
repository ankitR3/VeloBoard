import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function markNotificationsReadController(req: Request, res: Response) {
  try {
    const userId = req.user.id;

    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    return res.status(200).json({
      message: "All notifications marked as read",
      count: result.count,
    });
  } catch (err) {
    console.log('mark notifications read error: ', err)
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
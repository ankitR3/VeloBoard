import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function markNotificationReadController(req: Request<{ notificationId: string }>, res: Response) {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;
  
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }
    
    if (notification.isRead) {
      return res.status(400).json({
        message: "Notification is already read",
      });
    }

    const updateNotification = await prisma.notification.update({
      where: {
        id: notificationId
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    return res.status(200).json({
      message: 'notification marked as read',
      updateNotification
    });
  } catch (err) {
    console.log('mark notfication read error: ', err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
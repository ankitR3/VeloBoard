import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function getActivityController(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const where: any = {};

    if (userRole === 'PROJECT_MANAGER') {
      where.project = {
        createdById: userId
      };
    }

    if (userRole === 'DEVELOPER') {
      where.task = {
        assigneedId: userId,
      };
    }

    const activities = await prisma.activityLog.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            role: true
          },
        },
        task: {
          select: {
            id: true,
            number: true,
            title: true,
            status: true
          },
        },
        project: {
          select: {
            id: true,
            name: true
          },
        },
      },
    });

    return res.status(200).json({
      message: 'Activity fetched successfully',
      activities
    });
  } catch (err) {
    console.log('get activity error: ', err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
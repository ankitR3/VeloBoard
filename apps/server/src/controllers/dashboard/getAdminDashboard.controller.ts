import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function getAdminDashboard(req: Request, res: Response) {
  try {
    const totalProjects = await prisma.project.count();

    const tasksByStatus = await prisma.task.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const overdueTasks = await prisma.task.count({
      where: {
        isOverdue: true,
      },
    });

    return res.status(200).json({
      dashboard: {
        totalProjects,
        tasksByStatus,
        overdueTasks,
        activeUsers: 0,
      },
    });
  } catch (err) {
    console.log('get admin dashboard error: ', err);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
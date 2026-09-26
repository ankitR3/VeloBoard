import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function getManagerDashboard(req: Request, res: Response) {
  try {
    const userId = req.user.id;
  
    const totalProjects = await prisma.project.count({
      where: {
        createdById: userId,
      },
    });
  
    const tasksByPriority = await prisma.task.groupBy({
      by: ['priority'],
      where: {
        project: {
          createdById: userId,
        },
      }, _count: {
        id: true,
      },
    });

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const tasksDueThisWeek = await prisma.task.count({
      where: {
        project: {
          createdById: userId,
        },
        dueDate: {
          gte: startOfWeek,
          lt: endOfWeek,
        },
      },
    });

    return res.status(200).json({
      message: "Manager dashboard fetched successfully",
      dashboard: {
        totalProjects,
        tasksByPriority,
        tasksDueThisWeek,
      },
    });
  } catch (err) {
    console.log('get manager dashboard error: ', err);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function getDeveloperDashboard(req: Request, res: Response) {
  try {
    const userId = req.user.id;

    const tasks = await prisma.task.findMany({
      where: {
        assigneeId: userId,
      },
      orderBy: [
        {
          priority: 'desc',
        },
        {
          dueDate: 'asc',
        },
      ],
    });

    return res.status(200).json({
      message: 'Developer dashboard fetched successfully',
      dashboard: {
        tasks,
      },
    });
  } catch (err) {
    console.log('get developer dashboard error: ', err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
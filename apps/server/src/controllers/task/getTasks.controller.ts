import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function getTasksController(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const { status, priority, dueDate } = req.query;

    const where: any = {};

    if (userRole === 'PROJECT_MANAGER') {
      where.project = {
        createdById: userId,
      };
    }

    if (userRole === 'DEVELOPER') {
      where.assigneeId = userId;
    }

    // Filters
    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (dueDate) {
      where.dueDate = {
        gte: new Date(`${dueDate}T00:00:00.000Z`),
        lt: new Date(`${dueDate}T23:59:59.999Z`),
      };
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      }
    });

    return res.status(200).json({
      message: 'task fetched successfully',
      tasks
    });
  } catch (err) {
    console.log('get tasks error: ', err);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function getTaskController(req: Request<{ taskId: string }>, res: Response) {
  try {
    const { taskId } = req.params;
  
    const userId = req.user.id;
    const userRole = req.user.role;
  
    const task = await prisma.task.findUnique({
      where: {
        id: taskId
      },
      include: {
        project: true,
      },
    });
  
    if (!task) {
      return res.status(404).json({
        message: 'task not found'
      })
    }

    if (userRole === "PROJECT_MANAGER" && task.project.createdById !== userId) {
      return res.status(403).json({
        message: "You cannot view this task",
      });
    }

    if (userRole === "DEVELOPER" && task.assigneeId !== userId) {
      return res.status(403).json({
        message: "You cannot view this task",
      });
    }

    return res.status(200).json({
      message: 'task fetched successfully',
      task,
    });
  } catch (err) {
    console.log('get task error: ', err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
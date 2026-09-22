import { Request, Response } from 'express';
import prisma from '@repo/db';
import { updateTaskStatusSchema } from '../../validators/task.validator';

export default async function updateTaskStatus(req: Request<{ taskId: string }>, res: Response) {
  try {
    const result = updateTaskStatusSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: result.error.issues,
      });
    }
    
    const { status } = result.data;
    const { taskId } = req.params;
  
    const userId = req.user.id;
    const userRole = req.user.role;
  
    const task = await prisma.task.findUnique({
      where: {
        id: taskId
      },
      include: {
        project: true
      }
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (userRole === 'PROJECT_MANAGER' && task.project.createdById !== userId) {
      return res.status(403).json({
        message: 'You cannot update this task',
      });
    }

    if (userRole === 'DEVELOPER' && task.assigneeId !== userId) {
      return res.status(403).json({
        message: 'you cannot update your task'
      });
    }

    if (task.status === status) {
      return res.status(400).json({
        message: "Task is already in this status",
      });
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId
      },
      data: {
        status,
      },
    });

    await prisma.activityLog.create({
      data: {
        taskId: task.id,
        projectId: task.projectId,
        actorId: userId,
        type: "STATUS_CHANGED",
        fromStatus: task.status,
        toStatus: status,
      },
    });

    if (status === 'IN_REVIEW') {
      await prisma.notification.create({
        data: {
          userId: task.project.createdById,
          taskId: task.id,
          type: "TASK_IN_REVIEW",
          message: `Task "${task.title}" is ready for review`,
        },
      });
    }

    return res.status(200).json({
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    console.log('update task status error: ', err);
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
}
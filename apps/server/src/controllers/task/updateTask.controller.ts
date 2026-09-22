import { Request, Response } from 'express';
import prisma from '@repo/db';
import { updateTaskSchema } from '../../validators/task.validator';

export default async function updateTaskController(req: Request<{ taskId: string }>, res: Response) {
  try {
    const { taskId } = req.params;

    const result = updateTaskSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: result.error.issues,
      });
    }

    const { title, description, assigneeId, priority, dueDate } = result.data;

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
        message: 'task not found'
      });
    }

    if (userRole === 'PROJECT_MANAGER' && task.project.createdById !== userId) {
      return res.status(403).json({
        message: 'you cannot update this task'
      });
    }

    let assignee = null;
    
    if (assigneeId) {
      assignee = await prisma.user.findUnique({
        where: {
          id: assigneeId,
        },
      });

      if (!assignee || assignee.role !== 'DEVELOPER') {
        return res.status(400).json({
          message: 'Invalid developer',
        });
      }
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title,
        description,
        assigneeId,
        priority,
        dueDate,
      },
    });

    return res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (err) {
    console.log('update task error: ', err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
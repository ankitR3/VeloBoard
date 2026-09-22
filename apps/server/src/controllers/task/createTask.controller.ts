import { Request, Response } from 'express';
import prisma from '@repo/db';
import { createTaskSchema } from '../../validators/task.validator';

export default async function createTaskController(req: Request<{ projectId: string }>, res: Response) {
  try {
    const result = createTaskSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: result.error.issues,
      });
    }
    
    const { title, description, assigneeId, priority, dueDate } = result.data;
    const { projectId } = req.params;

    const userId = req.user.id;
    const userRole = req.user.role;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (userRole === 'PROJECT_MANAGER' && project.createdById !== userId) {
      return res.status(403).json({
        message: "You cannot create a task in this project",
      });
    }

    const assignee = assigneeId ? await prisma.user.findUnique({
      where: {
        id: assigneeId,
      },
    }) : null;

    if (assigneeId && (!assignee || assignee.role !== 'DEVELOPER')) {
      return res.status(400).json({
        message: "Invalid developer",
      });
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        createdById: userId,
        title,
        description,
        assigneeId,
        priority,
        dueDate
      }
    });

    // Create actitvity log
    await prisma.activityLog.create({
      data: {
        taskId: task.id,
        projectId,
        actorId: userId,
        type: "TASK_CREATED",
      },
    });

    // Create notifictaion if a developer is assigned
    if (assigneeId) {
      await prisma.notification.create({
        data: {
          userId: assigneeId,
          taskId: task.id,
          type: 'TASK_ASSIGNED',
          message: `You have been assigned task "${task.title}"`,
        },
      });
    }

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    console.log('create task error: ', err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
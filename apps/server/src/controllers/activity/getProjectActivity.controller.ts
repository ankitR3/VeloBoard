import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function getProjectActivityController(req: Request<{ projectId: string }>, res: Response) {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      }
    });

    if (!project) {
      return res.status(404).json({
        message: 'project not found'
      });
    }

    if (userRole === "PROJECT_MANAGER" && project.createdById !== userId) {
      return res.status(403).json({
        message: "You do not have access to this project",
      });
    }
    
    if (userRole === "DEVELOPER") {
      const hasAssignedTask = await prisma.task.findFirst({
        where: {
          projectId,
          assigneeId: userId,
        },
      });

      if (!hasAssignedTask) {
        return res.status(403).json({
          message: "You do not have access to this project",
        });
      }
    }

    const activities = await prisma.activityLog.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        task: {
          select: {
            id: true,
            number: true,
            title: true,
            status: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: 'Project activity fetched successfully',
      activities,
    });
  } catch (err) {
    console.log('get project activity error: ', err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
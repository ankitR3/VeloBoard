import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function deleteProjectController(req: Request<{ projectId: string }>, res: Response) {
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
        message: "You cannot delete this project",
      });
    }

    await prisma.project.delete({
      where: {
        id: projectId
      }
    });

    return res.status(200).json({
      message: 'project deleted successfully'
    });
  } catch (err) {
    console.log('delete project error', err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
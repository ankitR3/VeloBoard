import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function getProjectController(req: Request<{ projectId: string }>, res: Response) {
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
        message: 'You cannot view this project',
      });
    }

    return res.status(200).json({
      message: 'project fetched successfully',
      project
    });
  } catch (err) {
    console.log('get project error: ', err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
import { Request, Response } from 'express';
import prisma from '@repo/db';
import { updateProjectSchema } from '../../validators/project.validator';

export default async function updateProjectController(req: Request<{ projectId: string }>, res: Response) {
  try {
    const { projectId } = req.params;

    const result = updateProjectSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: result.error.issues,
      });
    }

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
        message: 'You cannot update this project',
      });
    }

    const { name, description, clientId } = result.data;

    if (clientId !== undefined) {
      const client = await prisma.client.findUnique({
        where: {
          id: clientId,
        },
      });

      if (!client) {
        return res.status(404).json({
          message: "Client not found",
        });
      }
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        name,
        description,
        clientId,
      },
    });

    return res.status(200).json({
      message: 'project updated successfully',
      updatedProject
    });
  } catch (err) {
    console.log('update project error: ', err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
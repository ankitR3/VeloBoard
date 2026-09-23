import { Request, Response } from 'express';
import { createProjectSchema } from '../../validators/project.validator';
import prisma from '@repo/db';

export default async function createProjectController(req: Request, res: Response) {
  try {
    const result = createProjectSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: result.error.issues,
      });
    }

    const { name, description, clientId } = req.body;
    const userId = req.user.id;

    const client = await prisma.client.findUnique({
      where: {
        id: clientId
      }
    });

    if (!client) {
      return res.status(404).json({
        message: 'client not found'
      });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        clientId,
        createdById: userId,
      },
    });

    return res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (err) {
    console.log('create project error: ', err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
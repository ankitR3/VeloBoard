import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function getProjectsController(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const where: any = {};

    if (userRole === "PROJECT_MANAGER") {
      where.createdById = userId;
    }
    
    const projects = await prisma.project.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      message: 'projects fetched successfully',
      projects
    });
  } catch (err) {
    console.log('get projects error: ', err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
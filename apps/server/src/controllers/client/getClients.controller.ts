import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function getClientsController(req: Request, res: Response) {
  try {
    const clients = await prisma.client.findMany({
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      },
    });
    return res.status(200).json({
      message: 'clients fetched successfully',
      clients
    });
  } catch (err) {
    console.log('get clients error: ', err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
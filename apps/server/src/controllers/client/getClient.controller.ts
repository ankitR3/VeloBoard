import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function getClientController(req: Request<{ clientId: string }>, res: Response) {
  try {
    const { clientId } = req.params;

    const client = await prisma.client.findUnique({
      where: {
        id: clientId
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true
          },
        },
      },
    });

    if (!client) {
      return res.status(404).json({
        message: 'client not found'
      });
    }

    return res.status(200).json({
      message: 'Client fetched successfully',
      client,
    });
  } catch (err) {
    console.log('get client error: ', err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
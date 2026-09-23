import { Request, Response } from 'express';
import prisma from '@repo/db';

export default async function deleteClientController(req: Request<{ clientId: string }>, res: Response) {
  try {
    const { clientId } = req.params;
  
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

    await prisma.client.delete({
      where: {
        id: clientId
      }
    });

    return res.status(200).json({
      message: 'client deleted successfully'
    });
  } catch (err) {
    console.log('delete client error: ', err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
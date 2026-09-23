import { Request, Response } from 'express';
import prisma from '@repo/db';
import { updateClientSchema } from '../../validators/client.validator';

export default async function updateClientController(req: Request<{ clientId: string }>, res: Response) {
  try {
    const { clientId } = req.params;

    const result = updateClientSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: result.error.issues,
      });
    }

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

    const updatedClient = await prisma.client.update({
      where: {
        id: clientId
      },
      data: result.data,
    });

    return res.status(200).json({
      message: 'client updated successfully',
      updatedClient
    });
  } catch (err) {
    console.log('update client error: ', err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
import { Request, Response } from 'express';
import { createClientSchema } from '../../validators/client.validator';
import prisma from '@repo/db';

export default async function createClientController(req: Request, res: Response) {
  try {
    const result = createClientSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: result.error.issues,
      });
    }

    const { name, email, company } = result.data;

    const client = await prisma.client.create({
      data: {
        name,
        email,
        company,
      },
    });

    return res.status(201).json({
      message: 'Client created successfully',
      client,
    });
  } catch (err) {
    console.log('create client error: ', err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
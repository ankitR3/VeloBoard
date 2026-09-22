import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(2),
  email: z.email().optional(),
  company: z.string().min(2).optional(),
});

export const updateClientSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.email().optional(),
  company: z.string().min(2).optional(),
});
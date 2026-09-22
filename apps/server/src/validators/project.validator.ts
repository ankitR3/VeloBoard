import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  clientId: z.string().min(1),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  clientId: z.string().min(1).optional(),
});
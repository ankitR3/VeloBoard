import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "PROJECT_MANAGER", "DEVELOPER"]),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(["ADMIN", "PROJECT_MANAGER", "DEVELOPER"]).optional(),
  isActive: z.boolean().optional(),
});
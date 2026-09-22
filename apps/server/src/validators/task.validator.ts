import { z } from 'zod';

export const createTaskSchema = z.object({ 
  title: z.string().min(2),
  description: z.string().optional(),
  assigneeId: z.string().min(1).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  assigneeId: z.string().min(1).nullable().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  dueDate: z.coerce.date().nullable().optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum([
    "TODO",
    "IN_PROGRESS",
    "IN_REVIEW",
    "DONE",
  ]),
});
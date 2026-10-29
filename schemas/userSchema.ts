import { z } from 'zod';

export const createUserSchema = z.object({
    email: z.email().max(254),
    password: z.string().min(8).max(50),
    firstName: z.string().trim().min(1).max(50),
    lastName: z.string().trim().min(1).max(50),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
    firstName: z.string().trim().min(1).max(50).optional(),
    lastName: z.string().trim().min(1).max(50).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

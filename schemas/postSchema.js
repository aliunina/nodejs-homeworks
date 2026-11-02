import { z } from 'zod';

export const createPostSchema = z.object({
    title: z.string().trim().min(1).max(254),
    description: z.string().trim().min(1).max(5000),
});

export const updatePostSchema = z
    .object({
        title: z.string().trim().min(1).max(254).optional(),
        description: z.string().trim().min(1).max(5000).optional(),
    })
    .refine((params) => params.title ?? params.description, {
        message: 'Request body can not be empty',
    });

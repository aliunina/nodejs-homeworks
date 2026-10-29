import { z } from 'zod';

export const createPostSchema = z.object({
    title: z.string().trim().min(1).max(254),
    description: z.string().trim().min(1).max(5000),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
    title: z.string().trim().min(1).max(254).optional(),
    description: z.string().trim().min(1).max(5000).optional(),
});

export type UpdatePostInput = z.infer<typeof updatePostSchema>;

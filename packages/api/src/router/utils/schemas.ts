import { z } from 'zod';

export const userInteractInput = z.object({ userId: z.string(), targetUserId: z.string() });

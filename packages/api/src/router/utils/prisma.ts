import { PrismaClient } from '@acme/db';
import { z } from 'zod';
import { userInteractInput } from './schemas';
import { likeUserSelect } from './selectors';

export const likeUser = async (prisma: PrismaClient, input: z.infer<typeof userInteractInput>) =>
  prisma.user.update({
    where: { id: input.targetUserId },
    data: {
      likedBy: { connect: { id: input.userId } },
    },
    select: likeUserSelect,
  });

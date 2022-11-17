import { Prisma } from '@acme/db';
import { likeUser } from '../router/utils/prisma';

export type LikedUser = Prisma.PromiseReturnType<typeof likeUser>;

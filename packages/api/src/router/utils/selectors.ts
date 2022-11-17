import { Prisma } from '@acme/db';

export const likeUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  displayName: true,
  gender: true,
  liked: true,
});

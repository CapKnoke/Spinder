import { t } from '../trpc';
import { z } from 'zod';
import { getSpotifyUserData } from '../utils/spotify';
import { likeUserSelect } from './utils/selectors';
import { userInteractInput } from './utils/schemas';
import { likeUser } from './utils/prisma';

export const userRouter = t.router({
  // QUERIES
  byId: t.procedure.input(z.string().nullish()).query(({ ctx, input }) => {
    if (!input) return null;
    return ctx.prisma.user.findUnique({ where: { id: input } });
  }),
  matchQuee: t.procedure.input(z.string().nullish()).query(({ ctx, input }) => {
    if (!input) return [];
    return ctx.prisma.user.findMany({
      where: {
        NOT: {
          OR: [
            { id: input },
            { swiped: { some: { id: input } } },
            { swipedBy: { some: { id: input } } },
            { likedBy: { some: { id: input } } },
          ],
        },
      },
    });
  }),
  // MUTATIONS
  swipe: t.procedure.input(userInteractInput).mutation(({ ctx, input }) => {
    return ctx.prisma.user.update({
      where: { id: input.targetUserId },
      data: {
        swipedBy: { connect: { id: input.userId } },
      },
      select: { displayName: true },
    });
  }),
  like: t.procedure.input(userInteractInput).mutation(async ({ ctx, input }) => {
    const likedUser = await likeUser(ctx.prisma, input);
    const isMatch = likedUser.liked.some(({ id }) => id === input.userId);
    return { likedUser, match: isMatch };
  }),
  unlike: t.procedure
    .input(z.object({ userId: z.string(), targetUserId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const unlikedUser = await ctx.prisma.user.update({
        where: { id: input.targetUserId },
        data: {
          likedBy: {
            disconnect: { id: input.userId },
          },
        },
        select: likeUserSelect,
      });
      return { unlikedUser };
    }),
  updateOrCreate: t.procedure
    .input(
      z.object({
        id: z.string(),
        displayName: z.string(),
        email: z.string().email(),
        emailVerified: z.boolean(),
        age: z.number(),
        gender: z.enum(['MALE', 'FEMALE']),
        interestedIn: z.enum(['MALE', 'FEMALE', 'BOTH']),
        bio: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.upsert({
        where: { id: input.id },
        create: input,
        update: { ...input, updatedAt: new Date() },
      });
    }),
  setSpotifyData: t.procedure
    .input(
      z.object({
        userId: z.string(),
        spotifyAccessCode: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const spotifyData = (await getSpotifyUserData(input.spotifyAccessCode)) as any;
      if (spotifyData.error) {
        throw spotifyData.error;
      }
      return ctx.prisma.user.update({
        where: { id: input.userId },
        data: { spotifyData },
      });
    }),
});

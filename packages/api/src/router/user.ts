import { t } from '../trpc';
import { z } from 'zod';
import { Prisma } from '@acme/db';
import { getSpotifyUserData } from '../utils/spotify';

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
            { likedBy: { some: { id: input } } },
          ],
        },
      },
    });
  }),
  matches: t.procedure.input(z.string().nullish()).query(async ({ ctx, input }) => {
    if (!input) return [];
    const { matches } = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: input },
      select: {
        matches: {
          select: {
            id: true,
            seen: true,
            matchedUser: { select: { displayName: true, gender: true } },
          },
        },
      },
    });
    return matches;
  }),
  newMatches: t.procedure.input(z.string().nullish()).query(async ({ ctx, input }) => {
    if (!input) return [];
    const { matches } = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: input },
      select: {
        matches: {
          where: { seen: false },
          select: {
            id: true,
            seen: true,
            matchedUser: { select: { displayName: true, gender: true } },
          },
        },
      },
    });
    return matches;
  }),
  // MUTATIONS
  swipe: t.procedure
    .input(z.object({ userId: z.string(), targetUserId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: input.targetUserId },
        data: {
          swipedBy: { connect: { id: input.userId } },
        },
        select: { displayName: true },
      });
    }),
  like: t.procedure
    .input(z.object({ userId: z.string(), targetUserId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const likedUser = await ctx.prisma.user.update({
        where: { id: input.targetUserId },
        data: {
          likedBy: { connect: { id: input.userId } },
        },
        select: {
          id: true,
          displayName: true,
          liked: { select: { id: true } },
        },
      });
      const isMatch = likedUser.liked.some(({ id }) => id === input.userId);
      if (isMatch) {
        try {
          await ctx.prisma.match.createMany({
            data: [
              { userId: input.userId, matchedUserId: input.targetUserId },
              { userId: input.targetUserId, matchedUserId: input.userId },
            ],
          });
          return { displayName: likedUser.displayName, match: true };
        } catch (err) {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            console.log(err.message);
            return { displayName: likedUser.displayName, match: false };
          }
          throw err;
        }
      }
      return { displayName: likedUser.displayName, match: isMatch };
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

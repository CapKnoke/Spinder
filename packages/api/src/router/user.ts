import { t } from '../trpc';
import { z } from 'zod';
import { getSpotifyUserData } from '../utils/spotify';

export const userRouter = t.router({
  all: t.procedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  byId: t.procedure.input(z.string().nullish()).mutation(async ({ ctx, input }) => {
    if (input) {
      return ctx.prisma.user.findUniqueOrThrow({ where: { id: input } });
    }
    return null;
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
    .mutation(async ({ ctx, input }) => {
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

import { t } from '../trpc';
import { z } from 'zod';

export const userRouter = t.router({
  all: t.procedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  byId: t.procedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.prisma.user.findUnique({ where: { id: input } });
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
});

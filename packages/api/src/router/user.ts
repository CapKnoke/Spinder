import { t } from '../trpc';
import { z } from 'zod';

export const userRouter = t.router({
  all: t.procedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  byId: t.procedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findFirst({ where: { id: input } });
  }),
  findOrCreate: t.procedure
    .input(
      z.object({
        id: z.string(),
        displayName: z.string().optional(),
        email: z.string().email(),
        emailVerified: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({ where: { id: input.id } });
      if (user) return user;
      return ctx.prisma.user.create({ data: input });
    }),
});

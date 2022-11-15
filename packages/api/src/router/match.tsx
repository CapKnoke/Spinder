import { t } from '../trpc';
import { z } from 'zod';

export const matchRouter = t.router({
  setSeen: t.procedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.match.update({
      where: { id: input },
      data: { seen: true },
    });
  }),
});

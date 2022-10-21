import { t } from '../trpc';
import { TRPCError } from '@trpc/server';

export const spotifyRouter = t.router({
  getCredentials: t.procedure.query(() => {
    if (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) {
      const clientId = process.env.SPOTIFY_CLIENT_ID;
      const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
      return { clientId, clientSecret };
    }
    throw new TRPCError({
      message: 'ENV vars not found',
      code: 'NOT_FOUND',
    });
  }),
});

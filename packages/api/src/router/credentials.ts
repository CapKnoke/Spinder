import { t } from '../trpc';
import { TRPCError } from '@trpc/server';

export const credentialsRouter = t.router({
  getSpotifyCredentials: t.procedure.query(() => {
    if (process.env.SPOTIFY_CLIENT_ID) {
      const clientId = process.env.SPOTIFY_CLIENT_ID;
      return { clientId };
    }
    throw new TRPCError({
      message: 'ENV vars not found',
      code: 'NOT_FOUND',
    });
  }),
});

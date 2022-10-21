import { t } from '../trpc';

import { postRouter } from './post';
import { spotifyRouter } from './spotify';

export const appRouter = t.router({
  post: postRouter,
  spotify: spotifyRouter,
});

export type AppRouter = typeof appRouter;

import { t } from '../trpc';

import { postRouter } from './post';
import { credentialsRouter } from './credentials';
import { userRouter } from './user';
import { matchRouter } from './match';

export const appRouter = t.router({
  post: postRouter,
  user: userRouter,
  credentials: credentialsRouter,
  match: matchRouter,
});

export type AppRouter = typeof appRouter;

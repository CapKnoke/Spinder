import { t } from '../trpc';

import { postRouter } from './post';
import { credentialsRouter } from './credentials';
import { userRouter } from './user';

export const appRouter = t.router({
  post: postRouter,
  user: userRouter,
  credentials: credentialsRouter,
});

export type AppRouter = typeof appRouter;

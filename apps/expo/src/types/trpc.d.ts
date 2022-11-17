import { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import { AppRouter } from '@acme/api';

type UserCreateInput = inferProcedureInput<AppRouter['user']['updateOrCreate']>;
type NewMatch = inferProcedureOutput<AppRouter['user']['newMatches']>[0];
type MatchListItem = inferProcedureOutput<AppRouter['user']['matches']>[0];

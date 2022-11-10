import { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import { AppRouter } from '@acme/api';

type UserCreateInput = inferProcedureInput<AppRouter['user']['updateOrCreate']>;
type User = inferProcedureOutput<AppRouter['user']['all']>[0];

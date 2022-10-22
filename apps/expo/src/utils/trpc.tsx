import { createTRPCReact } from '@trpc/react';
import type { AppRouter } from '@acme/api';
/**
 * A set of typesafe hooks for consuming your API.
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { transformer } from '@acme/api/transformer';
import Constants from 'expo-constants';

export const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const localhost =
    `http://${Constants.manifest?.hostUri?.replace(/:\d+$/, ':3000')}` ?? 'http://localhost:3000';
  const apiBaseUrl = Constants.manifest?.extra?.apiBaseUrl ?? localhost;
  const [queryClient] = React.useState(() => new QueryClient());
  const [trpcClient] = React.useState(() =>
    trpc.createClient({
      transformer,
      links: [
        httpBatchLink({
          url: `${apiBaseUrl}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

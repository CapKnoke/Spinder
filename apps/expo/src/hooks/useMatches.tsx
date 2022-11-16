import { Match } from '.prisma/client';
import * as React from 'react';
import { Match as FirestoreMatch } from '../types/firestore';
import { trpc } from '../utils/trpc';
import useAuth from './useAuth';

interface IMatchContext {
  matches: FirestoreMatch[];
  newMatches: FirestoreMatch[];
}

const MatchContext = React.createContext<IMatchContext>({} as IMatchContext);

export const MatchProvider: React.FC<{ children: React.ReactNode[] | React.ReactNode }> = ({
  children,
}) => {
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [newMatches, setNewMatches] = React.useState<FirestoreMatch[]>([]);

  const { user } = useAuth();
  trpc.user.matches.useQuery(user?.id, {
    enabled: !!user,
    onSuccess(data) {
      setMatches(data);
    },
  });
  return <></>;
};

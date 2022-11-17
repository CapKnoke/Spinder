import { onSnapshot, query, Timestamp, where } from 'firebase/firestore';
import * as React from 'react';

import db from '../lib/firebase';
import useAuth from './useAuth';

import type { ChatMessage, FirestoreMatch, FirestoreUser } from '../types/firestore';

export type Match = {
  id: string;
  matchedUser: FirestoreUser;
  seenByIds: string[];
  lastMessage?: ChatMessage | undefined;
  createdAt: Timestamp;
};

interface IMatchContext {
  matches: Match[] | null;
  newMatches: Match[];
}

const MatchContext = React.createContext<IMatchContext>({} as IMatchContext);

export const MatchProvider: React.FC<{ children: React.ReactNode[] | React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [matches, setMatches] = React.useState<Match[] | null>([]);
  const [newMatches, setNewMatches] = React.useState<Match[]>([]);

  React.useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(
      query(db.matches, where('matchedUserIds', 'array-contains', user.id)),
      (snapshot) =>
        setMatches(
          snapshot.docs.map((match) => {
            const matchData = match.data();
            const matchedUserId = matchData.matchedUserIds.find((id) => id !== user.id) as string;
            return {
              id: match.id,
              matchedUser: matchData.matchedUsers[matchedUserId],
              ...matchData,
            };
          })
        )
    );
    return unsubscribe;
  }, [user]);

  React.useEffect(() => {
    if (!user || !matches) return;
    const newMatches = matches.flatMap((match) => {
      if (match.seenByIds.includes(user.id)) {
        return [];
      }
      return match;
    });
    setNewMatches(newMatches);
  }, [matches]);

  const memoedValue = React.useMemo(
    () => ({
      matches,
      newMatches,
    }),
    [matches, newMatches]
  );

  return <MatchContext.Provider value={memoedValue}>{children}</MatchContext.Provider>;
};

export default function useMatches() {
  return React.useContext(MatchContext);
}

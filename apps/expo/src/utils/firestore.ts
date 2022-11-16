import { setDoc, getDocs, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { createCol, createDoc } from '../lib/firebase';

import { generateMatchId, MatchIdInput } from '@acme/api/src/utils/firestore';

import type { ChatMessage, Match } from '../types/firestore';
import type { MatchListItem } from '../types/trpc';

export const getUserMatches = async (userId: string) => {
  const chatList = await getDocs<Match>(createCol('users', userId, 'matches'));
  return chatList.docs.map((userDoc) => userDoc.data());
};

export const updateUserMatches = async (userId: string, matches: MatchListItem[]) => {
  const updates = matches.map(({ matchedUsers }) => {
    const matchedUser = matchedUsers.find(({ id }) => id !== userId);
    if (!matchedUser) return;
    return setDoc<Match>(
      createDoc(
        'users',
        userId,
        'matches',
        generateMatchId({ userId, targetUserId: matchedUsers[0].id })
      ),
      {
        matchedUserIds: [userId, matchedUser.id],
        createdAt: serverTimestamp(),
      },
      {
        merge: true,
      }
    );
  });
  await Promise.all(updates);
};

export const getMessages = async ({ userId, targetUserId }: MatchIdInput) => {
  const messages = await getDocs<ChatMessage>(
    createCol('users', userId, 'matches', generateMatchId({ userId, targetUserId }), 'messages')
  );
  return messages.docs.map((messageDoc) => messageDoc.data());
};

export const sendMessage = async ({ userId, targetUserId }: MatchIdInput, message: string) => {
  addDoc<ChatMessage>(
    createCol('users', userId, 'matches', generateMatchId({ userId, targetUserId }), 'messages'),
    {
      message,
      senderId: userId,
      createdAt: serverTimestamp(),
      seen: false,
    }
  );
};

export const seeMessage = async ({ userId, targetUserId }: MatchIdInput, messageId: string) => {
  updateDoc<ChatMessage>(
    createDoc(
      'users',
      userId,
      'conversations',
      generateMatchId({ userId, targetUserId }),
      messageId
    ),
    {
      seen: true,
      seenAt: Date.now(),
    }
  );
};

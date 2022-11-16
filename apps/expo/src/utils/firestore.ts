import { setDoc, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { createCol, createDoc } from '../lib/firebase';
import { ChatMessage, Conversation, ConversationIdInput } from '../types/firestore';

import type { MatchListItem } from '../types/trpc';

export const getConversationId = ({ userId, targetUserId }: ConversationIdInput) => {
  return `${userId}${targetUserId}`;
};

export const getConversations = async (userId: string) => {
  const chatList = await getDocs<Conversation>(createCol('users', userId, 'conversations'));
  return chatList.docs.map((userDoc) => userDoc.data());
};

export const updateConversations = async (userId: string, matches: MatchListItem[]) => {
  const updates = matches.map(({ matchedUser }) => {
    return setDoc<Conversation>(
      createDoc(
        'users',
        userId,
        'conversations',
        getConversationId({ userId, targetUserId: matchedUser.id })
      ),
      {
        name: matchedUser.displayName,
      }
    );
  });
  await Promise.all(updates);
};

export const getMessages = async ({ userId, targetUserId }: ConversationIdInput) => {
  const messages = await getDocs<ChatMessage>(
    createCol(
      'users',
      userId,
      'conversations',
      getConversationId({ userId, targetUserId }),
      'messages'
    )
  );
  return messages.docs.map((messageDoc) => messageDoc.data());
};

export const sendMessage = async (
  { userId, targetUserId }: ConversationIdInput,
  message: string
) => {
  addDoc<ChatMessage>(
    createCol(
      'users',
      userId,
      'conversations',
      getConversationId({ userId, targetUserId }),
      'messages'
    ),
    {
      message,
      createdAt: Date.now(),
      seen: false,
    }
  );
};

export const seeMessage = async (
  { userId, targetUserId }: ConversationIdInput,
  messageId: string
) => {
  updateDoc<ChatMessage>(
    createDoc(
      'users',
      userId,
      'conversations',
      getConversationId({ userId, targetUserId }),
      messageId
    ),
    {
      seen: true,
      seenAt: Date.now(),
    }
  );
};

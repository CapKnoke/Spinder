import {
  getDocs,
  addDoc,
  updateDoc,
  getDoc,
  Timestamp,
  query,
  where,
  setDoc,
  arrayUnion,
} from 'firebase/firestore';
import db from '../lib/firebase';

import { User } from '.prisma/client';
import { LikedUser } from '@acme/api/src/types/prisma';
import { FirestoreUser } from '../types/firestore';

export type MatchIdInput = {
  userId: string;
  targetUserId: string;
};

const generateMatchId = ({ userId, targetUserId }: MatchIdInput) => {
  return [userId, targetUserId].sort().join('');
};

const createMatchUser = (user: LikedUser | User): FirestoreUser => {
  return {
    name: user.displayName,
    gender: user.gender,
  };
};

export const getUserMatches = async (userId: string) => {
  const chatList = await getDocs(
    query(db.matches, where('matchedUserIds', 'array-contains', userId))
  );
  return chatList.docs.map((userDoc) => userDoc.data());
};

export const createMatch = async (user: User, targetUser: LikedUser) => {
  const [userDoc, targetUserDoc] = await Promise.all([
    getDoc(db.user(user.id)),
    getDoc(db.user(targetUser.id)),
  ]);
  if (!userDoc.exists()) {
    await setDoc(userDoc.ref, createMatchUser(user));
  }
  if (!targetUserDoc.exists()) {
    await setDoc(targetUserDoc.ref, createMatchUser(targetUser));
  }
  const matchRef = db.match(generateMatchId({ userId: user.id, targetUserId: targetUser.id }));
  const matchedUsers = Object.fromEntries([
    [userDoc.id, createMatchUser(user)],
    [targetUserDoc.id, createMatchUser(targetUser)],
  ]);
  await setDoc(matchRef, {
    matchedUserIds: [user.id, targetUser.id],
    seenByIds: [],
    matchedUsers,
    createdAt: Timestamp.fromDate(new Date()),
  });
  return getDoc(matchRef);
};

export const seeMatch = async (userId: string, matchId: string) => {
  updateDoc(db.match(matchId), {
    seenByIds: arrayUnion(userId),
  });
};

export const getMessages = async (input: MatchIdInput) => {
  const messages = await getDocs(db.messages(generateMatchId(input)));
  return messages.docs.map((messageDoc) => messageDoc.data());
};

export const sendMessage = async ({ userId, targetUserId }: MatchIdInput, message: string) => {
  const sender = await getDoc(db.user(userId));
  const matchId = generateMatchId({ userId, targetUserId });
  if (!sender.exists()) return;
  const sentMessageRef = await addDoc(db.messages(matchId), {
    message,
    senderId: userId,
    createdAt: Timestamp.fromDate(new Date()),
    seen: false,
    seenAt: null,
  });
  const sentMessage = await getDoc(sentMessageRef).then((doc) => doc.data());
  await updateDoc(db.match(matchId), {
    lastMessage: sentMessage,
  });
};

export const seeMessage = async (input: MatchIdInput, messageId: string) => {
  updateDoc(db.message(generateMatchId(input), messageId), {
    seen: true,
    seenAt: Timestamp.fromDate(new Date()),
  });
};

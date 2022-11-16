import { Prisma, User } from '@acme/db';
import db from '../lib/firebase';
import { likeUser } from '../router/utils/prisma';
import { MatchUser } from '../types/firestore';

export type MatchIdInput = {
  userId: string;
  targetUserId: string;
};

export const generateMatchId = ({ userId, targetUserId }: MatchIdInput) => {
  return [userId, targetUserId].sort().join('');
};

type LikedUser = Prisma.PromiseReturnType<typeof likeUser>;

const createMatchUser = (user: LikedUser): MatchUser => {
  return {
    name: user.displayName,
    gender: user.gender,
  };
};

export const createMatch = async (user: LikedUser, targetUser: LikedUser) => {
  const userRef = db.users.doc(user.id);
  const targetUserRef = db.users.doc(targetUser.id);
  const [userDoc, targetUserDoc] = await Promise.all([userRef.get(), targetUserRef.get()]);
  if (!userDoc.exists) {
    await userRef.set(createMatchUser(user));
  }
  if (!targetUserDoc.exists) {
    await targetUserRef.set(createMatchUser(targetUser));
  }
  await db.matches.doc(generateMatchId({ userId: user.id, targetUserId: targetUser.id })).set({
    matchedUserIds: [user.id, targetUser.id],
    matchedUsers: [userRef, targetUserRef],
    seenByIds: [],
    createdAt: FirebaseFirestore.Timestamp.fromDate(new Date()),
  });
};

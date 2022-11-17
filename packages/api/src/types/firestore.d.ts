export type MatchUser = {
  name: string;
  gender: string;
};

export type Match = {
  matchedUserIds: string[];
  matchedUsers: FirebaseFirestore.DocumentReference<MatchUser>[];
  seenByIds: string[];
  lastMessage?: ChatMessage;
  createdAt: FirebaseFirestore.Timestamp;
};

export type ChatMessage = {
  senderId: string;
  sender: FirebaseFirestore.DocumentReference<MatchUser>;
  message: string;
  seen: boolean;
  seenAt?: FirebaseFirestore.Timestamp;
  createdAt: FirebaseFirestore.Timestamp;
};

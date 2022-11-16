export type Conversation = {
  name: string;
  lastMessage?: ChatMessage;
};

export type ChatMessage = {
  message: string;
  createdAt: number;
  seen: boolean;
  seenAt?: number;
};

export type ConversationIdInput = {
  userId: string;
  targetUserId: string;
};

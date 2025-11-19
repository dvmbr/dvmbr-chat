export type ChatMessage = {
  id: string;
  text: string;
  roomId: string;
  userId: string;
  username: string;
  createdAt: Date;
  isPending?: boolean;
};

import { Prisma } from "@prisma/client";
import { userSummaryDTOSelect } from "./user.mapper";
import { MessageSchema, type MessageDTO } from "@/lib/schemas/message/schema";

export const messageDTOSelect = {
  id: true,
  participantId: true,
  participant: {
    select: {
      user: {
        select: userSummaryDTOSelect,
      },
    },
  },
  roomId: true,
  content: true,
  type: true,
  isDeleted: true,
  isEdited: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.MessageSelect;

export type MessageDTOData = Prisma.MessageGetPayload<{
  select: typeof messageDTOSelect;
}>;

export function toMessageDTO(data: MessageDTOData): MessageDTO {
  return MessageSchema.parse({
    ...data,
    sender: {
      id: data.participant.user.id,
      nickname: data.participant.user.nickname,
    },
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  });
}

export function toMessageListDTO(data: MessageDTOData[]): MessageDTO[] {
  return data.map(toMessageDTO);
}

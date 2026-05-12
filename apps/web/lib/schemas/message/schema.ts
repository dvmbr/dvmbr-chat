import { MessageCreatedPayloadSchema } from "@dvmbr/shared/socket/payloads/message";
import { z } from "../../zod";

export const MessageSchema = MessageCreatedPayloadSchema.openapi("Message");

export type MessageDTO = z.infer<typeof MessageSchema>;

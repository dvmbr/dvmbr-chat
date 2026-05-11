import { z } from "../../zod";
import { MessageCreatedPayloadSchema } from "@dvmbr/shared/socket/socket-payloads";

export const MessageSchema = MessageCreatedPayloadSchema.openapi("Message");

export type MessageDTO = z.infer<typeof MessageSchema>;

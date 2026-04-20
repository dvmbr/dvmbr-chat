import { z } from "../openapi/zod";
import type { Participant } from "@prisma/client";

export const ParticipantSchema = z
  .object({
    id: z.number(),
    userId: z.number(),
    roomId: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("Participant");

export const CreateParticipantSchema = z
  .object({
    userId: z.number(),
    roomId: z.number(),
  })
  .openapi("CreateParticipant");

export const ParticipantQuerySchema = z
  .object({
    id: z.coerce.number().optional(),
    userId: z.coerce.number().optional(),
    roomId: z.coerce.number().optional(),
  })
  .openapi("ParticipantQuery");

export type ParticipantDTO = z.infer<typeof ParticipantSchema>;
export type CreateParticipantDTO = z.infer<typeof CreateParticipantSchema>;
export type ParticipantQueryDTO = z.infer<typeof ParticipantQuerySchema>;

export function toParticipantDto(participant: Participant): ParticipantDTO {
  return {
    ...participant,
    createdAt: new Date(participant.createdAt).toISOString(),
    updatedAt: new Date(participant.updatedAt).toISOString(),
  };
}

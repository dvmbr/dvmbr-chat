import { z } from "../openapi/zod";
import type { Participant } from "@prisma/client";

export const ParticipantSchema = z
  .object({
    id: z.coerce.number().int().positive(),
    userId: z.coerce.number().int().positive(),
    roomId: z.coerce.number().int().positive(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("Participant");

export const CreateParticipantSchema = z
  .object({
    userId: z.coerce.number().int().positive(),
    roomId: z.coerce.number().int().positive(),
  })
  .openapi("CreateParticipant");

export const ParticipantQuerySchema = z
  .object({
    id: z.coerce.number().int().positive().optional(),
    userId: z.coerce.number().int().positive().optional(),
    roomId: z.coerce.number().int().positive().optional(),
  })
  .openapi("ParticipantQuery");

export type ParticipantDto = z.infer<typeof ParticipantSchema>;
export type CreateParticipantDto = z.infer<typeof CreateParticipantSchema>;
export type ParticipantQueryDto = z.infer<typeof ParticipantQuerySchema>;

export function toParticipantDto(participant: Participant): ParticipantDto {
  return {
    ...participant,
    createdAt: participant.createdAt.toISOString(),
    updatedAt: participant.updatedAt.toISOString(),
  };
}

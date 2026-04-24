import { Participant } from "@prisma/client";
import { z } from "../openapi/zod";

export const ParticipantSchema = z
  .object({
    id: z.number(),
    userId: z.number().int().positive(),
    roomId: z.number().int().positive(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("Participant");

export const ParticipantCreateBodySchema = z
  .object({
    userId: z.coerce.number().int().positive(),
    roomId: z.coerce.number().int().positive(),
  })
  .openapi("ParticipantCreateBody");

export const ParticipantParamSchema = z.object({
  participantId: z.coerce.number().int().positive(),
});

export const ParticipantQuerySchema = z

  .object({
    id: z.coerce.number().int().positive().optional(),
    userId: z.coerce.number().int().positive().optional(),
    roomId: z.coerce.number().int().positive().optional(),
  })

  .openapi("ParticipantQuery");

export type ParticipantDTO = z.infer<typeof ParticipantSchema>;
export type ParticipantCreateBodyDTO = z.infer<
  typeof ParticipantCreateBodySchema
>;
export type ParticipantParamDTO = z.infer<typeof ParticipantParamSchema>;
export type ParticipantQueryDTO = z.infer<typeof ParticipantQuerySchema>;

export function toParticipantDTO(participant: Participant): ParticipantDTO {
  return ParticipantSchema.parse({
    id: participant.id,
    userId: participant.userId,
    roomId: participant.roomId,
    createdAt: participant.createdAt.toISOString(),
    updatedAt: participant.updatedAt.toISOString(),
  });
}

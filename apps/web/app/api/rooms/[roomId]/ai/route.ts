import prisma from "@/lib/server/db";
import { getUserFromRequest } from "@/lib/server/auth/getUserFromRequest";
import {
  badRequest,
  internalServerError,
  unauthorized,
} from "@/lib/server/http/error-response";
import { sendOk } from "@/lib/server/http/response";
import { NextRequest } from "next/server";
import { toMessageDTO, messageDTOSelect } from "@/lib/mappers/message.mapper";
import { MessageParamsSchema } from "@/lib/schemas/message/request";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/rooms/[roomId]/ai">,
) {
  try {
    const user = await getUserFromRequest(req);

    const p = await params;
    const parsedParams = MessageParamsSchema.safeParse({ roomId: p.roomId });
    if (!parsedParams.success) {
      return badRequest({ message: "roomId must be a positive integer" });
    }

    const userId = user.id;
    const roomId = parsedParams.data.roomId;

    const participant = await prisma.participant.findUnique({
      where: { userId_roomId: { userId, roomId } },
    });
    if (!participant) {
      return unauthorized({ message: "Not a participant" });
    }

    const body = await req.json();
    const userMessage: string = body.message;
    if (!userMessage?.trim()) {
      return badRequest({ message: "message is required" });
    }

    // AI 봇 유저 없으면 생성
    let aiBot = await prisma.user.findFirst({ where: { isAiBot: true } });
    if (!aiBot) {
      aiBot = await prisma.user.create({
        data: {
          nickname: "AI",
          browserToken: "system-ai-bot",
          isAiBot: true,
        },
      });
    }

    // Create AI BOT participant if not exists
    let aiParticipant = await prisma.participant.findUnique({
      where: { userId_roomId: { userId: aiBot.id, roomId } },
    });
    if (!aiParticipant) {
      aiParticipant = await prisma.participant.create({
        data: { userId: aiBot.id, roomId },
      });
    }

    // Fetch the last 20 messages as context
    const recentMessages = await prisma.message.findMany({
      where: { roomId, isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        participant: {
          include: { user: { select: { nickname: true, isAiBot: true } } },
        },
      },
    });
    recentMessages.reverse();

    const history: OpenAI.Chat.ChatCompletionMessageParam[] =
      recentMessages.map((m) => ({
        role: m.participant.user.isAiBot
          ? ("assistant" as const)
          : ("user" as const),
        content: `${m.participant.user.nickname}: ${m.content}`,
      }));

    const completion = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content:
            "You are a friendly chat assistant participating in a group chat room. Keep responses concise and conversational. Respond in the same language as the user.",
        },
        ...history,
        { role: "user", content: userMessage },
      ],
    });

    const aiText = completion.choices[0]?.message?.content ?? "...";

    // Save AI message to DB
    const aiMessage = await prisma.message.create({
      data: {
        participantId: aiParticipant.id,
        roomId,
        content: aiText,
        type: "AI",
      },
      select: messageDTOSelect,
    });

    return sendOk(toMessageDTO(aiMessage));
  } catch (error) {
    return internalServerError(error);
  }
}

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
import { randomUUID } from "crypto";

const openai = new OpenAI({
  baseURL: process.env.AI_BASE_URL!,
  apiKey: process.env.AI_API_KEY!,
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
    const isGreeting: boolean = body.greeting === true;
    const isFarewell: boolean = body.farewell === true;
    const userMessage: string = body.message;
    if (!isGreeting && !isFarewell && !userMessage?.trim()) {
      return badRequest({ message: "message is required" });
    }

    // AI 봇 유저 없으면 생성
    let aiBot = await prisma.user.findFirst({ where: { isAiBot: true } });
    if (!aiBot) {
      aiBot = await prisma.user.create({
        data: {
          nickname: "AI",
          browserToken: randomUUID(),
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

    let prompt: string;
    let history: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    if (isGreeting || isFarewell) {
      const participants = await prisma.participant.findMany({
        where: { roomId, user: { isAiBot: false } },
        include: { user: { select: { nickname: true } } },
      });
      const participantList = participants
        .map((p, i) => `${i + 1}. ${p.user.nickname}`)
        .join("\n");

      if (isGreeting) {
        prompt = `다음은 채팅방 참여자 목록입니다:\n${participantList}\n\n각 참여자의 닉네임을 한 명씩 불러주며 인사해주세요.`;
      } else {
        prompt = `다음은 채팅방 참여자 목록입니다:\n${participantList}\n\n각 참여자의 닉네임을 한 명씩 언급하며 AI 기능이 꺼졌다고 짧게 알려주세요.`;
      }
    } else {
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

      history = recentMessages.map((m) => ({
        role: m.participant.user.isAiBot
          ? ("assistant" as const)
          : ("user" as const),
        content: `${m.participant.user.nickname}: ${m.content}`,
      }));
      prompt = userMessage;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const completion = await (openai.chat.completions.create as any)({
      model: process.env.AI_MODEL!,
      think: false,
      messages: [
        {
          role: "system",
          content:
            "You are a friendly assistant in a group chat. Keep responses short and conversational. Respond in Korean.",
        },
        ...history,
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "...";
    const aiText = raw.replace(/<think>[\s\S]*?<\/think>/g, "").trim() || "...";

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

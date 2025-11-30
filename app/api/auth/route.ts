import {NextRequest} from "next/server";
import {createSession} from "@/lib/auth";
import {getUserByName, createUserByName} from "@/lib/user";
import {apiCreated, apiError} from "@/lib/apiResponse";

// POST /api/auth
// Body: { name: string }
export async function POST(req: NextRequest) {
  // 1) Body 파싱
  let body;

  try {
    body = await req.json();
  } catch (e) {
    console.error("Invalid JSON body", e);
    return apiError("Invalid JSON body", 400);
  }

  const rawName = body?.name;

  // 2) 입력 검증
  try {
    if (!rawName || typeof rawName !== "string") {
      return apiError("Invalid name", 400);
    }

    const trimmed = rawName.trim();
    if (!trimmed) return apiError("name cannot be empty", 400);

    const nicknameRegex = /^[a-zA-Z0-9가-힣_-]+$/;
    if (!nicknameRegex.test(trimmed)) {
      return apiError(
        "Allowed characters: Korean, English letters, numbers, -, _",
        400
      );
    }
  } catch (e) {
    console.error("Validation error", e);
    return apiError("Invalid name format", 400);
  }

  // 3) 유저 조회 + 생성
  let user;
  try {
    const trimmed = rawName.trim();
    user = await getUserByName(trimmed);

    if (user) {
      return apiError("existing name", 400);
    }

    user = await createUserByName(trimmed);
  } catch (e) {
    console.error("POST /api/auth error:", e);
    return apiError("Failed to create user", 500);
  }

  // 4) 세션 생성
  try {
    await createSession({id: user.id, name: user.name});
  } catch (e) {
    console.error("Session creation error", e);
    return apiError("Failed to create session", 500);
  }

  // 5) 성공 응답
  return apiCreated("Authentication successful", {
    id: user.id,
    name: user.name,
  });
}

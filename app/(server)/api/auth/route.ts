import { NextRequest } from "next/server";
import { createSession } from "../../lib/auth/authService";
import { getUserByName, createUserByName } from "../../lib/user/userService";
import { apiLogger } from "../api.utils";
import serverApiResponse from "../serverApiResponse";

export type AuthPayload = {
  userName: string;
};

export type AuthResponseData = {
  id: string;
  name: string;
};

// POST /api/auth
// Body: { userName: string }
export async function POST(req: NextRequest) {
  const log = apiLogger("POST", "/api/auth");

  // 1) Body 파싱
  let body: AuthPayload;

  try {
    body = await req.json();
  } catch (e) {
    log("error", "Invalid JSON body", e);
    return serverApiResponse(400, "Invalid JSON body", {});
  }

  // 2) 입력 검증
  if (!body.userName) {
    log("error", "Invalid name");
    return serverApiResponse(400, "Invalid name", {});
  }

  const trimmed = body.userName.trim();

  if (!trimmed) {
    log("error", "Name cannot be empty");
    return serverApiResponse(400, "Name cannot be empty", {});
  }

  if (trimmed.length < 2 || trimmed.length > 20) {
    log("error", "Name must be between 2 and 20 characters");
    return serverApiResponse(
      400,
      "Name must be between 2 and 20 characters",
      {}
    );
  }

  const nicknameRegex = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ_-]+$/;
  if (!nicknameRegex.test(trimmed)) {
    log("error", "Allowed characters: Korean, English, numbers, '-', '_'");
    return serverApiResponse(
      400,
      "Allowed characters: Korean, English, numbers, '-', '_'",
      {}
    );
  }

  // 3) 유저 조회 + 생성
  let user;
  try {
    user = await getUserByName(trimmed);
    if (user) {
      log("error", "Name already exists");
      return serverApiResponse(400, "Name already exists", {});
    }

    user = await createUserByName(trimmed);
  } catch (e) {
    log("error", "Failed to create user", e);
    return serverApiResponse(500, "Failed to create user", {});
  }

  // 4) 세션 생성
  try {
    await createSession({ id: user.id, name: user.name });
  } catch (e) {
    log("error", "Failed to create session", e);
    return serverApiResponse(500, "Failed to create session", e);
  }

  // 5) 성공 응답
  const sessionData: AuthResponseData = {
    id: user.id,
    name: user.name,
  };

  log("info", "Authentication successful", sessionData);
  return serverApiResponse(201, "Authentication successful", sessionData);
}

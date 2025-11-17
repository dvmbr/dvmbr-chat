# dvmbr Chat

dvmbr Chat은 Next.js 15, PostgreSQL(Neon), WebSocket을 기반으로 만든 실시간 채팅 서비스입니다.  
포트폴리오 목적에 맞게 실제 서비스와 유사한 구조를 유지하면서도, 빠른 개발과 무료 배포 환경을 목표로 합니다.

---

## Tech Stack

### Frontend / Full Stack

- Next.js 15
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js Route Handlers (`/app/api/*`)
- Node.js WebSocket 서버 (`ws` 또는 Socket.IO)

### Database & ORM

- PostgreSQL (Neon Free Tier)
- Prisma ORM

### Deployment

- Vercel (Next.js + API Routes)
- Railway (WebSocket 서버)
- Neon (PostgreSQL)
- Upstash Redis (선택 사항)

---

## Features (MVP)

### Authentication

- 닉네임 기반 로그인
- HTTP-only 쿠키 기반 세션
- `/login` 페이지에서 유저 이름 입력 → DB 생성/조회 → 세션 발급
- 인증이 필요한 모든 경로는 middleware 기반 보호

### Chat Rooms

- 채팅방 생성
- 채팅방 리스트 조회
- 채팅방 입장
- 각 방별로 마지막 메시지 및 시간 표시
- lastActive 기반 NEW 표시

### Real-Time Messaging

- WebSocket 기반 실시간 메시지 송수신
- 메시지 생성 시 PostgreSQL에 영구 저장
- 클라이언트 Optimistic UI 처리
- 메시지 생성, 방 참여/이탈 정보 broadcast

### Message List UX

- 새로운 메시지 도착 시 자동 스크롤
- 같은 사용자가 같은 분 안에 보낸 연속 메시지는 compact 형태로 렌더링
- 시간 및 유저명 표시는 조건부로 축약

### LocalStorage Tracking

- 각 방마다 마지막 방문 시간(lastActive) 저장
- 마지막 메시지 시간이 lastActive보다 최신이고, 보낸 사람이 내가 아닐 경우 NEW 표시

### Error Handling

- API 오류 처리
- WebSocket 재연결 로직
- 간단한 Fallback UI 제공

---

## Architecture Overview

### Frontend (Next.js)

- App Router 기반 구조
- 서버 컴포넌트 + 클라이언트 컴포넌트 혼합
- 주요 페이지
  - `/login` — 로그인
  - `/chat` — 채팅방 목록
  - `/chat/[roomId]` — 채팅방 화면

### Backend (Rest API via Route Handlers)

- POST `/api/auth` — 로그인
- GET `/api/me` — 현재 로그인 유저 확인
- GET `/api/rooms` — 방 리스트
- POST `/api/rooms` — 방 생성
- GET `/api/rooms/[roomId]` — 방 상세
- GET `/api/rooms/[roomId]/messages` — 메시지 조회

### Backend (WebSocket)

- Railway Node.js 서버
- ws 또는 socket.io 기반
- 메시지 프로토콜 예시:

```ts
type ClientMessage =
  | {type: "joinRoom"; roomId: string}
  | {type: "leaveRoom"; roomId: string}
  | {type: "newMessage"; roomId: string; content: string}
  | {type: "ping"};

type ServerMessage =
  | {type: "joinedRoom"; roomId: string}
  | {type: "leftRoom"; roomId: string}
  | {type: "messageCreated"; message: ChatMessagePayload}
  | {type: "error"; message: string}
  | {type: "pong"};

type ChatMessagePayload = {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
};
```

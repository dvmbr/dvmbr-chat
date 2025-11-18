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

---

## Database / Prisma 설정

이 프로젝트는 Neon에서 호스팅되는 PostgreSQL과 Prisma ORM을 사용합니다.  
전체 흐름은 다음과 같습니다.

1. Neon에서 PostgreSQL 인스턴스를 생성합니다.
2. Neon 대시보드에서 제공하는 Connection string을 `.env`의 `DATABASE_URL`에 설정합니다.
3. `prisma/schema.prisma`에 데이터 모델(User, Room, Message 등)을 정의합니다.
4. `npx prisma migrate dev`로 실제 DB에 테이블을 생성합니다.
5. 애플리케이션 코드에서는 `PrismaClient`를 통해 DB에 접근합니다.

### 1. Neon PostgreSQL 연결

Neon 프로젝트 생성 후, 대시보드에서 Connection string을 복사해 `.env`에 설정합니다.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
```

---

## Features (MVP)

### Authentication

- 닉네임 기반 로그인 후 HTTP-only 쿠키(`chat_session`) 저장
- 서버 컴포넌트 및 API 라우트에서 쿠키 기반 현재 사용자 조회
- (예정) 특정 페이지 보호를 위해 middleware.ts 추가 예정

### Chat Rooms

- 채팅방 생성
- 채팅방 리스트 조회
- 채팅방 입장 (클릭 시 `/chat/[roomId]`)

### Real-Time Messaging

- WebSocket 기반 실시간 메시지 송수신
- 메시지 생성 시 PostgreSQL에 영구 저장
- 클라이언트 Optimistic UI 처리
- 메시지 생성, 방 참여/이탈 정보 broadcast

### Message List UX

- 메시지 목록 표시 (최신 메시지 SSR + WebSocket 실시간 추가)
- (예정) 자동 스크롤
- (예정) 연속 메시지 compact 렌더링

### LocalStorage Tracking

- (예정) 방별 lastActive 관리
- (예정) NEW 배지 표시

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

- POST `/api/auth` — 로그인 처리 및 세션 쿠키 발급
- GET `/api/rooms` — 채팅방 목록 조회
- POST `/api/rooms` — 새로운 방 생성
- POST `/api/messages` — 메시지 생성 (DB 저장)

### Backend (WebSocket)

실시간 메시징은 별도의 Node.js WebSocket 서버(`ws` 라이브러리)에서 처리합니다.  
클라이언트는 방에 입장하면 WebSocket에 연결하여 실시간으로 메시지를 주고받습니다.

### WebSocket Protocol

- 클라이언트가 WebSocket에 연결되면 `{type: "join"}` 메시지를 먼저 전송합니다.
- 서버는 join 정보를 저장하여 해당 roomId에 연결된 소켓을 관리합니다.
- 클라이언트가 메시지를 보내면:
  1. HTTP `/api/messages` 요청으로 PostgreSQL에 저장되고
  2. WebSocket을 통해 같은 방의 다른 클라이언트에게 실시간 전파됩니다.
- 서버는 메시지 ID를 생성하지 않으므로, 클라이언트는 임시 ID(`ws-${Date.now()}`)를 생성할 수 있습니다.

#### Client -> Server

클라이언트가 WebSocket을 통해 서버로 전송하는 메시지 타입입니다.

```ts
type ClientMessage =
  | {
      type: "join";
      roomId: string;
      userId: string;
      username: string;
    }
  | {
      type: "leave";
    }
  | {
      type: "message";
      roomId: string;
      text: string;
      userId: string;
      username: string;
    };
```

```json
{ "type": "join", "roomId": "abc123", "userId": "u1", "username": "dvmbr" }

{ "type": "message", "roomId": "abc123", "text": "Hello", "userId": "u1", "username": "dvmbr" }

{ "type": "leave" }
```

#### Server -> Client

서버가 같은 방(roomId)에 있는 다른 클라이언트들에게 브로드캐스트하는 메시지 타입입니다.

```ts
type ServerMessage = {
  type: "message";
  roomId: string;
  text: string;
  userId: string;
  username: string | null;
  createdAt: string;
  id?: string;
};
```

```json
{
  "type": "message",
  "roomId": "abc123",
  "text": "Hello",
  "userId": "u2",
  "username": "november",
  "createdAt": "2025-11-18T00:00:00.000Z",
  "id": "cmi472m740001mqnizdioztp3"
}
```

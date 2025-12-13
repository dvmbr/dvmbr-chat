# dvmbr Chat (MVP project)

dvmbr Chat은 Next.js 16, PostgreSQL(Neon), WebSocket을 기반으로 만든 실시간 채팅 서비스입니다.  
포트폴리오 목적에 맞게 실제 서비스와 유사한 구조를 유지하면서도, 빠른 개발과 무료 배포 환경을 목표로 합니다.

---

## Getting Started

### 1. 의존성 설치

```bash
npm install
```

### 2. Database / Prisma 설정

이 프로젝트는 Neon에서 호스팅되는 PostgreSQL과 Prisma ORM을 사용합니다.  
전체 흐름은 다음과 같습니다.

1. Neon에서 PostgreSQL 인스턴스를 생성합니다.
2. Neon 대시보드에서 제공하는 Connection string을 `.env`의 `DATABASE_URL`에 설정합니다.
3. `prisma/schema.prisma`에 데이터 모델(User, Room, Message 등)을 정의합니다.
4. `npx prisma migrate dev`로 실제 DB에 테이블을 생성합니다.
5. 애플리케이션 코드에서는 `PrismaClient`를 통해 DB에 접근합니다.

#### Neon PostgreSQL 연결

Neon 회원가입/로그인 후 프로젝트 생성하여, 해당 대시보드에서 Connection string을 복사해 `.env`에 설정합니다.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
```

### 3. Prisma 마이그레이션 적용

```bash
npx prisma migrate dev
```

### 4. 개발 서버 실행

```env
SESSION_COOKIE_NAME=chat_session
```

```bash
npm run dev
```

### 5. WebSocket 서버 (로컬 실행)

이 프로젝트는 HTTP API(Next.js)와 별도의 Node.js WebSocket 서버를 사용합니다.

로컬에서 WebSocket 서버를 실행하려면:

```env
WS_PORT=4000
```

```bash
npm run ws
```

---

## Folder Structure

```txt
/app
  /api
    /auth           # POST - 로그인 및 세션 생성
    /logout         # POST - 로그아웃(세션 쿠키 제거)
    /room           # POST - 방 생성
    /message        # POST - 메시지 생성
  /chat
    page.tsx        # 채팅방 목록 페이지 (ssr)
    /[roomId]
      page.tsx      # 특정 채팅방 페이지 (ssr)
    CreateRoomForm.tsx
    LogoutButton.tsx
  /login
    page.tsx        # 로그인 페이지 (csr)
  layout.tsx
  page.tsx          # 홈 페이지 (ssr, 유저는 실제로 “홈 화면”을 보는 일이 없고 상태에 따라 적절한 페이지로 라우팅되도록 설계되어 있습니다.)

/lib
  auth.ts           # 세션 쿠키 기반 인증 / 로그인 상태 검증
  db.ts             # PrismaClient 싱글톤 인스턴스 관리
  message.ts        # 메시지 생성·조회 등 Message 도메인 로직
  room.ts           # 채팅방 생성·조회 등 Room 도메인 로직
  user.ts           # 사용자 생성·조회 등 User 도메인 로직

/prisma
  schema.prisma     # User, Room, RoomMember, Message 모델 정의

/ws-server
  server.ts         # Node.js WebSocket 서버 (Railway 배포 대상)
```

## Environment Variables

이 프로젝트에서 사용하는 주요 환경 변수는 다음과 같습니다.

```env
# PostgreSQL (Neon)
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
```

### Session Cookie

```env
SESSION_COOKIE_NAME=chat_session
```

### WebSocket local server

```env
WS_PORT=4000
```

## Data Model (Prisma)

`prisma/schema.prisma`에는 다음과 같은 핵심 모델이 정의되어 있습니다.

- **User**

  - 닉네임 기반 유저
  - 여러 채팅방에 참여 가능

- **Room**

  - 하나의 채팅방
  - 여러 유저가 참여할 수 있음

- **RoomMember**

  - `User`와 `Room` 사이의 N:M 관계를 표현하는 조인 테이블
  - 유저가 어떤 방에 참여 중인지 관리 (입장/참여)

- **Message**

  - 특정 채팅방의 메시지
  - 작성자(`userId`)와 방(`roomId`)에 속함
  - DB에 영구 저장되어 새로고침 후에도 유지

- **MessageRead**
  - 유저가 특정 메시지를 언제 읽었는지 기록하는 테이블
  - `Message`와 `User` 사이의 N:M 관계
  - 읽음 처리 / unread 카운트 기능을 위한 기반 구조

예시 ERD (논리 구조)

```mermaid
User
  - id (PK)
  - name
  - createdAt
  - rooms         -> RoomMember[]
  - messages      -> Message[]
  - reads         -> MessageRead[]


Room
  - id (PK)
  - name
  - createdAt
  - updatedAt
  - messages      -> Message[]
  - members       -> RoomMember[]


RoomMember (User ↔ Room N:M 조인 테이블)
  - id (PK)
  - userId    (FK -> User.id)
  - roomId    (FK -> Room.id)
  - joinedAt
  - user          -> User
  - room          -> Room (unique: userId + roomId)


Message
  - id (PK)
  - text
  - userId    (FK -> User.id)
  - roomId    (FK -> Room.id)
  - createdAt
  - user          -> User
  - room          -> Room
  - reads         -> MessageRead[]


MessageRead (User ↔ Message N:M 조인 테이블)
  - id (PK)
  - messageId (FK -> Message.id)
  - userId    (FK -> User.id)
  - readAt
  - message       -> Message
  - user          -> User
    (unique: messageId + userId)
```

## Tech Stack

### Frontend (Next.js 16)

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- 서버 컴포넌트 + 클라이언트 컴포넌트 혼합
- 메시지 목록은 SSR로 초기 렌더
- 이후 WebSocket을 통해 실시간 메시지 추가

### Backend — HTTP API (Next.js Route Handlers)

- Next.js Route Handlers (`/app/api/*`)
- 메시지 생성
- 채팅방 생성
- 유저 인증
- SSR에서 초기 메시지 및 채팅방 데이터 로드
- Node.js WebSocket 서버 (`/ws-server/server.ts`)

### Backend - Web Socket Server (Node.js)

- 특정 roomId에 join한 클라이언트 관리
- 메시지 broadcast

### Database & ORM

- PostgreSQL (Neon Free Tier)
- Prisma ORM 6.19

### Deployment

- Vercel (Next.js + API Routes)
- Railway (WebSocket 서버)
- Neon (PostgreSQL)

## Features

### Authentication

- 닉네임 기반 로그인 후 HTTP-only 쿠키(`chat_session`) 저장
- 서버 컴포넌트 및 API 라우트에서 쿠키 기반 현재 사용자 조회
- 특정 페이지 보호를 위해 middleware.ts 사용

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

### Error Handling

- API 오류 처리
- WebSocket 재연결 로직

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
- POST `/api/messages` — 메시지 생성

### Backend (WebSocket)

실시간 메시징은 별도의 Node.js WebSocket 서버(`ws` 라이브러리)에서 처리합니다.  
클라이언트는 방에 입장하면 WebSocket에 연결하여 실시간으로 메시지를 주고받습니다.

### WebSocket Protocol

- 클라이언트가 WebSocket에 연결되면 `{type: "join"}` 메시지를 먼저 전송합니다.
- 서버는 join 정보를 저장하여 해당 roomId에 연결된 소켓을 관리합니다.
- 클라이언트가 메시지를 보내면:
  1. HTTP `/api/messages` 요청으로 PostgreSQL에 저장되고
  2. WebSocket을 통해 같은 방의 다른 클라이언트에게 실시간 전파됩니다.
- 서버는 메시지 ID를 생성하지 않으므로, 클라이언트는 임시 ID(`optimistic-${Date.now()}`)를 생성할 수 있습니다.

#### Client -> Server

클라이언트가 WebSocket을 통해 서버로 전송하는 메시지 타입입니다.

```ts
type ClientMessage =
  | {
      type: "join";
      roomId: string;
      userId: string;
    }
  | {
      type: "message";
      id: string;
      text: string;
      roomId: string;
      userId: string;
      username: string;
      createdAt: Date;
      isPending?: boolean;
    };
```

```json
{ "type": "join", "roomId": "abc123", "userId": "u1", "username": "dvmbr" }

{ "type": "message", "id": "aaa111", "text": "Hello", "roomId": "abc123", "userId": "u1", "username": "dvmbr", "createdAt": "2025-11-19T08:36:12.730Z" }
```

#### Server -> Client

서버가 같은 방(roomId)에 있는 다른 클라이언트들에게 브로드캐스트하는 메시지 타입입니다.

```ts
type ServerMessage = {
  type: "broadcast";
  id: string;
  roomId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: Date;
};
```

```json
{
  "type": "broadcast",
  "id": "cmi472m740001mqnizdioztp3",
  "roomId": "abc123",
  "userId": "u2",
  "username": "november",
  "text": "Hello",
  "createdAt": "2025-11-18T00:00:00.000Z"
}
```

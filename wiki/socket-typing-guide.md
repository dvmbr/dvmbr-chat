# Socket Typing Guide

이 문서는 web + socket-server + shared에서 소켓 타입을 일관되게 유지하기 위한 운영 규칙이다.

## 목표

- 이벤트 이름, payload, query, socket contract를 한 기준으로 관리한다.
- 런타임 검증(zod)과 컴파일 타입(infer DTO)을 동시에 유지한다.
- 파일 추가 시 tsconfig를 추가로 수정하지 않는다.

## 파일 역할

- events: 이벤트 이름 상수
  - packages/shared/src/socket/socket-events.ts
- payloads: 이벤트 payload 스키마 + DTO
  - packages/shared/src/socket/socket-payloads.ts
- query: handshake query 스키마 + DTO
  - packages/shared/src/socket/socket-query.ts
- contract: socket.io 이벤트 시그니처(맵)
  - packages/shared/src/socket/socket-contract.ts
- barrel export
  - packages/shared/src/socket/index.ts

## 핵심 규칙

1. schema와 DTO는 개념적으로 분리하되 같은 파일에 둔다.
2. DTO는 수동 타입 선언 대신 z.infer로만 만든다.
3. contract 파일은 이벤트 시그니처만 작성하고 payload/query 타입을 import해서 사용한다.
4. web/socket-server는 shared contract 타입을 socket.io 제네릭에 연결한다.
5. 입력 데이터(handshake query, inbound payload)는 서버에서 safeParse로 검증한다.

## 신규 이벤트 추가 절차

1. socket-events.ts에 이벤트 이름 추가
2. socket-payloads.ts에 PayloadSchema 추가
3. socket-payloads.ts에 Payload 타입 infer 추가
4. socket-contract.ts의 ServerToClientEvents 또는 ClientToServerEvents에 시그니처 추가
5. 서버 emit/on, 클라이언트 on/emit 사용처에 이벤트 반영
6. 필요 시 서버에서 inbound payload safeParse 추가
7. 타입체크 실행
   - pnpm --filter socket-server exec tsc --noEmit
   - pnpm --filter web exec tsc --noEmit

## 예시 패턴

```ts
// payloads.ts
export const ExamplePayloadSchema = z.object({
  roomId: z.number().int().positive(),
});

export type ExamplePayload = z.infer<typeof ExamplePayloadSchema>;
```

```ts
// contract.ts
export interface ServerToClientEvents {
  "room:example": (payload: ExamplePayload) => void;
}
```

## tsconfig 규칙

각 앱에서 아래 alias 한 줄만 유지한다.

- @dvmbr/shared/_ -> ../../packages/shared/src/_.ts

서브패스별 alias를 추가하지 않는다.

## 흔한 실수

- payload 타입을 schema 없이 수동 선언
- contract 파일에 payload 타입을 직접 중복 작성
- schema를 만들고 infer 타입을 쓰지 않음
- NodeNext에서 shared 내부 상대 import 확장자(.js) 누락

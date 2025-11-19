// 서버가 브로드캐스트하는 채팅 메시지 페이로드
export type WsChatMessagePayload = {
  id: string; // DB에서 생성된 메시지 id (필수)
  roomId: string;
  text: string;
  userId: string;
  username: string;
  createdAt: string;
};

// 클라이언트 -> 서버
export type ClientWSMessage =
  | {
      type: "join";
      roomId: string;
      userId: string;
      username: string;
    }
  | {
      type: "leave";
      roomId: string;
      userId: string;
    }
  | {
      type: "ping";
    };

// 서버 -> 클라이언트
export type ServerWSMessage =
  | ({
      type: "message";
    } & WsChatMessagePayload)
  | {
      type: "error";
      message: string;
    };

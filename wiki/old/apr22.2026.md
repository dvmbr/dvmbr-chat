[Zustand와 URL 충돌로 인한 잘못된 채팅방 렌더링 문제]

[문제 요약]

문제는 링크 이동이 아니라 “렌더 기준”이었다.

사용자는 /rooms/41로 정상 이동했지만,
ChatGate에서 ChatRoom에 전달한 roomId가 URL 값이 아니라
zustand store 값(storedRoomId)이었다.

store에는 이전 값(40)이 남아 있었고,
결과적으로 ChatRoom이 roomId=40 기준으로 렌더되면서
잘못된 방의 메시지를 조회하게 되었다.

즉:

- URL: /rooms/41 (정상)
- 렌더: roomId=40 (잘못됨)

=> URL과 store 상태가 충돌한 문제

[왜 이런 일이 발생했는가]

Next Router는 URL만 변경하고,
zustand store는 자동으로 동기화되지 않는다.

즉:

- router.push("/rooms/41") → URL만 41로 변경됨
- store.roomId는 여전히 이전 값(40) 유지

그리고 ChatGate에서 store 값을 그대로 사용하면
렌더 기준이 잘못된 roomId로 결정된다.

[해결 방법]

렌더 기준 roomId의 우선순위를 명확히 한다.

1. URL roomId가 있으면 그것을 사용
2. 없을 때만 store 값 사용

[핵심 코드]

const resolvedRoomId = roomId ?? storedRoomId;

return (
<ChatRoom
    roomId={resolvedRoomId}
    participantId={participantId}
  />
);

[핵심 원칙]

라우트 파라미터가 있는 페이지에서는
URL 값이 전역 상태(store)보다 우선이다.

zustand는 “기억용 상태”
URL은 “실제 기준 상태 (source of truth)”다.

[한 줄 요약]

링크는 41로 이동했지만,
렌더는 store의 40을 사용해서 잘못된 방을 보고 있었다.

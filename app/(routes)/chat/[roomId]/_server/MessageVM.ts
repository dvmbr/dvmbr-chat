import {MessageDTO} from "@/app/(server)/lib/message/messageDTO";

export type MessageVM = MessageDTO & {isMine?: boolean; isPending?: boolean};

export function toMessageVM(msg: MessageDTO): MessageVM {
  return {...msg, isPending: false};
}

export function toMessageListVM(msg: MessageDTO[]): MessageVM[] {
  return msg.map((m) => ({...m, isPending: false}));
}

import {RoomDTO} from "@/app/(server)/lib/room/roomDTO";

export type RoomVM = RoomDTO & {isSelected?: boolean};

export function toRoomVM(room: RoomDTO): RoomVM {
  return {...room, isSelected: false};
}

export function toRoomListVM(rooms: RoomDTO[]): RoomVM[] {
  return rooms.map((r) => ({...r, isSelected: false}));
}

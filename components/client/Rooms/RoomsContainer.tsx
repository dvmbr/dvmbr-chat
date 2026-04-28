"use client";

import { RoomDTO } from "@/lib/schema/room.schema";
import RoomList from "./RoomList";

type RoomsContainerProps = {
  rooms: RoomDTO[];
};

export default function RoomsContainer({ rooms }: RoomsContainerProps) {
  return (
    <section className="flex h-full min-h-0 flex-col">
      <h2 className="px-4 pt-4">Rooms</h2>
      <div className="min-h-0 flex-1">
        <RoomList rooms={rooms} />
      </div>
    </section>
  );
}

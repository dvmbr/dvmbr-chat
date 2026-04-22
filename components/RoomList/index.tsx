"use client";

import { useEffect, useRef, useState } from "react";
import { CircleAlert, Plus } from "lucide-react";
import { useUserStore } from "@/lib/stores/userStore";
import type { RoomWithCreatorDto } from "@/lib/schema/room.schema";
import { Button } from "../ui/button";
import RoomLink from "./RoomLink";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useCreateRoom } from "@/hooks/useCreateRoom";

type RoomListProps = {
  rooms: RoomWithCreatorDto[];
};

export default function RoomList({ rooms }: RoomListProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [roomName, setRoomName] = useState("");
  const [open, setOpen] = useState(false);

  const userId = useUserStore((state) => state.userId);

  const myRooms = rooms.filter((room) => room.creatorId === userId);
  const otherRooms = rooms.filter((room) => room.creatorId !== userId);

  const createRoomMutation = useCreateRoom({
    onSuccess: () => {
      setOpen(false);
    },
    onSettled: () => {
      setRoomName("");
    },
  });

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, [open]);

  const handleCreateRoom = () => {
    if (!userId || !roomName.trim() || createRoomMutation.isPending) return;

    createRoomMutation.mutate({
      name: roomName.trim(),
    });
  };

  const handleCloseDrawer = () => {
    createRoomMutation.reset();
    setRoomName("");
    setOpen(false);
  };

  const renderCreateTrigger = (item = false) => (
    <DrawerTrigger asChild>
      {item ? (
        <div className="bg-muted/40 flex items-center justify-center gap-2 rounded-lg p-8">
          <Button className="flex" variant="outline">
            <span>Create your first room!</span>
            <Plus />
          </Button>
        </div>
      ) : (
        <Button size="icon-sm" variant="default">
          <Plus />
        </Button>
      )}
    </DrawerTrigger>
  );

  const renderRoomList = (list: RoomWithCreatorDto[], editable = false) => (
    <ul className="mt-2 flex flex-col gap-4">
      {list.map((room) => (
        <li key={room.id}>
          <RoomLink to={`/rooms/${room.id}`} room={room} editable={editable} />
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {createRoomMutation.error && (
        <Alert
          className="fixed inset-1/2 z-999 min-h-fit w-max -translate-1/2"
          variant="destructive"
        >
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {createRoomMutation.error.message}
          </AlertDescription>
        </Alert>
      )}

      <Drawer open={open} onOpenChange={setOpen}>
        <div className="container mx-auto flex h-full max-w-3xl flex-col gap-6 p-4">
          <section className="mt-4">
            <div className="flex flex-wrap items-center justify-between gap-x-8">
              <h2>My Rooms</h2>
              {renderCreateTrigger()}
            </div>

            <p className="mb-2">
              {myRooms.length > 0
                ? "These are your rooms. You can edit or delete them."
                : "You don't have a room yet. Create one to start chatting!"}
            </p>

            {myRooms.length > 0
              ? renderRoomList(myRooms, true)
              : renderCreateTrigger(true)}
          </section>

          <section>
            <h2>Rooms</h2>
            <p>These are the rooms created by other users.</p>

            {otherRooms.length > 0 ? (
              renderRoomList(otherRooms)
            ) : (
              <div className="bg-muted/40 flex items-center justify-center gap-2 rounded-lg p-8">
                There are no rooms created by other users.
              </div>
            )}
          </section>
        </div>

        <DrawerContent>
          <div className="mx-auto mb-4 flex w-full max-w-lg flex-col items-center">
            <DrawerHeader className="mb-2">
              <DrawerTitle>Create a new room</DrawerTitle>
            </DrawerHeader>

            <section className="mb-4 w-full px-4">
              <Input
                ref={inputRef}
                className="text-center text-lg font-semibold"
                placeholder="Room name..."
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    e.nativeEvent.isComposing === false
                  ) {
                    e.preventDefault();
                    handleCreateRoom();
                  }
                }}
              />
            </section>

            <DrawerFooter className="flex w-full flex-row items-center justify-between gap-4">
              <Button
                className="flex-1"
                variant="outline"
                onClick={handleCloseDrawer}
                disabled={createRoomMutation.isPending}
              >
                Cancel
              </Button>

              <Button
                className="flex-1"
                variant="default"
                onClick={handleCreateRoom}
                disabled={createRoomMutation.isPending || !roomName.trim()}
              >
                {createRoomMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

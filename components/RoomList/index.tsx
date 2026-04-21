"use client";

import { useRouter } from "next/navigation";
import { CreateRoomDTO, RoomDTO } from "@/lib/schema/room.schema";
import { useUserStore } from "@/lib/stores/userStore";
import { Button } from "../ui/button";
import RoomLink from "./RoomLink";
import { CircleAlert, Plus } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import { OkResponse } from "@/lib/schema/response.schema";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { apiClient } from "@/lib/apiClient";

type RoomListProps = {
  rooms: RoomDTO[];
};
export default function RoomList({ rooms }: RoomListProps) {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [open, setOpen] = useState(false);
  const userId = useUserStore((state) => state.userId);

  const myRooms = rooms.filter((r) => r.creatorId === userId);
  const otherRooms = rooms.filter((r) => r.creatorId !== userId);

  const mutation = useMutation<OkResponse<RoomDTO>, Error, CreateRoomDTO>({
    mutationFn: async (payload) =>
      await apiClient.post("rooms", { json: payload }).json(),
    onSuccess: () => setOpen(false),
    onSettled: () => {
      setRoomName("");
      router.refresh();
    },
  });

  return (
    <>
      {mutation.error && (
        <Alert
          className="fixed inset-1/2 z-999 min-h-fit w-max -translate-1/2"
          variant="destructive"
        >
          <CircleAlert className="h-4 w-4" />
          <AlertTitle className="flex gap-2">Error</AlertTitle>
          <AlertDescription className="flex justify-center gap-2">
            <span>{mutation.error?.message}</span>
          </AlertDescription>
        </Alert>
      )}
      <Drawer open={open} onOpenChange={setOpen}>
        <div className="container mx-auto flex h-full max-w-3xl flex-col gap-4 p-4">
          <section className="mt-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-8">
              <h2 className="">MyRooms</h2>
              <DrawerTrigger asChild>
                <Button size="icon-sm" variant="default">
                  <Plus />
                </Button>
              </DrawerTrigger>
            </div>
            <div className="text-muted-foreground mb-4 text-sm">
              {myRooms.length > 0
                ? "These are your rooms. You can edit or delete them."
                : "You don't have a room yet. Create one to start chatting!"}
            </div>
            {myRooms.length > 0 ? (
              myRooms.map((room) => (
                <RoomLink
                  key={room.id}
                  to={`/rooms/${room.id}`}
                  room={room}
                  editable={true}
                />
              ))
            ) : (
              <p className="text-muted-foreground bg-muted/30 rounded-lg p-8 text-center">
                You don&apos;t have a room yet.
              </p>
            )}
          </section>
          <section>
            <h2 className="mb-2">Rooms</h2>
            <ul className="mt-4 flex flex-col gap-4">
              {otherRooms.map((room) => (
                <li key={room.id}>
                  <RoomLink to={`/rooms/${room.id}`} room={room} />
                </li>
              ))}
            </ul>
          </section>
        </div>

        <DrawerContent>
          <div className="mx-auto flex w-full max-w-lg flex-col items-center">
            <DrawerHeader className="mb-2">
              <DrawerTitle>Create a new room</DrawerTitle>
            </DrawerHeader>
            <section className="mb-4 w-full px-4">
              <Input
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
                    if (!mutation.isPending && roomName.trim()) {
                      mutation.mutate({ name: roomName, creatorId: userId! });
                    }
                  }
                }}
              />
            </section>
            <DrawerFooter className="flex w-full flex-row items-center justify-between gap-4">
              <Button
                className="flex-1"
                variant="default"
                onClick={() => {
                  mutation.mutate({ name: roomName, creatorId: userId! });
                }}
                disabled={mutation.isPending || !roomName.trim()}
              >
                {mutation.isPending ? "Creating..." : "Create"}
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => {
                  mutation.reset();
                  setRoomName("");
                  setOpen(false);
                }}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

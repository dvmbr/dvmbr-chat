"use client";

import { RoomCreateBody, RoomDTO } from "@/lib/schemas_old/room.schema";
import RoomList from "./RoomList";
import { Button } from "@/components/ui/button";
import { CircleAlert, Plus } from "lucide-react";
import { SubmitEventHandler, useRef, useState } from "react";
import { useCreateRoom } from "@/hooks/useRoom";
import { useRouter } from "next/navigation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import LoadingView from "@/components/ui/LoadingView";

type RoomsContainerProps = {
  rooms: RoomDTO[];
};

export default function RoomsContainer({ rooms }: RoomsContainerProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, error, isError, isPending, reset } = useCreateRoom();

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    const body: RoomCreateBody = {
      name: roomName.trim(),
    };
    mutate(body, {
      onSuccess() {
        setOpen(false);
        setRoomName("");
        router.refresh();
      },
      onError() {
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.select();
        }, 50);
      },
    });
  };
  return (
    <>
      {isPending && <LoadingView text="Creating room..." />}
      {isError && (
        <Alert
          className="fixed inset-1/2 z-999 min-h-fit w-max -translate-1/2"
          variant="destructive"
        >
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {
              (error.meta?.message ||
                (error.error === "Conflict"
                  ? "Room already exists"
                  : error.error)) as string
            }
          </AlertDescription>
        </Alert>
      )}
      <Drawer
        open={open}
        onClose={() => reset()}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (nextOpen) {
            setTimeout(() => {
              inputRef.current?.focus();
            }, 50);
            return;
          }

          setRoomName("");
          reset();
        }}
      >
        <section className="flex h-full min-h-0 flex-col">
          <div className="mb-4 flex items-center justify-between px-4 pt-4">
            <h2>Rooms</h2>
            <DrawerTrigger asChild>
              <Button size="icon" onClick={(e) => e.currentTarget.blur()}>
                <Plus />
              </Button>
            </DrawerTrigger>
          </div>
          <div className="min-h-0 flex-1">
            <RoomList rooms={rooms} />
          </div>
        </section>

        <DrawerDescription className="sr-only">
          This is the room creation drawer. Please enter the room name to create
          a new chat room.
        </DrawerDescription>

        <DrawerContent>
          <form
            className="mx-auto mb-4 flex w-full max-w-lg flex-col items-center"
            onSubmit={handleSubmit}
          >
            <DrawerHeader className="mb-2">
              <DrawerTitle>Create new room</DrawerTitle>
            </DrawerHeader>

            <section className="mb-4 w-full px-4">
              <Input
                ref={inputRef}
                className="text-center text-lg font-semibold"
                value={roomName}
                placeholder="room name..."
                disabled={isPending}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </section>

            <DrawerFooter className="w-full">
              <Button
                type="submit"
                disabled={isPending || !roomName.trim()}
                variant="default"
                className="w-full rounded-xl py-3 text-lg font-bold shadow-md"
              >
                {isPending ? "Saving..." : "Submit"}
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
}

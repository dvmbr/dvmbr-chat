"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { CircleAlert, Pen, Trash } from "lucide-react";
import { DeleteRoomDTO, RoomDTO } from "@/lib/schema/room.schema";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useState } from "react";
import { set } from "zod";

type RoomLinkProps = {
  to: string;
  room: RoomDTO;
  editable?: boolean;
};

export default function RoomLink({
  to,
  room,
  editable = false,
}: RoomLinkProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const mutation = useMutation<void, Error, DeleteRoomDTO>({
    mutationFn: async (payload) => {
      await apiClient.delete(`rooms/${payload.id}`);
    },
    onSuccess: () => {
      setOpen(false);
      router.refresh();
    },
  });

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="text-destructive bg-destructive/20">
            <Trash />
          </AlertDialogMedia>
          <AlertDialogTitle>
            Delete Room &quot;{room.name}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this room? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div>
            <div className="flex gap-2">
              <AlertDialogCancel
                variant="outline"
                disabled={mutation.isPending}
                onClick={() => {
                  setOpen(false);
                  mutation.reset();
                }}
              >
                Cancel
              </AlertDialogCancel>
              <Button
                variant="destructive"
                disabled={mutation.isPending}
                onClick={() => {
                  if (mutation.isPending) return;
                  mutation.mutate({ id: room.id });
                }}
              >
                {mutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
            {mutation.error && (
              <div className="mt-4 flex animate-pulse items-center justify-end gap-2">
                <CircleAlert className="text-destructive -mt-0.5 h-4 w-4" />
                <small className="text-destructive! text-right">
                  {mutation.error?.message}
                </small>
              </div>
            )}
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
      <div
        role="button"
        tabIndex={0}
        onClick={() => router.push(to)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            router.push(to);
          }
        }}
      >
        <div className="bg-muted hover:bg-muted/80 rounded-lg border p-4 transition-colors duration-150">
          <h3 className="pb-4">{room.name}</h3>
          <div className="flex justify-between">
            <small>Created at: {room.createdAt.toLocaleString()}</small>
            {editable && (
              <div className="flex gap-2">
                <Button size="icon-xs" variant="outline">
                  <Pen />
                </Button>
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon-xs"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(true);
                    }}
                    disabled={mutation.isPending}
                  >
                    <Trash />
                  </Button>
                </AlertDialogTrigger>
              </div>
            )}
          </div>
        </div>
      </div>
    </AlertDialog>
  );
}

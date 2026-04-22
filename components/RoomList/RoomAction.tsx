"use client";

import { useState } from "react";
import { Pen, Trash, CircleAlert } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
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
import type { RoomDTO } from "@/lib/schema/room.schema";
import { useUpdateRoom } from "@/hooks/useUpdateRoom";
import { useDeleteRoom } from "@/hooks/useDeleteRoom";

type RoomActionsProps = {
  room: RoomDTO;
};

export default function RoomActions({ room }: RoomActionsProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [name, setName] = useState(room.name);

  const updateMutation = useUpdateRoom({
    onSuccess: () => {
      setOpenEdit(false);
    },
  });

  const deleteMutation = useDeleteRoom({
    onSuccess: () => {
      setOpenDelete(false);
    },
  });

  return (
    <div
      className="flex gap-2"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogTrigger asChild>
          <Button size="icon-xs" variant="outline" type="button">
            <Pen />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <div className="items-top flex gap-10">
              <AlertDialogMedia className="bg-foreground/20">
                <Pen />
              </AlertDialogMedia>
              <div>
                <DialogTitle>Edit Room</DialogTitle>
                <p className="mt-2">Update the name of the room below.</p>
              </div>
            </div>
          </DialogHeader>

          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Room name"
          />

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setOpenEdit(false);
                updateMutation.reset();
                setName(room.name);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={updateMutation.isPending || !name.trim()}
              onClick={() => {
                updateMutation.mutate({
                  id: room.id,
                  name: name.trim(),
                });
              }}
            >
              {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>

          {updateMutation.error && (
            <div className="text-destructive flex items-center gap-2 text-sm">
              <CircleAlert className="h-4 w-4" />
              <span>{updateMutation.error.message}</span>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogTrigger asChild>
          <Button size="icon-xs" variant="destructive" type="button">
            <Trash />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="text-destructive bg-destructive/20">
              <Trash />
            </AlertDialogMedia>
            <AlertDialogTitle>
              Delete Room &quot;{room.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
              onClick={() => {
                deleteMutation.reset();
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                deleteMutation.mutate({ id: room.id });
              }}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>

          {deleteMutation.error && (
            <div className="text-destructive mt-2 flex items-center gap-2 text-sm">
              <CircleAlert className="h-4 w-4" />
              <span>{deleteMutation.error.message}</span>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

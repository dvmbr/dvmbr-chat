"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Spinner } from "@/components/ui/spinner";

import { useDeleteRoom, useUpdateRoom } from "@/hooks/useRoom";
import { RoomDTO } from "@/lib/schemas/room/schema";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { MouseEventHandler, useRef, useState } from "react";
import { userStore } from "@/lib/stores/userStore";
import { Badge } from "@/components/ui/badge";

type RoomItemProps = {
  roomItem: RoomDTO;
  onDelete?: () => void;
};

export default function RoomItem({ roomItem, onDelete }: RoomItemProps) {
  const { userId } = userStore();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState(roomItem.name);
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateRoom(
    roomItem.id,
  );
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteRoom(
    roomItem.id,
  );

  const handleUpdate: MouseEventHandler<HTMLButtonElement> = () => {
    const trimmedName = newRoomName.trim();
    if (!trimmedName || trimmedName === roomItem.name) return;

    updateMutate(
      { name: trimmedName },
      {
        onSuccess() {
          router.refresh();
          setIsTyping(false);
          setNewRoomName(roomItem.name);
        },
        onError() {
          setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
          }, 50);
        },
      },
    );
  };

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    deleteMutate(undefined, {
      onSuccess() {
        setIsDeleteAlertOpen(false);
        onDelete?.();
      },
    });
  };

  const onClickUpdate: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsTyping(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 50);
  };

  const onClickDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsDeleteAlertOpen(true);
  };

  return (
    <Dialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
      <Card
        className="group hover:bg-muted/50 relative m-1 cursor-pointer transition"
        onClick={() => !isTyping && router.push(`/rooms/${roomItem.id}`)}
        aria-busy={isDeleting}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          {isTyping ? (
            <form
              className="flex grow gap-1"
              onClick={(e) => e.stopPropagation()}
              onSubmit={(e) => {
                e.preventDefault();
                setIsTyping(false);
                setNewRoomName(roomItem.name);
              }}
            >
              <Input
                className="grow"
                ref={inputRef}
                value={newRoomName}
                onChange={(e) => {
                  setNewRoomName(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setIsTyping(false);
                    setNewRoomName(roomItem.name);
                  }
                }}
              />
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  className="hover:text-brand-mint text-brand-mint disabled:text-muted-foreground"
                  onClick={handleUpdate}
                  disabled={
                    newRoomName.trim() === "" ||
                    newRoomName.trim() === roomItem.name
                  }
                >
                  <Check />
                </Button>
                <Button
                  className="hover:text-destructive text-destructive"
                  type="submit"
                  size="icon-sm"
                  variant="ghost"
                >
                  <X />
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{roomItem.name}</CardTitle>
              {roomItem.unreadCount > 0 && (
                <Badge className="bg-brand-red text-brand-mint">
                  {roomItem.unreadCount}
                </Badge>
              )}
            </div>
          )}

          {/* actions */}
          {userId === roomItem.creator.id && !isTyping && !isDeleting && (
            <div className="flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="hover:text-brand-mint text-brand-mint sm:text-foreground"
                onClick={onClickUpdate}
                disabled={isDeleting}
              >
                <Pencil />
              </Button>

              <DialogTrigger asChild>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  className="hover:text-destructive text-destructive sm:text-foreground"
                  onClick={onClickDelete}
                  disabled={isDeleting}
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
            </div>
          )}
        </CardHeader>

        <CardContent className="text-muted-foreground flex items-center justify-between text-xs">
          <span>{new Date(roomItem.createdAt).toLocaleDateString()}</span>
          <span>by {roomItem.creator.nickname}</span>
        </CardContent>

        {(isDeleting || isUpdating) && (
          <div className="bg-muted/80 absolute inset-0 flex h-full w-full items-center justify-center gap-1">
            {isDeleting && (
              <strong className="text-destructive">{`Deleting room "${roomItem.name}"...`}</strong>
            )}
            {isUpdating && (
              <strong className="text-brand-mint">{`Updating room "${roomItem.name}"...`}</strong>
            )}
            <Spinner />
          </div>
        )}
      </Card>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => {
          if (isDeleting) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isDeleting) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-destructive">
            <span className="block text-center text-lg">
              Are you sure you want to delete the room
            </span>
            <span className="my-2 block text-center">
              &quot;
              <span className="text-center">{roomItem.name}</span>
              &quot;?
            </span>
          </DialogTitle>
          <DialogDescription className="text-center">
            This action cannot be undone. All messages and participants in this
            room will be removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

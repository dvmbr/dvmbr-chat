"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { userStore } from "@/lib/stores/userStore";
import { apiClient } from "@/lib/api-client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingView from "@/components/ui/LoadingView";

export default function UserProfilePopover({ children }: { children: React.ReactNode }) {
  const { nickname, setUser, userId } = userStore();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const safeNickname = nickname ?? "Unknown";

  const handleEditOpen = () => {
    setNicknameInput(safeNickname);
    setPopoverOpen(false);
    setEditOpen(true);
  };

  const handleDeleteOpen = () => {
    setPopoverOpen(false);
    setDeleteOpen(true);
  };

  const handleUpdateNickname = async () => {
    const trimmed = nicknameInput.trim();
    if (!trimmed || trimmed === nickname) return;
    setIsLoading(true);
    try {
      const res = await apiClient.patch("user", { json: { nickname: trimmed } }).json<{ data: { id: number; nickname: string } }>();
      setUser(userId, res.data.nickname);
      setEditOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await apiClient.delete("user");
      setUser(null, null);
      window.location.replace("/");
    } catch {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent side="top" align="start" className="w-48 p-1">
          <div className="overflow-hidden px-3 py-2">
            <span className="block truncate text-sm font-semibold">{safeNickname}</span>
          </div>
          <div className="border-t my-1" />
          <button
            onClick={handleEditOpen}
            className="hover:bg-accent text-brand-mint flex w-full items-center gap-2 rounded px-3 py-2 text-sm transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </button>
          <button
            onClick={handleDeleteOpen}
            className="hover:bg-destructive/10 text-destructive flex w-full items-center gap-2 rounded px-3 py-2 text-sm transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </button>
        </PopoverContent>
      </Popover>

      {/* Edit nickname dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-center text-lg">Edit Profile</DialogTitle>
          </DialogHeader>
          <Input
            value={nicknameInput}
            onChange={(e) => setNicknameInput(e.target.value)}
            placeholder="Nickname"
            maxLength={20}
            onKeyDown={(e) => e.key === "Enter" && handleUpdateNickname()}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isLoading}>Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleUpdateNickname}
              disabled={isLoading || !nicknameInput.trim() || nicknameInput.trim() === nickname}
              className="hover:bg-brand-mint"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isDeleting && <LoadingView text="Deleting account..." />}

      {/* Delete account confirm */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent
          showCloseButton={false}
          onInteractOutside={(e) => { if (isDeleting) e.preventDefault(); }}
          onEscapeKeyDown={(e) => { if (isDeleting) e.preventDefault(); }}
        >
          <DialogHeader>
            <DialogTitle className="text-destructive">
              <span className="block text-center text-lg">Are you sure you want to delete your account?</span>
            </DialogTitle>
            <DialogDescription className="text-center">
              This action cannot be undone. All your data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isDeleting}>Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

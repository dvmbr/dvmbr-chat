"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { userStore } from "@/lib/stores/userStore";
import { apiClient } from "@/lib/api-client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingView from "@/components/ui/LoadingView";

export default function UserProfilePopover({ children }: { children: React.ReactNode }) {
  const { nickname, setUser, userId } = userStore();
  const router = useRouter();

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <Input
            value={nicknameInput}
            onChange={(e) => setNicknameInput(e.target.value)}
            placeholder="Nickname"
            maxLength={20}
            onKeyDown={(e) => e.key === "Enter" && handleUpdateNickname()}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateNickname} disabled={isLoading || !nicknameInput.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isDeleting && <LoadingView text="Deleting account..." />}

      {/* Delete account confirm */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and all your data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

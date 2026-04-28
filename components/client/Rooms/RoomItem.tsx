"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoomDTO } from "@/lib/schema/room.schema";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

type RoomItemProps = {
  roomItem: RoomDTO;
};

export default function RoomItem({ roomItem }: RoomItemProps) {
  return (
    <Link href={`/rooms/${roomItem.id}`}>
      <Card className="group hover:bg-muted/50 m-1 cursor-pointer transition">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">{roomItem.name}</CardTitle>

          {/* actions */}
          <div className="flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="hover:text-brand-mint text-brand-mint sm:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="hover:text-brand-red text-brand-red sm:text-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="text-muted-foreground flex items-center justify-between text-xs">
          <span>{new Date(roomItem.createdAt).toLocaleDateString()}</span>
          <span>by {roomItem.creator.nickname}</span>
        </CardContent>
      </Card>
    </Link>
  );
}

"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCircle2, LogOut } from "lucide-react";

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    image: string;
  };
  onDisconnect: () => void;
}

export function UserProfile({ user, onDisconnect }: UserProfileProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer">
          <Avatar>
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{user.email}</span>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src={user.image} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{user.name}</h4>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Button
              variant="destructive"
              size="sm"
              className="w-full mt-2"
              onClick={onDisconnect}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generateEmails } from "@/lib/data";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmailFilterProps {
  selectedSenders: string[];
  onSenderSelect: (email: string) => void;
}

export function EmailFilter({ selectedSenders, onSenderSelect }: EmailFilterProps) {
  const [emailInput, setEmailInput] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Get unique senders from emails
  const allEmails = generateEmails();
  const uniqueSenders = Array.from(new Set(allEmails.map(email => email.sender)));

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddEmail = (email: string) => {
    if (!email) return;

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (selectedSenders.length >= 20) {
      toast({
        title: "Maximum limit reached",
        description: "You can only add up to 20 email addresses",
        variant: "destructive",
      });
      return;
    }

    if (selectedSenders.includes(email)) {
      toast({
        title: "Duplicate email",
        description: "This email address has already been added",
        variant: "destructive",
      });
      return;
    }

    onSenderSelect(email);
    setEmailInput("");
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter email address..."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="max-w-md"
            />
            <Button 
              onClick={() => handleAddEmail(emailInput)} 
              size="icon"
              disabled={!emailInput}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search email address..."
              value={emailInput}
              onValueChange={setEmailInput}
            />
            <CommandList>
              <CommandEmpty>No email address found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                {uniqueSenders
                  .filter(email => 
                    email.toLowerCase().includes(emailInput.toLowerCase()) &&
                    !selectedSenders.includes(email)
                  )
                  .map(email => (
                    <CommandItem
                      key={email}
                      value={email}
                      onSelect={() => handleAddEmail(email)}
                    >
                      {email}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
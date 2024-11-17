"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { generateEmails } from "@/lib/data";

interface TopSendersProps {
  selectedSenders: string[];
  onSenderClick: (sender: string) => void;
}

export function TopSenders({ selectedSenders, onSenderClick }: TopSendersProps) {
  // Memoize emails and sender calculations to prevent unnecessary recalculations
  const { topSenders, totalEmailCount } = useMemo(() => {
    const emails = generateEmails();
    
    // Calculate sender counts from all emails
    const senderCounts = emails.reduce((acc, email) => {
      acc[email.sender] = (acc[email.sender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort senders by count and get top 7
    const sortedSenders = Object.entries(senderCounts)
      .sort((a, b) => {
        // First sort by count (descending)
        const countDiff = b[1] - a[1];
        if (countDiff !== 0) return countDiff;
        // If counts are equal, sort alphabetically
        return a[0].localeCompare(b[0]);
      })
      .slice(0, 7);

    return {
      topSenders: sortedSenders,
      totalEmailCount: emails.length
    };
  }, []); // Empty dependency array since generateEmails is deterministic

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Top Senders (Last 7 Days)</h3>
        <span className="text-sm text-muted-foreground">
          Total: {totalEmailCount} emails
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {topSenders.map(([email, count]) => (
          <Badge
            key={email}
            variant={selectedSenders.includes(email) ? "default" : "secondary"}
            className={`text-sm cursor-pointer transition-colors ${
              selectedSenders.includes(email)
                ? "hover:bg-primary/80"
                : "hover:bg-secondary/80"
            }`}
            onClick={() => onSenderClick(email)}
          >
            {email} ({count})
          </Badge>
        ))}
      </div>
    </div>
  );
}
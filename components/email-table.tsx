"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { generateEmails } from "@/lib/data";

// Generate emails once outside component to ensure consistency
const allEmails = generateEmails();

export function EmailTable({ selectedSenders = [] }: { selectedSenders: string[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Memoize filtered emails to prevent unnecessary recalculations
  const filteredEmails = useMemo(() => {
    let filtered = [...allEmails]; // Create a copy to maintain original order

    // Filter by selected senders
    if (selectedSenders.length > 0) {
      filtered = filtered.filter(email => selectedSenders.includes(email.sender));
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (email) =>
          email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.sender.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [searchQuery, selectedSenders]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSenders]);

  const totalPages = Math.ceil(filteredEmails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedEmails = filteredEmails.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {Math.min(startIndex + itemsPerPage, filteredEmails.length)} of {filteredEmails.length} emails
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedEmails.map((email) => (
              <TableRow key={email.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {!email.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                    <span>{email.subject}</span>
                  </div>
                </TableCell>
                <TableCell>{email.sender}</TableCell>
                <TableCell>{format(email.date, "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {email.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
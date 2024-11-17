"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { EmailFilter } from "./email-filter";
import { TopSenders } from "./top-senders";

interface EmailFilterSectionProps {
  onFiltersChange: (senders: string[]) => void;
}

export function EmailFilterSection({ onFiltersChange }: EmailFilterSectionProps) {
  const [selectedSenders, setSelectedSenders] = useState<string[]>([]);

  const handleSenderClick = useCallback((sender: string) => {
    setSelectedSenders(prev => {
      const newSelection = prev.includes(sender)
        ? prev.filter(s => s !== sender)
        : [...prev, sender];
      return newSelection;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedSenders([]);
    onFiltersChange([]);
  }, [onFiltersChange]);

  useEffect(() => {
    onFiltersChange(selectedSenders);
  }, [selectedSenders, onFiltersChange]);

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Email Filtering</CardTitle>
        {selectedSenders.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 lg:px-3"
          >
            Clear Filters
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <TopSenders
          selectedSenders={selectedSenders}
          onSenderClick={handleSenderClick}
        />
        <div className="border-t pt-6">
          <h3 className="text-sm font-medium mb-4">Add Custom Email Addresses</h3>
          <EmailFilter
            selectedSenders={selectedSenders}
            onSenderSelect={handleSenderClick}
          />
        </div>
      </CardContent>
    </Card>
  );
}
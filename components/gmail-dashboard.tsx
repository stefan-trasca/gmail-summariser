"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { UserProfile } from '@/components/user-profile';
import { EmailTable } from '@/components/email-table';
import { EmailFilterSection } from '@/components/email-filter-section';
import { LoadingSpinner } from '@/components/loading-spinner';
import { ThemeToggle } from '@/components/theme-toggle';

interface UserInfo {
  name: string;
  email: string;
  picture: string;
}

export function GmailDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSenders, setSelectedSenders] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated
    fetch('/api/auth/user')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUserInfo(data.user);
        }
      })
      .catch(console.error);
  }, []);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login');
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to get auth URL');
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Unable to connect to Gmail. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUserInfo(null);
      setSelectedSenders([]);
      toast({
        title: "Disconnected from Gmail",
        description: "You have been successfully disconnected.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error disconnecting",
        description: "Unable to disconnect. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold">Gmail Summarizer</h1>
          <ThemeToggle />
        </div>
        {!userInfo ? (
          <Button
            onClick={handleConnect}
            disabled={isLoading}
            size="lg"
            className="gap-2"
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <Mail className="w-5 h-5" />
            )}
            Connect Gmail
          </Button>
        ) : (
          <UserProfile
            user={{
              name: userInfo.name,
              email: userInfo.email,
              image: userInfo.picture,
            }}
            onDisconnect={handleDisconnect}
          />
        )}
      </div>

      {userInfo && (
        <div className="space-y-6">
          <EmailFilterSection onFiltersChange={setSelectedSenders} />
          <EmailTable selectedSenders={selectedSenders} />
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
interface Message {
  _id: string;
  name: string;
  subject: string;
  message: string;
  createdAt: string;
  seen: boolean;
}

// Skeleton component
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`}
    />
  );
}

export default function MessageDetails() {
  const params = useParams();
  const messageId = params?.id as string;

  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!messageId) return;

    const fetchMessage = async () => {
      try {
        setLoading(true);
        const id = messageId;
        const res = await fetch(`/api/message/${id}`);
        const data = await res.json();
        setMessage(data.data);
      } catch (err) {
        console.error("Failed to fetch message", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [messageId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 border rounded-xl bg-white dark:bg-white/[0.03] dark:border-gray-800">
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-4 w-1/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!message) {
    return (
      <div className="text-gray-500 p-6 text-center">Message not found.</div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/messages">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="max-w-2xl mx-auto p-6 border rounded-xl bg-white dark:bg-white/[0.03] dark:border-gray-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">
          Message from {message.name}
        </h2>
        <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">
          Subject: {message.subject}
        </p>
        <div className="mt-4 text-gray-700 dark:text-white whitespace-pre-wrap">
          {message.message}
        </div>
      </div>{" "}
    </div>
  );
}

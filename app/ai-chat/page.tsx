"use client";

import { AIChat } from "@/components/ai-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function AIChatPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8 px-2 min-h-[80vh]">
      <Card className="w-full max-w-xl shadow-lg border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            AI Chat Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AIChat isOpen={true} onToggle={() => {}} onMinimize={() => {}} />
        </CardContent>
      </Card>
    </div>
  );
} 
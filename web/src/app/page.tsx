"use client";

import { useState, useRef, useEffect } from "react";
import { BookOpen, Terminal, Sparkles, History } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { ChatInput } from "@/components/chat/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import VideoPlayer from "@/components/VideoPlayer";
import { useChat } from "@/hooks/use-chat";

const STARTER_PROMPTS = [
  { text: "Summarize the speaker's view on ethics", icon: BookOpen },
  { text: "What does the speaker say about AI?", icon: Sparkles }
];

export default function ChatPage() {
  const { messages, isLoading, streamedContent, sendMessage } = useChat();

  // Video Player State
  const [activeVideo, setActiveVideo] = useState<{
    youtubeId: string;
    startTime: number;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0 || streamedContent) {
      scrollToBottom();
    }
  }, [messages, streamedContent]);

  const parseTimestamp = (ts: string): number => {
    if (!ts) return 0;
    const parts = ts.split(":").map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  };

  const handleCitationClick = (videoId: string, startTs: string) => {
    setActiveVideo({
      youtubeId: videoId,
      startTime: parseTimestamp(startTs),
    });
  };

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleSubmit = (val: string) => {
    sendMessage(val);
  };

  return (
    <>
      <div className="flex-1 overflow-hidden relative w-full h-full flex flex-col">
        {messages.length === 0 ? (
          // --- Empty State: Centered Hero + Input ---
          <div className="flex h-full flex-col items-center justify-center p-4 animate-in fade-in duration-500">
            <div className="w-full max-w-4xl flex flex-col gap-10 px-4 md:px-0">
              <HeroSection prompts={STARTER_PROMPTS} onPromptClick={handlePromptClick} />
              <ChatInputWrapper onSubmit={handleSubmit} isLoading={isLoading} layout="inline" />
            </div>
          </div>
        ) : (
          // --- Chat State: Messages + Fixed Input ---
          <>
            <div className="h-full overflow-y-auto w-full scroll-smooth pt-32 pb-48 flex flex-col items-center">
              <div className="flex flex-col w-full px-4 md:px-12 max-w-4xl space-y-8">
                {messages.map((msg, i) => (
                  <ChatMessage
                    key={i}
                    role={msg.role}
                    content={msg.content}
                    sources={msg.sources}
                    onCitationClick={handleCitationClick}
                  />
                ))}
                {(isLoading || streamedContent) && (
                  <ChatMessage
                    role="assistant"
                    content={streamedContent || "Thinking..."}
                    isStreaming={true}
                    onCitationClick={handleCitationClick}
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <ChatInputWrapper onSubmit={handleSubmit} isLoading={isLoading} layout="fixed" />
          </>
        )}
      </div>

      {/* Video Player */}
      {activeVideo && (
        <VideoPlayer
          youtubeId={activeVideo.youtubeId}
          startTime={activeVideo.startTime}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </>
  );
}

function ChatInputWrapper({ onSubmit, isLoading, layout }: { onSubmit: (val: string) => void, isLoading: boolean, layout: "fixed" | "inline" }) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSubmit(input);
    setInput("");
  };

  return (
    <ChatInput
      value={input}
      onChange={setInput}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      layout={layout}
    />
  );
}

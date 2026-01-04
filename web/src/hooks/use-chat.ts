"use client";

import { useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";

export interface Message {
    role: "user" | "assistant";
    content: string;
    sources?: any[]; // The structured citation objects from the backend
}

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [streamedContent, setStreamedContent] = useState("");
    const contentRef = useRef("");

    const addMessage = (role: "user" | "assistant", content: string) => {
        setMessages((prev) => [...prev, { role, content }]);
    };

    const sendMessage = async (query: string) => {
        if (!query.trim()) return;

        addMessage("user", query);
        setIsLoading(true);
        setStreamedContent("");
        contentRef.current = "";

        try {
            await api.streamChat(
                query,
                (content) => {
                    setStreamedContent((prev) => prev + content);
                    contentRef.current += content;
                },
                (finalData) => {
                    // Stream finished. Commit the assistant message.
                    setMessages((prev) => [
                        ...prev,
                        {
                            role: "assistant",
                            content: contentRef.current + (finalData.answer || ""), // Ensure we catch any trailing buffer
                            sources: finalData.citations // Attach the full citation metadata for the drawer
                        }
                    ]);
                    setStreamedContent("");
                    setIsLoading(false);
                },
                (error) => {
                    console.error("Chat error:", error);
                    setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${error}` }]);
                    setIsLoading(false);
                }
            );
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([]);
        setStreamedContent("");
    };

    return {
        messages,
        isLoading,
        streamedContent,
        sendMessage,
        clearChat
    };
}

"use client";

import { SendHorizontal, Loader2 } from "lucide-react";
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/SidebarContext";

interface ChatInputProps {
    value: string;
    onChange: (val: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
    layout: "fixed" | "inline";
}

export function ChatInput({ value, onChange, onSubmit, isLoading, layout }: ChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { isOpen: isSidebarOpen, isMobile } = useSidebar();

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "inherit";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    };

    // Calculate left position based on sidebar state
    // Position logic kept exactly as requested.
    const containerClasses = layout === "fixed"
        ? cn(
            "absolute bottom-0 w-full flex justify-center z-40 p-6 transition-all duration-300 ease-in-out bg-gradient-to-t from-background via-background/95 to-transparent"
        )
        : "w-full";

    const wrapperClasses = layout === "fixed"
        ? "w-full max-w-4xl relative"
        : "relative";

    return (
        <div className={containerClasses}>
            <div className={wrapperClasses}>
                <div className="relative flex items-center gap-4 glass-input rounded-[26px] p-2 pl-5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all duration-300 shadow-2xl bg-black/40 backdrop-blur-xl">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question about the videos..."
                        className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-[200px] min-h-[24px] py-3 text-base leading-relaxed placeholder:text-muted-foreground/70 text-foreground scrollbar-hide"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        onClick={onSubmit}
                        disabled={!value.trim() || isLoading}
                        className={cn(
                            "flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200 shrink-0 mb-1",
                            value.trim() && !isLoading
                                ? "bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                                : "bg-white/5 text-muted-foreground/50 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <SendHorizontal size={18} />
                        )}
                    </button>
                </div>
                {layout === "fixed" && (
                    <div className="text-center mt-4">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
                            LanternSight AI • Video Citations
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
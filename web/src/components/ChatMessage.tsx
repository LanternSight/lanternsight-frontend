"use client";

import ReactMarkdown from 'react-markdown';
import { Bot, User, ChevronDown, ChevronRight, Play } from 'lucide-react';
import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface Source {
    video_id: string;
    topic: string;
    reasoning: string;
    timestamp_start: string;
}

interface ChatMessageProps {
    role: "user" | "assistant";
    content: string;
    sources?: Source[];
    isStreaming?: boolean;
    onCitationClick: (videoId: string, start: string) => void;
}

export default function ChatMessage({
    role,
    content,
    sources,
    isStreaming,
    onCitationClick
}: ChatMessageProps) {
    const [showSources, setShowSources] = useState(false);

    // 1. Pre-process text: Convert [id:timestamp] or [id:timestamp-timestamp]
    // This allows ReactMarkdown to parse it as a link, which we then hijack.
    const processedContent = useMemo(() => {
        if (role !== "assistant") return content;
        // Regex looks for [string:CONTENT] where CONTENT is anything inside brackets
        // This handles [id:10:00], [id:10:00-12:00], and [id:10:00-12:00; 14:00-15:00]
        const citationRegex = /\[([a-zA-Z0-9_-]+):([^\]]+)\]/g;
        return content.replace(citationRegex, (match, id, ts) => {
            // ts might be "10:00", "10:00-12:00", or "9:27-14:14; 14:25-16:49"
            // usage: link to the start time of the FIRST range found
            const startTs = ts.split(/[-;]/)[0].trim();
            // Use a query-like format to ensure ReactMarkdown doesn't sanitize the protocol
            return `[${ts}](?citation=true&videoId=${id}&time=${startTs})`;
        });
    }, [content, role]);

    // Helper to parse "MM:SS" or "HH:MM:SS" to seconds
    const parseTimestamp = (ts: string): number => {
        if (!ts) return 0;
        const parts = ts.split(':').map(Number);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return 0;
    };

    const MarkdownComponents = {
        // Hijack the 'a' tag. If href contains citation params, render a chip as a direct link.
        a: ({ href, children }: any) => {
            if (href?.includes('?citation=true')) {
                // Parse params
                const params = new URLSearchParams(href.replace(/^.*\?/, ''));
                const videoId = params.get('videoId');
                const timeStr = params.get('time') || "0";
                const seconds = parseTimestamp(timeStr);

                const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}&t=${seconds}s`;

                return (
                    <a
                        href={youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-1 -translate-y-[1px] !bg-white/20 !text-white border border-white/30 hover:!bg-white/30 rounded text-xs font-bold font-mono transition-colors cursor-pointer select-none no-underline shadow-sm"
                        title="Open video in new tab"
                    >
                        <Play size={8} className="fill-current" />
                        {children}
                    </a>
                );
            }
            return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{children}</a>;
        },
        // Clean up the wrapper text we added in regex replacement (optional, just for safety)
        p: ({ children }: any) => <p className="mb-4 last:mb-0 leading-7 text-zinc-100">{children}</p>
    };

    return (
        <div className={twMerge(
            "group w-full border-b border-border/40 pb-6 mb-2", // Added pb-6 and mb-2 for spacing
            role === "assistant" ? "bg-transparent" : "bg-transparent" // Removed background difference for cleaner look
        )}>
            <div className="mx-auto max-w-4xl px-0 py-2 flex gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0 flex flex-col relative items-end">
                    <div className={clsx(
                        "w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm",
                        role === "assistant"
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary text-secondary-foreground border-border"
                    )}>
                        {role === "assistant" ? <Bot size={18} /> : <User size={18} />}
                    </div>
                </div>

                {/* Content */}
                <div className="relative flex-1 overflow-hidden">
                    <div className="prose prose-invert max-w-none prose-p:text-zinc-300 prose-headings:text-zinc-100 prose-strong:text-zinc-100">
                        {role === "assistant" ? (
                            <ReactMarkdown components={MarkdownComponents}>
                                {processedContent}
                            </ReactMarkdown>
                        ) : (
                            <p className="whitespace-pre-wrap leading-7 text-zinc-200">{content}</p>
                        )}

                        {isStreaming && (
                            <span className="inline-block w-2 h-4 ml-1 bg-primary/50 animate-pulse align-middle rounded-sm" />
                        )}
                    </div>

                    {/* Sources Drawer */}
                    {!isStreaming && sources && sources.length > 0 && role === "assistant" && (
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <button
                                onClick={() => setShowSources(!showSources)}
                                className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors mb-3 select-none"
                            >
                                {showSources ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                {sources.length} Sources Analyzed
                            </button>

                            {showSources && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {sources.map((source, i) => (
                                        <div
                                            key={i}
                                            onClick={() => onCitationClick(source.video_id, source.timestamp_start)}
                                            className="bg-black/20 hover:bg-black/40 border border-white/10 hover:border-primary/30 p-3 rounded-lg cursor-pointer transition-all flex flex-col gap-2 group/card"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="text-xs font-semibold text-zinc-300 line-clamp-1 group-hover/card:text-primary transition-colors">
                                                    {source.topic}
                                                </span>
                                                <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">
                                                    {source.timestamp_start}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                                                {source.reasoning || "Relevant context found in this segment."}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

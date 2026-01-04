"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface TopicDetail {
    id: string;
    video_id: string;
    youtube_id: string;
    video_title: string | null;
    topic: string;
    topic_num: number;
    timestamp_start: string;
    timestamp_end: string;
    answer: string;
}

export default function TopicDetailPage() {
    const params = useParams();
    const [topic, setTopic] = useState<TopicDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchTopic(params.id as string);
        }
    }, [params.id]);

    const fetchTopic = async (id: string) => {
        try {
            const res = await fetch(`${API_BASE}/browse/topics/${id}`);
            const data = await res.json();
            setTopic(data);
        } catch (error) {
            console.error("Failed to fetch topic:", error);
        } finally {
            setLoading(false);
        }
    };

    const parseTimestamp = (ts: string): number => {
        const parts = ts.split(":").map(Number);
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        return 0;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <svg className="w-8 h-8 animate-spin text-[var(--primary)]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        );
    }

    if (!topic) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-semibold mb-2">Topic not found</h2>
                <Link href="/topics" className="text-[var(--accent)] hover:underline">
                    Back to topics
                </Link>
            </div>
        );
    }

    const startSeconds = parseTimestamp(topic.timestamp_start);

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
                {/* Back link */}
                <Link
                    href="/topics"
                    className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-white mb-6 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to topics
                </Link>

                {/* Topic header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
                            <span className="text-sm font-bold">{topic.topic_num}</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{topic.topic}</h1>
                            <p className="text-sm text-[var(--muted)]">
                                {topic.video_title || "Video"} • {topic.timestamp_start} - {topic.timestamp_end}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Video player */}
                <div className="aspect-video rounded-xl overflow-hidden bg-black mb-6">
                    <iframe
                        src={`https://www.youtube.com/embed/${topic.youtube_id}?start=${startSeconds}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                {/* Answer content */}
                <div className="glass rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4 gradient-text">Summary</h2>
                    <div className="prose prose-invert max-w-none text-[var(--foreground)]">
                        <p className="whitespace-pre-wrap leading-relaxed">{topic.answer}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

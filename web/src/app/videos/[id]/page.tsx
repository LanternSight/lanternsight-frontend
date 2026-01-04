"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Topic {
    id: string;
    topic: string;
    topic_num: number;
    timestamp_start: string;
    timestamp_end: string;
}

interface VideoDetail {
    id: string;
    youtube_id: string;
    title: string | null;
    description: string | null;
    topic_count: number;
    topics: Topic[];
}

export default function VideoDetailPage() {
    const params = useParams();
    const [video, setVideo] = useState<VideoDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    useEffect(() => {
        if (params.id) {
            fetchVideo(params.id as string);
        }
    }, [params.id]);

    const fetchVideo = async (id: string) => {
        try {
            const res = await fetch(`${API_BASE}/browse/videos/${id}`);
            const data = await res.json();
            setVideo(data);
            if (data.topics?.length > 0) {
                setSelectedTopic(data.topics[0]);
            }
        } catch (error) {
            console.error("Failed to fetch video:", error);
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

    if (!video) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-semibold mb-2">Video not found</h2>
                <Link href="/videos" className="text-[var(--accent)] hover:underline">
                    Back to videos
                </Link>
            </div>
        );
    }

    const startSeconds = selectedTopic ? parseTimestamp(selectedTopic.timestamp_start) : 0;

    return (
        <div className="flex-1 flex overflow-hidden">
            {/* Main content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl">
                    {/* Back link */}
                    <Link
                        href="/videos"
                        className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-white mb-6 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to videos
                    </Link>

                    {/* Video header */}
                    <h1 className="text-2xl font-bold mb-2">{video.title || "Untitled Video"}</h1>
                    {video.description && (
                        <p className="text-[var(--muted)] mb-6">{video.description}</p>
                    )}

                    {/* Video player */}
                    <div className="aspect-video rounded-xl overflow-hidden bg-black mb-6">
                        <iframe
                            key={`${video.youtube_id}-${startSeconds}`}
                            src={`https://www.youtube.com/embed/${video.youtube_id}?start=${startSeconds}`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    {selectedTopic && (
                        <div className="glass rounded-xl p-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
                                    <span className="text-xs font-bold">{selectedTopic.topic_num}</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold">{selectedTopic.topic}</h3>
                                    <p className="text-xs text-[var(--muted)]">
                                        {selectedTopic.timestamp_start} - {selectedTopic.timestamp_end}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Topics sidebar */}
            <div className="w-80 border-l border-[var(--border)] overflow-y-auto p-4">
                <h2 className="font-semibold mb-4 text-sm text-[var(--muted)] uppercase tracking-wide">
                    Topics ({video.topic_count})
                </h2>
                <div className="space-y-2">
                    {video.topics.map((topic) => (
                        <button
                            key={topic.id}
                            onClick={() => setSelectedTopic(topic)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${selectedTopic?.id === topic.id
                                    ? "bg-[var(--primary)] text-white"
                                    : "hover:bg-[var(--secondary)]"
                                }`}
                        >
                            <div className="flex items-start gap-2">
                                <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded">
                                    {topic.topic_num}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm line-clamp-2">{topic.topic}</p>
                                    <p className="text-xs text-[var(--muted)] mt-1">
                                        {topic.timestamp_start}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

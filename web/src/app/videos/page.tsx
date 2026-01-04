"use client";

import { useEffect, useState } from "react";
import { api, VideoSummary } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Loader2, PlayCircle, Clock, Layers } from "lucide-react";

export default function VideosPage() {
    const [videos, setVideos] = useState<VideoSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getVideos().then(data => {
            setVideos(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;
    }

    return (

        <div className="h-full overflow-y-auto w-full flex flex-col items-center py-8">
            <div className="w-full max-w-7xl px-6 md:px-12 lg:px-16 space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Video Database</h1>
                    <p className="text-muted-foreground">Full index of processed videos available for semantic search.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {videos.map((video) => (
                        <Card
                            key={video.id}
                            className="group bg-card border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300"
                        >
                            {/* Thumbnail Wrapper */}
                            <div className="aspect-video bg-zinc-900 relative overflow-hidden">
                                <img
                                    src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-12 h-12 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                                        <PlayCircle size={24} fill="currentColor" className="text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-3">
                                <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-zinc-100 group-hover:text-primary transition-colors">
                                    {video.title || "Untitled Video"}
                                </h3>

                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Layers size={14} />
                                        <span>{video.topic_count} Topics</span>
                                    </div>
                                    <div className="font-mono bg-secondary px-1.5 py-0.5 rounded text-[10px]">
                                        ID: {video.youtube_id.substring(0, 6)}...
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

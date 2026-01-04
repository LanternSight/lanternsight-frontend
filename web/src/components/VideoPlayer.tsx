"use client";

import { X } from "lucide-react";

interface VideoPlayerProps {
    youtubeId: string;
    startTime: number; // in seconds
    onClose: () => void;
}

export default function VideoPlayer({ youtubeId, startTime, onClose }: VideoPlayerProps) {
    return (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] shadow-2xl rounded-xl overflow-hidden border border-white/10 bg-zinc-950 animate-in slide-in-from-bottom-5 fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-white/5">
                <span className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Now Playing
                </span>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Player */}
            <div className="aspect-video bg-black relative">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${youtubeId}?start=${startTime}&autoplay=1&rel=0`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                />
            </div>
        </div>
    );
}

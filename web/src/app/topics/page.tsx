"use client";

import { useEffect, useState } from "react";
import { api, TopicSummary } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, Loader2, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TopicsPage() {
    const [topics, setTopics] = useState<TopicSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getTopics().then(data => {
            setTopics(data);
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
                    <h1 className="text-3xl font-bold tracking-tight">Explore Topics</h1>
                    <p className="text-muted-foreground">Browse conversations categorized by theological and philosophical themes.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {topics.map((topic) => (
                        <Card
                            key={topic.id}
                            className="group cursor-pointer hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 bg-card overflow-hidden"
                        >
                            {/* Visual Header */}
                            <div className="h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 border-b border-border p-6 flex items-start justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full translate-x-10 -translate-y-10 group-hover:bg-primary/20 transition-colors" />
                                <Badge variant="secondary" className="bg-black/20 backdrop-blur-md border-white/10 text-zinc-300">
                                    <Hash size={10} className="mr-1" />
                                    {topic.topic_num || 0}
                                </Badge>
                                <ArrowUpRight className="text-zinc-600 group-hover:text-primary transition-colors" size={20} />
                            </div>

                            {/* Content */}
                            <CardContent className="p-6 pt-4">
                                <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                    {topic.topic}
                                </h3>
                                <p className="text-xs text-muted-foreground font-mono">
                                    {topic.video_title || "Unknown Video"}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

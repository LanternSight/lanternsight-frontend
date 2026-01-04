//api.ts
import { useRef, useState } from 'react';

const API_BASE_URL = 'http://localhost:8000';

export interface Citation {
    video_id: string;
    youtube_id: string;
    timestamp_start: string;
    timestamp_end: string;
    topic: string;
    reasoning: string;
    is_faithful: boolean;
}

export interface QueryResponse {
    answer: string;
    citations: Citation[];
    faithfulness_score: number;
    latency_seconds: number;
}

export interface TopicSummary {
    id: string;
    video_id: string;
    youtube_id: string;
    video_title?: string;
    topic: string;
    topic_num: number;
    timestamp_start: string;
    timestamp_end: string;
}

export interface TopicDetail extends TopicSummary {
    answer: string;
}

export interface VideoSummary {
    id: string;
    youtube_id: string;
    title?: string;
    description?: string;
    topic_count: number;
}

export interface VideoDetail extends VideoSummary {
    topics: TopicSummary[];
}

export const api = {
    /**
     * Stream chat response from the backend.
     * @param query User query string
     * @param onChunk Callback for each token/chunk received
     * @param onDone Callback when streaming is complete with full response data
     * @param onError Callback for any errors
     */
    streamChat: async (
        query: string,
        onChunk: (content: string) => void,
        onDone?: (data: any) => void,
        onError?: (error: string) => void
    ) => {
        try {
            const response = await fetch(`${API_BASE_URL}/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, top_k: 5 }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            if (!response.body) {
                throw new Error('No response body');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.type === 'token' && data.content) {
                                onChunk(data.content);
                            } else if (data.type === 'done') {
                                if (onDone) onDone(data);
                            } else if (data.type === 'error') {
                                if (onError) onError(data.content);
                            }
                        } catch (e) {
                            console.error('Error parsing stream chunk:', e);
                        }
                    }
                }
            }
        } catch (err) {
            if (onError) onError(err instanceof Error ? err.message : String(err));
        }
    },

    /**
     * Standard non-streaming chat query.
     */
    queryChat: async (query: string): Promise<QueryResponse> => {
        const res = await fetch(`${API_BASE_URL}/chat/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, top_k: 5 }),
        });
        if (!res.ok) throw new Error(`Failed to query chat: ${res.statusText}`);
        return res.json();
    },

    /**
     * Get list of topics.
     */
    getTopics: async (limit: number = 50, offset: number = 0): Promise<TopicSummary[]> => {
        const res = await fetch(`${API_BASE_URL}/browse/topics?limit=${limit}&offset=${offset}`);
        if (!res.ok) throw new Error(`Failed to fetch topics: ${res.statusText}`);
        return res.json();
    },

    /**
     * Get specific topic details.
     */
    getTopic: async (id: string): Promise<TopicDetail> => {
        const res = await fetch(`${API_BASE_URL}/browse/topics/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch topic ${id}: ${res.statusText}`);
        return res.json();
    },

    /**
     * Get list of videos.
     */
    getVideos: async (limit: number = 20, offset: number = 0): Promise<VideoSummary[]> => {
        const res = await fetch(`${API_BASE_URL}/browse/videos?limit=${limit}&offset=${offset}`);
        if (!res.ok) throw new Error(`Failed to fetch videos: ${res.statusText}`);
        return res.json();
    },

    /**
     * Get specific video details.
     */
    getVideo: async (id: string): Promise<VideoDetail> => {
        const res = await fetch(`${API_BASE_URL}/browse/videos/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch video ${id}: ${res.statusText}`);
        return res.json();
    }
};

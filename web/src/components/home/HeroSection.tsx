"use client";

import { Video, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface HeroSectionProps {
    prompts: { text: string; icon: LucideIcon }[];
    onPromptClick: (text: string) => void;
}

export function HeroSection({ prompts, onPromptClick }: HeroSectionProps) {
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 py-12 md:py-24 px-4">

            {/* Header / Logo Group */}
            <div className="flex flex-col items-center text-center mb-12 space-y-8">

                {/* Logo with Glow */}
                <div className="relative group">
                    <div className="absolute inset-0 -m-4 bg-primary/20 blur-3xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-b from-zinc-800 to-zinc-950 border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden ring-1 ring-white/5">
                        <img
                            src="/logo.png"
                            alt="LanternSight"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4 max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                        LanternSight <span className="text-primary">Copilot</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto">
                        Ask deep questions. Get answers backed by evidence.
                    </p>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg y-5">
                    </p>
                </div>
            </div>

            {/* Prompts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {prompts.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => onPromptClick(item.text)}
                        className="group relative flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary/20 transition-all duration-300 text-left hover:scale-[1.01]"
                    >
                        {/* Icon Container */}
                        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 group-hover:text-primary group-hover:border-primary/30 transition-colors">
                            <item.icon size={18} />
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 pr-4">
                            <p className="text-sm font-medium text-muted-foreground group-hover:text-zinc-200 transition-colors line-clamp-2">
                                {item.text}
                            </p>
                        </div>

                        {/* Hover Arrow */}
                        <ArrowRight
                            size={16}
                            className="absolute right-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

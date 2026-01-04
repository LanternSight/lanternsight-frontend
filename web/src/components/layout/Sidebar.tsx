"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Compass, Video, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/SidebarContext";

interface SidebarProps {
    // Props removed, using context
}

const navItems = [
    { label: "New Chat", icon: Plus, href: "/new-chat", action: true }, // Special item
    { label: "Chat", icon: MessageSquare, href: "/" },
    { label: "Explore Topics", icon: Compass, href: "/topics" },
    { label: "Videos Database", icon: Video, href: "/videos" },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isOpen, toggle, isMobile } = useSidebar();

    const handleNewChat = () => {
        window.location.href = "/";
    };

    return (
        <aside
            className={cn(
                "relative z-40 h-full flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
                isOpen ? "w-[240px]" : "w-[60px]", // Reduced width
                isMobile && !isOpen && "w-0 overflow-hidden border-none"
            )}
        >
            {/* Header */}
            <div className={cn(
                "h-16 flex items-center px-3 border-b border-sidebar-border/50", // Reduced px
                "justify-center"
            )}>
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-2 py-4"> {/* Reduced px */}
                <div className="space-y-2">
                    {navItems.map((item) => {
                        const isAction = item.action;
                        // Special handling for New Chat
                        if (isAction) {
                            return (
                                <Button
                                    key={item.label}
                                    onClick={handleNewChat}
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start h-10 border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-4",
                                        !isOpen && "justify-center px-0"
                                    )}
                                >
                                    <item.icon size={18} className={cn(isOpen && "mr-2")} />
                                    {isOpen && <span>{item.label}</span>}
                                </Button>
                            );
                        }

                        const isActive = item.href === "/"
                            ? pathname === "/"
                            : pathname?.startsWith(item.href);

                        return (
                            <Link href={item.href} key={item.label} className="block">
                                <div className={cn(
                                    "flex items-center h-10 px-3 rounded-md transition-colors cursor-pointer text-sm font-medium",
                                    isOpen ? "gap-3" : "justify-center px-0",
                                    isActive
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                        : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                )}>
                                    <item.icon size={18} />
                                    {isOpen && <span>{item.label}</span>}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </ScrollArea>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-sidebar-border/50">
                <div className={cn(
                    "flex items-center rounded-lg transition-colors cursor-pointer hover:bg-sidebar-accent p-2",
                    isOpen ? "gap-3" : "justify-center"
                )}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner shrink-0">
                        LS
                    </div>
                    {isOpen && (
                        <div className="flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
                            <span className="text-sm font-semibold truncate text-sidebar-foreground">User Account</span>
                            <span className="text-[10px] text-muted-foreground truncate">Pro Plan</span>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}

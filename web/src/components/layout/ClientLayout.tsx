"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import { TooltipProvider } from "@/components/ui/tooltip";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <TooltipProvider>
            <SidebarProvider>
                <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden selection:bg-primary/30 dark">
                    {/* Persistent Sidebar */}
                    <Sidebar />

                    {/* Main Content Area */}
                    <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-background transition-all duration-300">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    );
}

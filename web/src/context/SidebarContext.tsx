"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
    isOpen: boolean;
    toggle: () => void;
    setIsOpen: (value: boolean) => void;
    isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Handle responsive behavior
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768; // md breakpoint
            setIsMobile(mobile);
            // Always force closed, or just don't touch it since default is false.
            if (mobile) {
                setIsOpen(false);
            }
        };

        // Initial check
        checkMobile();

        // Event listener
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const toggle = () => { }; // Disable toggle

    return (
        <SidebarContext.Provider value={{ isOpen, toggle, setIsOpen, isMobile }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}

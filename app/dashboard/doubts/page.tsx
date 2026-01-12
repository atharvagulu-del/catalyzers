"use client";

import { useState } from 'react';
import DoubtChatInterface from '@/components/doubts/DoubtChatInterface';
import DoubtSidebar from '@/components/doubts/DoubtSidebar';

export default function DoubtsPage() {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [resetKey, setResetKey] = useState(0);

    const handleSelectSession = (id: string | null) => {
        setSessionId(id);
        if (id === null) {
            setResetKey(prev => prev + 1);
        }
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] overflow-hidden bg-[#F8FAFC] dark:bg-transparent px-4 pb-4 md:px-6 md:pb-6 md:gap-6">
            {/* Sidebar Card - Floating with Round Corners */}
            <div className={`
                fixed inset-0 z-40 md:z-auto md:static w-full md:w-80 
                bg-[#fcfcfc] dark:bg-[#111111] 
                rounded-none md:rounded-[32px] md:shadow-sm md:border border-slate-200 dark:border-neutral-800 
                transition-transform duration-300 transform md:transform-none overflow-hidden
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <DoubtSidebar
                    activeId={sessionId}
                    onSelectSession={handleSelectSession}
                />
            </div>

            {/* Main Chat Card - Floating with Round Corners */}
            <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden 
                bg-white dark:bg-[#111111] 
                rounded-[24px] md:rounded-[32px] shadow-sm border border-slate-200 dark:border-neutral-800">
                <DoubtChatInterface
                    key={resetKey}
                    sessionId={sessionId}
                    onNewSession={() => {
                        setSessionId(null);
                        setResetKey(prev => prev + 1);
                    }}
                    onSessionCreated={setSessionId}
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                />
            </div>
        </div>
    );
}

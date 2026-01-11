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
        <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 px-0 md:px-0">
            {/* Sidebar Container */}
            <div className={`
                fixed inset-0 z-40 md:z-0 w-full md:static md:w-80 bg-[#fcfcfc] dark:bg-slate-900 border-r border-slate-300 dark:border-slate-700 transition-transform duration-300 transform
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <DoubtSidebar
                    activeId={sessionId}
                    onSelectSession={handleSelectSession}
                />
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative w-full h-full p-0 md:p-6 overflow-hidden">
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

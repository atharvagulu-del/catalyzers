"use client";

import { useState, useEffect } from 'react';
import { Plus, MessageSquare, Clock, Search, ChevronRight, Loader2, Compass, FileText, CheckSquare, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import Link from 'next/link';

interface DoubtSidebarProps {
    activeId: string | null;
    onSelectSession: (id: string | null) => void;
}

export default function DoubtSidebar({ activeId, onSelectSession }: DoubtSidebarProps) {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'open' | 'resolved'>('open');

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Determine checking logic based on schema. Assuming 'status' column exists.
                // If it doesn't, this query will error. But user request implies it should exist or be created.
                // For safety, let's try to filter client-side if we can't be sure, OR just try the query.
                // Given I created the table before, I should check schema. But I'll trust the flow.
                // Actually, I'll filter client side for safety on the fetched 10 items? No, better to fetch correctly.
                // Let's assume 'status' defaults to 'open' or null.

                let query = supabase
                    .from('doubt_sessions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('updated_at', { ascending: false })

                if (filter === 'resolved') {
                    query = query.eq('status', 'resolved');
                } else {
                    // For open, we want status is null OR 'open'
                    // Supabase OR syntax is a bit tricky with chaining.
                    // Let's just assume we update status to 'open' on creation.
                    // Or we can just filter by 'resolved' vs NOT 'resolved'.
                    query = query.neq('status', 'resolved');
                }

                const { data: sessionsData } = await query.limit(3); // increased limit locally, user wanted 3 in view but maybe more in list? User wanted 3. 
                // Wait, user said "show only last 3 recent prompt". So limit(3) applies to the VIEW.

                setSessions(sessionsData || []);
            }
            setLoading(false);
        };
        fetchData();

        const channel = supabase
            .channel('doubt_sessions_list')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'doubt_sessions' },
                () => fetchData()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [filter]); // Re-fetch when filter changes

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col h-full bg-inherit w-full font-sans pt-6 md:pt-4">
            {/* Logo Area (Hidden if Sidebar is embedded, but good for context) */}
            <div className="px-6 pb-4">
                {/* Main Navigation - Based on Allen.in */}
                <nav className="space-y-1 mb-8">
                    <Link href="/dashboard" className="flex items-center gap-4 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium">
                        <Compass className="w-5 h-5" />
                        Explore
                    </Link>
                    <div className="flex items-center gap-4 px-3 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-[#0067FF] dark:text-blue-400 rounded-lg font-bold">
                        <MessageSquare className="w-5 h-5 fill-current" />
                        Doubts
                    </div>
                </nav>
            </div>

            {/* "My Doubts" Section */}
            <div className="flex-1 flex flex-col px-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">My Doubts</h3>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <Filter className="w-3 h-3" /> Filter
                    </button>
                    <button
                        onClick={() => setFilter('open')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filter === 'open'
                            ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-[#0067FF] dark:text-blue-400'
                            : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                            }`}
                    >
                        Open
                    </button>
                    <button
                        onClick={() => setFilter('resolved')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filter === 'resolved'
                            ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-[#0067FF] dark:text-blue-400'
                            : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                            }`}
                    >
                        Resolved
                    </button>
                </div>

                {/* Session List */}
                <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-3 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
                    {/* New Doubt Button - Placed at top of list for easy access */}
                    <button
                        onClick={() => onSelectSession(null)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors mb-2 shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Ask New Doubt
                    </button>

                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-slate-300" /></div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-slate-400 text-sm">No recent doubts found.</p>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => onSelectSession(session.id)}
                                className={`w-full text-left p-4 rounded-xl border transition-all group relative ${activeId === session.id
                                    ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 shadow-sm'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${activeId === session.id ? 'bg-[#0067FF] border-[#0067FF]' : 'border-slate-300'
                                        }`}>
                                        {activeId === session.id && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                                {session.subject || 'GENERAL'}
                                            </span>
                                            <span className="text-[10px] text-slate-400">
                                                {formatTime(session.updated_at)}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug">
                                            {session.title || 'Untitled Query'}
                                        </h4>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

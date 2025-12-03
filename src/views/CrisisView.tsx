import { useState } from 'react';
import { Shield, Anchor as AnchorIcon, AlertTriangle, Play, ChevronRight } from 'lucide-react';
import { Memory, Profile } from '../types';
import { ScienceGuide } from '../components/ScienceGuide';

export const CrisisView = ({ memories, profile, setActiveTab }: { memories: Memory[], profile: Profile, setActiveTab: (t: any) => void }) => {
    const peakMemories = memories.filter(m => m.type === 'peak');
    const hasMemories = peakMemories.length > 0;
    const [viewingMemory, setViewingMemory] = useState<Memory | null>(null);

    return (
        <div className="h-full bg-slate-900 -m-4 sm:-m-6 p-4 sm:p-6 flex flex-col text-white animate-in fade-in duration-500">

            {viewingMemory ? (
                <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <Shield size={20} className="text-us-rose" /> Protocol Active
                        </h2>
                        <button onClick={() => setViewingMemory(null)} className="text-slate-400 hover:text-white">Close</button>
                    </div>

                    <div className="flex-1 bg-black rounded-2xl flex items-center justify-center relative overflow-hidden border border-slate-700 mb-6">
                        {viewingMemory.mediaType === 'video' && viewingMemory.mediaUrl ? (
                            <video src={viewingMemory.mediaUrl} controls autoPlay className="w-full h-full object-contain" />
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-xl font-medium leading-relaxed">"{viewingMemory.content}"</p>
                                <p className="mt-4 text-sm text-slate-400">- Recorded {new Date(viewingMemory.timestamp).toLocaleDateString()}</p>
                            </div>
                        )}
                    </div>

                    {viewingMemory.promptText && (
                        <div className="mb-4 text-center">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">In Response To</span>
                            <p className="text-sm text-slate-300 italic mt-1">"{viewingMemory.promptText}"</p>
                        </div>
                    )}

                    <div className="bg-us-rose/10 border border-us-rose/20 p-4 rounded-xl mb-4">
                        <h4 className="font-bold text-us-rose mb-1">Circuit Breaker</h4>
                        <p className="text-sm text-us-rose/80">
                            Breathe. Your partner is not the enemy. You are on the same team vs the problem.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <div className="flex justify-between items-start mb-6">
                            <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 text-slate-400 hover:text-white">
                                <ChevronRight size={16} className="rotate-180" /> Exit Crisis Mode
                            </button>
                            <button onClick={() => setActiveTab('profile')} className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white border border-slate-700 rounded-lg px-3 py-1.5 transition-colors">
                                Edit Protocol
                            </button>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Circuit Breaker</h1>
                        <p className="text-slate-400">Conflict de-escalation protocol.</p>
                    </div>

                    <ScienceGuide mode="crisis" />

                    <div className="space-y-6 overflow-y-auto flex-1 pb-10">
                        <div className="space-y-4">
                            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                                <div className="bg-slate-700/50 p-3 border-b border-slate-700">
                                    <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2"><AnchorIcon size={14} /> Core Anchors (Prioritize)</h4>
                                </div>
                                <div className="p-4">
                                    <ul className="space-y-2">
                                        {profile.priorities.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                                <span className="text-sm font-medium text-slate-200">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                                <div className="bg-slate-700/50 p-3 border-b border-slate-700">
                                    <h4 className="text-xs uppercase tracking-wider text-us-rose font-bold flex items-center gap-2"><AlertTriangle size={14} /> Kryptonite (Avoid)</h4>
                                </div>
                                <div className="p-4">
                                    <ul className="space-y-2">
                                        {profile.dislikes.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-us-rose shrink-0" />
                                                <span className="text-sm font-medium text-slate-200">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Deploy Artifacts</h3>
                            {!hasMemories ? (
                                <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-800 text-center">
                                    <p className="text-slate-400 text-sm">No Peak Artifacts recorded yet.</p>
                                    <button onClick={() => setActiveTab('harvest')} className="text-us-indigo text-sm mt-2 underline">Go record one now</button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    {peakMemories.slice(0, 3).map(m => (
                                        <button
                                            key={m.id}
                                            onClick={() => setViewingMemory(m)}
                                            className="flex items-center gap-4 p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all text-left group"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-us-amber/20 text-us-amber flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"><Play size={16} fill="currentColor" /></div>
                                            <div className="min-w-0">
                                                {m.promptText && <p className="text-[10px] text-slate-400 uppercase tracking-wide truncate mb-0.5">{m.promptText}</p>}
                                                <p className="font-medium text-slate-200 line-clamp-1">{m.content}</p>
                                                <p className="text-xs text-slate-500">{new Date(m.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

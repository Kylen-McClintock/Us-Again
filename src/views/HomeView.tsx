
import { Heart, Shield, Zap, Settings, ChevronRight, Anchor as AnchorIcon, Video, Mic, MessageSquare, BookOpen } from 'lucide-react';
import { Profile, Memory } from '../types';
import { Card } from '../components/Card';

export const HomeView = ({ profile, memories, setActiveTab }: { profile: Profile, memories: Memory[], setActiveTab: (t: any) => void }) => (
    <div className="h-full overflow-y-auto space-y-6 p-1 animate-in fade-in duration-500">
        <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
                <img src="/icon.png" alt="Us Again Logo" className="w-10 h-10 rounded-xl shadow-sm" />
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Us Again</h1>
                    <p className="text-slate-500 text-sm">Ready to connect, {profile.name}?</p>
                </div>
            </div>
            <button onClick={() => setActiveTab('profile')} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                <Settings size={20} className="text-slate-600" />
            </button>
        </header>

        {/* Main Actions */}
        <div className="grid grid-cols-2 gap-4">
            <div
                onClick={() => setActiveTab('harvest')}
                className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-md transition-all active:scale-95 h-40 group"
            >
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                    <Heart size={24} fill="currentColor" className="opacity-20" />
                    <Heart size={24} className="absolute" />
                </div>
                <div className="text-center">
                    <h3 className="font-bold text-amber-900">Harvest Mode</h3>
                    <p className="text-xs text-amber-700/70 mt-1">Capture Peak Moments</p>
                </div>
            </div>

            <div
                onClick={() => setActiveTab('crisis')}
                className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-md transition-all active:scale-95 h-40 group"
            >
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                    <Shield size={24} />
                </div>
                <div className="text-center">
                    <h3 className="font-bold text-white">Crisis Mode</h3>
                    <p className="text-xs text-slate-400 mt-1">Defuse Conflict</p>
                </div>
            </div>
        </div>

        {/* Daily Pulse Card */}
        <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100" onClick={() => setActiveTab('pulse')}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Zap size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Daily Pulse</h3>
                        <p className="text-sm text-slate-500">Log a small win from today</p>
                    </div>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
            </div>
        </Card>

        {/* Relationship Manual Card */}
        <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200" onClick={() => setActiveTab('profile')}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Relationship Manual</h3>
                        <p className="text-sm text-slate-500">Update your protocols & anchors</p>
                    </div>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
            </div>
        </Card>

        {/* Relationship Health / Recent Memories */}
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-800">Recent Artifacts</h2>
                <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded-full text-slate-600">{memories.length} stored</span>
            </div>

            {memories.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <AnchorIcon size={32} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 text-sm">No memories anchored yet.</p>
                    <button onClick={() => setActiveTab('harvest')} className="mt-2 text-indigo-600 text-sm font-medium hover:underline">Start a session</button>
                </div>
            ) : (
                <div className="space-y-3">
                    {memories.slice(0, 3).map(m => (
                        <div key={m.id} className="flex flex-col p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.type === 'peak' ? 'bg-amber-100 text-amber-600' :
                                    m.type === 'crisis_repair' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
                                    }`}>
                                    {m.mediaType === 'video' ? <Video size={14} /> : m.mediaType === 'audio' ? <Mic size={14} /> : <MessageSquare size={14} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    {m.promptText && (
                                        <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide line-clamp-1">{m.promptText}</p>
                                    )}
                                    <p className="text-sm font-medium text-slate-900 truncate">{m.content}</p>
                                    <p className="text-xs text-slate-500 mt-1">{new Date(m.timestamp).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

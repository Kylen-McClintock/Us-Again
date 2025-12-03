import { useState, useEffect } from 'react';
import { Home, Heart, Zap } from 'lucide-react';
import { Profile, Memory, Prompt } from './types';
import { DEFAULT_PROFILE, DEFAULT_PROMPTS } from './data';
import { HomeView } from './views/HomeView';
import { HarvestView } from './views/HarvestView';
import { CrisisView } from './views/CrisisView';
import { PulseView } from './views/PulseView';
import { ProfileView } from './views/ProfileView';
import { OnboardingView } from './views/OnboardingView';
import { AuthView } from './views/AuthView';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

import { AnimatePresence, motion } from 'framer-motion';

import { LoadingView } from './views/LoadingView';

export type ActiveTab = 'home' | 'pulse' | 'crisis' | 'profile' | 'harvest';

export default function App() {
    const [session, setSession] = useState<Session | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('home');
    const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
    const [memories, setMemories] = useState<Memory[]>([]);
    const [prompts, setPrompts] = useState<Prompt[]>(DEFAULT_PROMPTS);

    const [onboardingComplete, setOnboardingComplete] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Safety timeout to prevent infinite hanging
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        supabase.auth.getSession().then(({ data: { session } }) => {
            clearTimeout(timer);
            setSession(session);
            if (session) fetchData(session.user.id);
            else setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchData(session.user.id);
            else {
                setProfile(DEFAULT_PROFILE);
                setMemories([]);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchData = async (userId: string) => {
        setLoading(true);
        try {
            // Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileData) {
                // Merge with default profile to ensure all fields exist (since schema might be partial)
                setProfile({ ...DEFAULT_PROFILE, ...profileData });
                setOnboardingComplete(true);
            } else {
                // New user, no profile yet
                setOnboardingComplete(false);
            }

            // Fetch Memories
            const { data: memoriesData } = await supabase
                .from('memories')
                .select('*')
                .order('created_at', { ascending: false });

            if (memoriesData) {
                // Map DB fields to Memory type if needed
                const mappedMemories: Memory[] = memoriesData.map((m: any) => ({
                    id: m.id,
                    type: m.type,
                    content: m.content,
                    promptText: m.prompt_text,
                    timestamp: new Date(m.created_at).getTime(),
                    mediaType: m.media_type,
                    mediaUrl: m.media_url,
                    template: m.template
                }));
                setMemories(mappedMemories);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingView onComplete={() => { }} />;
    }

    if (!session) {
        return <AuthView />;
    }

    if (!onboardingComplete) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans text-slate-900 overflow-hidden">
                <div className="w-full h-[100dvh] sm:h-[800px] sm:max-w-md bg-white sm:rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col border-[6px] border-slate-900/5">
                    <OnboardingView profile={profile} setProfile={setProfile} onComplete={() => {
                        // Save profile to Supabase
                        supabase.from('profiles').upsert({
                            id: session.user.id,
                            name: profile.name,
                            streak: 0
                        }).then(() => {
                            setOnboardingComplete(true);
                        });
                    }} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans text-slate-900 overflow-hidden">
            <div className="w-full h-[100dvh] sm:h-[800px] sm:max-w-md bg-white sm:rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col bg-slate-50 border-[6px] border-slate-900/5">
                <div className={`h-8 w-full flex items-center justify-between px-6 text-xs font-medium z-20 ${activeTab === 'crisis' || (activeTab === 'harvest') ? 'text-white/50 bg-slate-900' : 'text-slate-400 bg-white'}`}>
                    <span>9:41</span>
                    <div className="flex gap-1">
                        <span className="w-4 h-4 bg-current rounded-full opacity-20"></span>
                        <span className="w-4 h-4 bg-current rounded-full opacity-20"></span>
                        <span className="w-4 h-4 bg-current rounded-full"></span>
                    </div>
                </div>

                <main className="flex-1 overflow-hidden relative bg-slate-50">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full w-full absolute inset-0"
                        >
                            {activeTab === 'home' && <HomeView profile={profile} memories={memories} setActiveTab={setActiveTab} />}
                            {activeTab === 'harvest' && <HarvestView prompts={prompts} memories={memories} setMemories={setMemories} setActiveTab={setActiveTab} />}
                            {activeTab === 'crisis' && <CrisisView memories={memories} profile={profile} setActiveTab={setActiveTab} />}
                            {activeTab === 'pulse' && <PulseView prompts={prompts} setActiveTab={setActiveTab} profile={profile} setProfile={setProfile} />}
                            {activeTab === 'profile' && <ProfileView profile={profile} setProfile={setProfile} prompts={prompts} setPrompts={setPrompts} setActiveTab={setActiveTab} />}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {activeTab !== 'harvest' && (
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
                        <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg shadow-slate-200/50 rounded-full px-6 py-3 flex items-center gap-8 pointer-events-auto">
                            <button onClick={() => setActiveTab('home')} className={`relative flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                                <motion.div whileTap={{ scale: 0.8 }}>
                                    <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
                                </motion.div>
                                {activeTab === 'home' && <motion.div layoutId="nav-dot" className="absolute -bottom-2 w-1 h-1 bg-slate-900 rounded-full" />}
                            </button>
                            <button onClick={() => setActiveTab('harvest')} className="relative flex flex-col items-center gap-1 transition-colors text-slate-400 hover:text-amber-600">
                                <motion.div whileTap={{ scale: 0.8 }}>
                                    <Heart size={24} strokeWidth={2} />
                                </motion.div>
                            </button>
                            <button onClick={() => setActiveTab('pulse')} className={`relative flex flex-col items-center gap-1 transition-colors ${activeTab === 'pulse' ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}>
                                <motion.div whileTap={{ scale: 0.8 }}>
                                    <Zap size={24} strokeWidth={activeTab === 'pulse' ? 2.5 : 2} />
                                </motion.div>
                                {activeTab === 'pulse' && <motion.div layoutId="nav-dot" className="absolute -bottom-2 w-1 h-1 bg-indigo-600 rounded-full" />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

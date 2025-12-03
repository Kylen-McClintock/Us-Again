import { useState } from 'react';
import { X, Check, Zap } from 'lucide-react';
import { Prompt, Profile } from '../types';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';
import { ScienceGuide } from '../components/ScienceGuide';

export const PulseView = ({ prompts, setActiveTab, profile, setProfile }: { prompts: Prompt[], setActiveTab: (t: any) => void, profile: Profile, setProfile: (p: Profile) => void }) => {
    const [entry, setEntry] = useState('');
    const [saved, setSaved] = useState(false);

    // Get today's daily prompt
    const dailyPrompt = prompts.find(p => p.category === 'daily') || prompts[0];

    const savePulse = async () => {
        if (!entry.trim()) return;

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // Save to Supabase
            await supabase.from('pulse_entries').insert({
                user_id: user.id,
                entry: entry,
                prompt_text: dailyPrompt.text
            });

            // Update streak in profile
            const newStreak = profile.streak + 1;
            await supabase.from('profiles').update({ streak: newStreak }).eq('id', user.id);

            setProfile({ ...profile, streak: newStreak, lastPulse: Date.now() });
        }

        setSaved(true);
        setTimeout(() => {
            setActiveTab('home');
            setSaved(false);
            setEntry('');
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <button onClick={() => setActiveTab('home')} className="p-2 hover:bg-slate-100 rounded-full">
                        <X size={20} />
                    </button>
                    <h2 className="text-xl font-bold">Daily Pulse</h2>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-us-amber/10 text-us-amber rounded-full border border-us-amber/20">
                    <Zap size={14} fill="currentColor" />
                    <span className="text-xs font-bold">{profile.streak} Day Streak</span>
                </div>
            </div>

            <ScienceGuide mode="pulse" />

            {!saved ? (
                <>
                    <div className="mb-6">
                        <p className="text-us-indigo font-medium text-sm mb-2">Today's Check-in</p>
                        <h3 className="text-xl font-medium text-slate-800">{dailyPrompt.text}</h3>
                    </div>
                    <textarea value={entry} onChange={(e) => setEntry(e.target.value)} className="flex-1 w-full p-4 bg-us-indigo/5 border border-us-indigo/20 rounded-xl focus:ring-2 focus:ring-us-indigo/50 focus:border-transparent outline-none resize-none mb-6" placeholder="Type your thought here..." />
                    <Button onClick={savePulse} disabled={!entry.trim()} variant="secondary" className="w-full justify-center">Log Pulse</Button>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Check size={32} /></div>
                    <h3 className="text-xl font-bold text-slate-900">Pulse Logged</h3>
                    <p className="text-slate-500">Feeding the relationship model...</p>
                    <div className="mt-4 px-4 py-2 bg-us-amber/10 text-us-amber rounded-lg text-sm font-bold animate-pulse">
                        🔥 {profile.streak} Day Streak!
                    </div>
                </div>
            )}
        </div>
    );
};

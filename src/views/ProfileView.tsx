import { useState } from 'react';
import { ChevronRight, Link as LinkIcon, Anchor as AnchorIcon, Heart, AlertTriangle, Plus } from 'lucide-react';
import { Profile, Prompt } from '../types';

export const ProfileView = ({ profile, setProfile, prompts, setPrompts, setActiveTab }: { profile: Profile, setProfile: (p: Profile) => void, prompts: Prompt[], setPrompts: (p: Prompt[]) => void, setActiveTab: (t: any) => void }) => {
    const [editMode, setEditMode] = useState(false);
    const [tempProfile, setTempProfile] = useState(profile);
    const [newPromptText, setNewPromptText] = useState('');
    const [newPromptCategory, setNewPromptCategory] = useState<'peak' | 'crisis'>('peak');

    const handleSave = () => {
        setProfile(tempProfile);
        setEditMode(false);
    };

    const addPrompt = () => {
        if (!newPromptText.trim()) return;
        const newPrompt: Prompt = {
            id: Date.now().toString(),
            text: newPromptText,
            category: newPromptCategory,
            isCustom: true
        };
        setPrompts([...prompts, newPrompt]);
        setNewPromptText('');
    };

    return (
        <div className="h-full overflow-y-auto animate-in fade-in duration-300 pb-20">
            <div className="flex items-center gap-3 mb-6 sticky top-0 bg-white z-10 py-2 border-b border-slate-100">
                <button onClick={() => setActiveTab('home')} className="p-2 hover:bg-slate-100 rounded-full">
                    <ChevronRight size={20} className="rotate-180" />
                </button>
                <h2 className="text-xl font-bold">Relationship Manual</h2>
            </div>

            <div className="mb-6 p-4 bg-us-indigo/5 rounded-xl border border-us-indigo/20 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-us-indigo flex items-center gap-2"><LinkIcon size={16} /> Pair Partner Device</h3>
                    <p className="text-xs text-us-indigo/80 mt-1 max-w-[200px]">Sync for crisis alerts. (Sessions are best done on one shared device).</p>
                </div>
                <button className="px-3 py-1.5 bg-us-indigo text-white text-xs font-bold rounded-lg opacity-50 cursor-not-allowed">Coming Soon</button>
            </div>

            <div className={`mb-8 p-4 rounded-xl border flex items-center justify-between transition-colors bg-purple-50 border-purple-100`}>
                <div>
                    <h3 className={`font-semibold text-purple-900`}>Expanded State Support</h3>
                    <p className={`text-xs text-purple-700 max-w-[200px]`}>Unlock templates for MDMA/Psychedelic integration.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Active</span>
                    <div className={`w-4 h-4 bg-purple-600 rounded-full`} />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Partner Profile</h3>
                    <button onClick={() => editMode ? handleSave() : setEditMode(true)} className="text-sm font-medium text-us-indigo">{editMode ? 'Save Changes' : 'Edit'}</button>
                </div>

                {['priorities', 'likes', 'dislikes'].map((field) => (
                    <div key={field} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            {field === 'priorities' && <AnchorIcon size={16} className="text-slate-400" />}
                            {field === 'likes' && <Heart size={16} className="text-slate-400" />}
                            {field === 'dislikes' && <AlertTriangle size={16} className="text-slate-400" />}
                            <h4 className="font-semibold capitalize text-slate-700">{field}</h4>
                        </div>
                        {editMode ? (
                            <textarea className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={(tempProfile as any)[field].join('\n')} onChange={(e) => setTempProfile({ ...tempProfile, [field]: e.target.value.split('\n') })} rows={4} />
                        ) : (
                            <ul className="list-disc list-inside space-y-1">{(profile as any)[field].map((item: string, i: number) => <li key={i} className="text-sm text-slate-600">{item}</li>)}</ul>
                        )}
                        <p className="text-xs text-slate-400 mt-2 italic">{field === 'dislikes' ? 'Triggers & "Do Nots" during conflict.' : field === 'priorities' ? 'Core values to anchor on.' : 'Actions that bring joy.'}</p>
                    </div>
                ))}

                <div className="mt-10 pt-6 border-t border-slate-100">
                    <h3 className="font-bold text-lg mb-4">Prompt Library</h3>
                    <div className="flex gap-2 mb-4">
                        <input type="text" placeholder="Add a custom prompt..." className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm" value={newPromptText} onChange={(e) => setNewPromptText(e.target.value)} />
                        <select className="border border-slate-200 rounded-lg px-2 text-sm bg-white" value={newPromptCategory} onChange={(e) => setNewPromptCategory(e.target.value as any)}>
                            <option value="peak">Peak</option>
                            <option value="daily">Daily</option>
                            <option value="crisis">Crisis</option>
                            {profile.expandedStateEnabled && <option value="expanded_peak">Expanded</option>}
                        </select>
                        <button onClick={addPrompt} className="bg-slate-900 text-white p-2 rounded-lg"><Plus size={20} /></button>
                    </div>
                    <div className="space-y-2">
                        {prompts.filter(p => p.isCustom).map(p => (
                            <div key={p.id} className="p-3 bg-slate-50 rounded-lg text-sm flex justify-between items-start gap-2"><span>{p.text}</span><span className="text-xs font-bold uppercase text-slate-400">{p.category}</span></div>
                        ))}
                        {prompts.filter(p => p.isCustom).length === 0 && <p className="text-sm text-slate-400 italic">No custom prompts added yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

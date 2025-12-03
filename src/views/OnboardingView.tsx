import { useState } from 'react';
import { ChevronRight, Heart, Shield, Zap, Check } from 'lucide-react';
import { Profile } from '../types';
import { Button } from '../components/Button';

export const OnboardingView = ({ profile, setProfile, onComplete }: { profile: Profile, setProfile: (p: Profile) => void, onComplete: () => void }) => {
    const [step, setStep] = useState(0);
    const [name, setName] = useState(profile.name === 'You' ? '' : profile.name);
    const [partnerName, setPartnerName] = useState(profile.partnerName === 'Partner' ? '' : profile.partnerName);

    const handleNext = () => {
        if (step === 0) setStep(1);
        else if (step === 1) {
            if (name && partnerName) {
                setProfile({ ...profile, name, partnerName });
                setStep(2);
            }
        } else if (step === 2) {
            onComplete();
        }
    };

    return (
        <div className="h-full flex flex-col bg-white animate-in fade-in duration-500">
            {/* Progress Bar */}
            <div className="h-1 bg-slate-100 w-full">
                <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${((step + 1) / 3) * 100}%` }} />
            </div>

            <div className="flex-1 p-8 flex flex-col justify-center">
                {step === 0 && (
                    <div className="space-y-6 text-center animate-in slide-in-from-right-8 duration-300">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600 mb-4">
                            <Heart size={40} fill="currentColor" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Welcome to Us Again</h1>
                        <p className="text-slate-500 leading-relaxed">
                            A shared vault for your relationship. Capture peak moments, navigate conflict, and build a living history.
                        </p>
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><Heart size={20} /></div>
                                <span className="text-xs font-bold text-slate-400">Harvest</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-slate-100 rounded-xl text-slate-600"><Shield size={20} /></div>
                                <span className="text-xs font-bold text-slate-400">Crisis</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><Zap size={20} /></div>
                                <span className="text-xs font-bold text-slate-400">Pulse</span>
                            </div>
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Who is this for?</h2>
                            <p className="text-slate-500">Let's personalize your experience.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Your Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                    placeholder="e.g. Alex"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Partner's Name</label>
                                <input
                                    type="text"
                                    value={partnerName}
                                    onChange={(e) => setPartnerName(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                    placeholder="e.g. Sam"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                        <div className="text-center mb-4">
                            <h2 className="text-2xl font-bold text-slate-900">One Last Thing</h2>
                            <p className="text-slate-500">We've pre-loaded some example anchors.</p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-500"><Check size={16} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">Priorities</h4>
                                    <p className="text-xs text-slate-500">Example: "Honesty & Transparency"</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-rose-500"><Check size={16} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">Kryptonite</h4>
                                    <p className="text-xs text-slate-500">Example: "Sarcasm during fights"</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-xs text-slate-400 px-4">
                            You can edit these in the <strong>Relationship Manual</strong> later to match your specific needs.
                        </p>
                    </div>
                )}
            </div>

            <div className="p-6">
                <Button onClick={handleNext} variant="primary" className="w-full justify-center py-4" disabled={step === 1 && (!name || !partnerName)}>
                    {step === 2 ? "Get Started" : "Continue"} <ChevronRight size={20} />
                </Button>
            </div>
        </div>
    );
};

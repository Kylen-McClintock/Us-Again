import { useState } from 'react';
import { Brain, Shield, Zap, ChevronUp, ChevronDown } from 'lucide-react';

export const ScienceGuide = ({ mode }: { mode: 'harvest' | 'crisis' | 'pulse' }) => {
    const [isOpen, setIsOpen] = useState(false);

    const content = {
        harvest: {
            title: "State-Dependent Memory",
            text: "When you are angry, your brain physically cannot access memories stored when you were happy. This is called 'State-Dependent Memory.' We capture artifacts here to bridge that gap later.",
            icon: <Brain size={16} />
        },
        crisis: {
            title: "The Amygdala Hijack",
            text: "During conflict, your 'fight or flight' center (amygdala) takes over, shutting down empathy. Logic doesn't work here. You need a sensory 'Pattern Interrupt'—a voice, a face, or a clear list—to bring your rational brain back online.",
            icon: <Shield size={16} />
        },
        pulse: {
            title: "The 5:1 Ratio",
            text: "Dr. John Gottman found that stable relationships need 5 positive interactions for every 1 negative interaction. 'Pulse' helps you log these micro-deposits to build an emotional buffer.",
            icon: <Zap size={16} />
        }
    };

    const info = content[mode];

    return (
        <div className="mb-6 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden transition-all">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-100"
            >
                <div className="flex items-center gap-2">
                    {info.icon}
                    <span>Why This Works</span>
                </div>
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isOpen && (
                <div className="p-4 bg-white border-t border-slate-100 text-sm text-slate-600 leading-relaxed animate-in slide-in-from-top-2">
                    <strong className="block text-slate-800 mb-1">{info.title}</strong>
                    {info.text}
                </div>
            )}
        </div>
    );
};

import { useState } from 'react';
import { Info, ChevronUp, ChevronDown } from 'lucide-react';

export const JourneyPhaseGuide = ({ phase }: { phase: 'prep' | 'entry' | 'peak' | 'landing' }) => {
    const [isOpen, setIsOpen] = useState(false);

    const content = {
        prep: {
            title: "Preparation & Safety",
            points: [
                "Set & Setting: Ensure you are in a safe, private space where you won't be disturbed.",
                "Hydration: Have water available, but don't over-drink. (Approx 500ml/hour if active).",
                "Intention: Discuss why you are doing this. Is it for fun, repair, or deep bonding?",
                "Agreements: Agree that anything said tonight is said in love. No judgment."
            ]
        },
        entry: {
            title: "The Come Up",
            points: [
                "Anxiety is Normal: You might feel jittery or cold as the state shifts. This is temporary.",
                "Breathe: If overwhelmed, focus on long exhales.",
                "No Rush: Don't try to force the feeling. Let it arrive.",
                "Focus: Turn phones off (except for this app). Put on music that calms you."
            ]
        },
        peak: {
            title: "The Peak Experience",
            points: [
                "The Window of Tolerance: Your empathy is heightened. You can discuss difficult topics without the usual defensive pain.",
                "Follow the Feeling: If a topic feels 'hot' or important, stay with it.",
                "Touch: Physical contact releases oxytocin, amplifying the connection.",
                "Capture: Use this app to record the breakthroughs. You think you'll remember them forever. You won't."
            ]
        },
        landing: {
            title: "Integration & Landing",
            points: [
                "The comedown can feel fragile. Be gentle with each other.",
                "Harvest: Write down or record the 3 biggest insights before sleep.",
                "Aftercare: Plan a slow morning tomorrow. Good food, rest.",
                "The Blues: You may feel low serotonin 24-48 hours later. This is chemical, not relational. It will pass."
            ]
        }
    };

    const data = content[phase];

    return (
        <div className="mb-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left"
            >
                <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                    <Info size={18} />
                    <span>Guide: {data.title}</span>
                </div>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isOpen && (
                <div className="p-4 pt-0 text-sm text-slate-700 animate-in slide-in-from-top-2">
                    <ul className="space-y-2 list-disc list-inside">
                        {data.points.map((p, i) => (
                            <li key={i} className="leading-relaxed">{p}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

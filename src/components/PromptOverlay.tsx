
import { Eye, Wind, MessageSquare } from 'lucide-react';
import { Prompt } from '../types';

export const PromptOverlay = ({ prompt }: { prompt: Prompt }) => (
    <div className="absolute top-0 left-0 right-0 p-6 pt-16 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-20 pointer-events-none">
        {prompt.activityType && (
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/20 backdrop-blur-md text-white/90 text-[10px] font-bold uppercase tracking-wider mb-3">
                {prompt.activityType === 'action' ? <Eye size={10} /> : prompt.activityType === 'sensory' ? <Wind size={10} /> : <MessageSquare size={10} />}
                {prompt.activityType}
            </div>
        )}
        <h3 className="text-xl sm:text-2xl font-medium leading-relaxed text-white drop-shadow-md">
            "{prompt.text}"
        </h3>
    </div>
);

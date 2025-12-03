import { useState, useEffect, useRef } from 'react';
import {
    Heart,
    X,
    Plus,
    Check,
    ChevronRight,
    Thermometer,
    BookOpen,
    Sun,
    Zap,
    Moon,
    Eye,
    Wind,
    MessageSquare,
    RefreshCw,
    AlertTriangle,
    Camera,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import { Prompt, Memory } from '../types';
import { DEFAULT_PROMPTS, RECOMMENDED_COUNTS, QUOTES } from '../data';
import { Button } from '../components/Button';
import { PromptOverlay } from '../components/PromptOverlay';
import { JourneyPhaseGuide } from '../components/JourneyPhaseGuide';
import { ScienceGuide } from '../components/ScienceGuide';
import { LoadingView } from './LoadingView';
import { supabase } from '../lib/supabase';

export const HarvestView = ({ prompts, memories, setMemories, setActiveTab }: { prompts: Prompt[], memories: Memory[], setMemories: (m: Memory[]) => void, setActiveTab: (t: any) => void }) => {
    // Mode States
    const [step, setStep] = useState<'template' | 'expanded_prep' | 'expanded_journey' | 'session'>('template');
    const [sessionState, setSessionState] = useState<'prompt' | 'record' | 'save' | 'success'>('prompt');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [expandedPhase, setExpandedPhase] = useState<'entry' | 'peak' | 'landing'>('entry');
    const [showIntro, setShowIntro] = useState(false);

    // Progress State (Session Counts)
    const [sessionCounts, setSessionCounts] = useState({ entry: 0, peak: 0, landing: 0 });

    // Data States
    const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
    const [textEntry, setTextEntry] = useState('');
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [recordingTimer, setRecordingTimer] = useState(0);
    const [isRecording, setIsRecording] = useState(false);

    // Hardware
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [cameraError, setCameraError] = useState(false);

    const templates = [
        { id: 'date', name: 'Date Night', icon: <Heart size={20} />, color: 'bg-rose-50 text-rose-700 border-rose-100' },
        { id: 'deep', name: 'Deep Dive', icon: <BookOpen size={20} />, color: 'bg-sky-50 text-sky-700 border-sky-100' },
        { id: 'expanded', name: 'Expanded State', icon: <Thermometer size={20} />, color: 'bg-purple-50 text-purple-700 border-purple-100' }
    ];

    // Timer Logic
    useEffect(() => {
        let interval: any;
        if (isRecording) {
            interval = setInterval(() => setRecordingTimer(t => t + 1), 1000);
        } else {
            setRecordingTimer(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    // Helpers
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const refreshPrompt = (categoryOverride?: string) => {
        let category = selectedTemplate === 'expanded' ? `expanded_${expandedPhase}` : 'peak';
        if (selectedTemplate === 'deep') category = 'deep_dive';
        if (categoryOverride) category = categoryOverride;

        // Filter for category AND exclude current prompt to ensure rotation
        const filteredPrompts = prompts.filter(p => p.category === category && p.id !== currentPrompt?.id);
        const allCategoryPrompts = prompts.filter(p => p.category === category);

        if (filteredPrompts.length > 0) {
            const random = filteredPrompts[Math.floor(Math.random() * filteredPrompts.length)];
            setCurrentPrompt(random);
        } else if (allCategoryPrompts.length > 0) {
            // If only 1 prompt exists (or we exhausted all), just pick a random one from full list
            const random = allCategoryPrompts[Math.floor(Math.random() * allCategoryPrompts.length)];
            setCurrentPrompt(random);
        } else {
            setCurrentPrompt(DEFAULT_PROMPTS[0]);
        }
    }

    const startSession = () => {
        setSessionState('prompt');
        setStep('session');
        setShowIntro(true);
        refreshPrompt();
    };

    const initializeCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
            setCameraError(false);
        } catch (err) {
            setCameraError(true);
        }
    };

    const startRecording = async () => {
        setRecordedChunks([]);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) videoRef.current.srcObject = stream;

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) setRecordedChunks((prev) => [...prev, event.data]);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            setCameraError(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            const stream = videoRef.current?.srcObject as MediaStream;
            stream?.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
        setSessionState('save');
    };

    const saveMemory = async () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });

        // Upload to Supabase Storage
        const fileName = `${Date.now()}.webm`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('memories')
            .upload(fileName, blob);

        if (uploadError) {
            alert(`Upload Error: ${uploadError.message}`);
            console.error('Upload Error:', uploadError);
            return;
        }

        let publicUrl = '';
        if (uploadData) {
            const { data: { publicUrl: url } } = supabase.storage
                .from('memories')
                .getPublicUrl(fileName);
            publicUrl = url;
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: memoryData, error: dbError } = await supabase
                .from('memories')
                .insert({
                    user_id: user.id,
                    type: 'peak',
                    content: textEntry || `Response captured`,
                    prompt_text: currentPrompt?.text,
                    media_type: recordedChunks.length > 0 ? 'video' : 'text',
                    media_url: publicUrl,
                    template: selectedTemplate
                })
                .select()
                .single();

            if (dbError) {
                alert(`Database Error: ${dbError.message}`);
                console.error('Database Error:', dbError);
            }

            if (memoryData) {
                const newMemory: Memory = {
                    id: memoryData.id,
                    type: memoryData.type as any,
                    content: memoryData.content,
                    promptText: memoryData.prompt_text,
                    timestamp: new Date(memoryData.created_at).getTime(),
                    mediaType: memoryData.media_type as any,
                    mediaUrl: memoryData.media_url,
                    template: memoryData.template
                };
                setMemories([newMemory, ...memories]);
            }
        }

        // Update counts for progress tracking
        if (selectedTemplate === 'expanded') {
            setSessionCounts(prev => ({ ...prev, [expandedPhase]: prev[expandedPhase as keyof typeof prev] + 1 }));
        }

        setRecordedChunks([]);
        setTextEntry('');
        setSessionState('success');
    };

    useEffect(() => {
        if (step === 'session' && sessionState === 'record') {
            initializeCamera();
        }
        return () => {
            const stream = videoRef.current?.srcObject as MediaStream;
            stream?.getTracks().forEach(track => track.stop());
        }
    }, [step, sessionState]);

    const handleNextStage = () => {
        if (expandedPhase === 'entry') setExpandedPhase('peak');
        else if (expandedPhase === 'peak') setExpandedPhase('landing');
        else {
            // End of journey
            setStep('expanded_journey');
            return;
        }
        startSession();
    };

    const phaseProgress = selectedTemplate === 'expanded' ? sessionCounts[expandedPhase as keyof typeof sessionCounts] : 0;
    const phaseGoal = selectedTemplate === 'expanded' ? RECOMMENDED_COUNTS[expandedPhase as keyof typeof RECOMMENDED_COUNTS] : 0;
    const isPhaseComplete = selectedTemplate === 'expanded' && phaseProgress >= phaseGoal;

    // RENDER logic
    if (step === 'template') return (
        <div className="h-full overflow-y-auto space-y-4 animate-in slide-in-from-right-4 duration-300 p-1">
            <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setActiveTab('home')} className="p-2 hover:bg-slate-100 rounded-full">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold">Harvest Mode</h2>
            </div>
            <ScienceGuide mode="harvest" />
            <p className="text-slate-600 mb-4">Choose the context for this session.</p>
            {templates.map(t => (
                <div
                    key={t.id}
                    onClick={() => {
                        setSelectedTemplate(t.id);
                        if (t.id === 'expanded') setStep('expanded_prep');
                        else startSession();
                    }}
                    className={`p-4 border rounded-xl flex items-center gap-4 cursor-pointer hover:brightness-95 transition-all ${t.color}`}
                >
                    <div className="p-2 bg-white/50 rounded-full">{t.icon}</div>
                    <span className="font-semibold">{t.name}</span>
                </div>
            ))}
            <div
                onClick={() => setActiveTab('profile')}
                className="p-4 border border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 text-slate-500"
            >
                <Plus size={16} />
                <span className="font-medium text-sm">Add Custom Prompts</span>
            </div>
        </div>
    );

    if (step === 'expanded_prep') return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto animate-in slide-in-from-right-4 duration-300 p-1">
            <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setStep('template')} className="p-2 hover:bg-slate-100 rounded-full">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold">Preparation</h2>
            </div>
            <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <h3 className="font-bold text-purple-900 text-lg mb-2">Before You Begin</h3>
                <p className="text-purple-800 text-sm leading-relaxed">
                    This mode is designed for couples in high-openness states (whether through deep meditation, breathwork, or MDMA).
                    Preparation is 80% of the outcome.
                </p>
            </div>
            <JourneyPhaseGuide phase="prep" />
            <div className="mt-4 space-y-3">
                <div className="p-4 border border-slate-200 rounded-xl flex items-start gap-3">
                    <Check size={20} className="text-slate-300 mt-0.5" />
                    <div><h4 className="font-semibold text-slate-700">Set & Setting</h4><p className="text-xs text-slate-500">Is the room comfortable? Is the music ready? Are phones off?</p></div>
                </div>
                <div className="p-4 border border-slate-200 rounded-xl flex items-start gap-3">
                    <Check size={20} className="text-slate-300 mt-0.5" />
                    <div><h4 className="font-semibold text-slate-700">Agreements</h4><p className="text-xs text-slate-500">"We are here to connect. We will pause if overwhelmed."</p></div>
                </div>
            </div>
            <div className="mt-auto py-6">
                <Button onClick={() => setStep('expanded_journey')} variant="purple" className="w-full justify-center">
                    Enter Journey Mode <ChevronRight size={18} />
                </Button>
            </div>
        </div>
    );

    if (step === 'expanded_journey') return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto animate-in slide-in-from-right-4 duration-300 p-1">
            <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setStep('template')} className="p-2 hover:bg-slate-100 rounded-full">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold">Journey Hub</h2>
            </div>
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-purple-50 p-6 rounded-2xl mb-6 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-30 -mr-10 -mt-10 animate-pulse"></div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2 relative z-10">
                    <Thermometer size={18} /> Expanded State
                </h3>
                <p className="text-purple-200 text-sm relative z-10">Navigate your experience phase by phase.</p>
            </div>

            <div className="space-y-4 pb-6">
                {/* Phase 1: Preparation (formerly Entry) */}
                <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${expandedPhase === 'entry' ? 'border-slate-300 shadow-md' : 'border-slate-100 opacity-70'}`}>
                    <div
                        onClick={() => setExpandedPhase('entry')}
                        className={`p-4 flex justify-between items-center cursor-pointer ${expandedPhase === 'entry' ? 'bg-slate-50' : 'bg-white'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${expandedPhase === 'entry' ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-400'}`}>
                                <Sun size={18} />
                            </div>
                            <div>
                                <h4 className={`font-bold ${expandedPhase === 'entry' ? 'text-slate-900' : 'text-slate-500'}`}>Preparation</h4>
                                <p className="text-xs text-slate-400">0 - 60 mins</p>
                            </div>
                        </div>
                        {expandedPhase === 'entry' ? <ChevronRight size={20} className="rotate-90 text-slate-400" /> : <ChevronRight size={20} className="text-slate-300" />}
                    </div>

                    {expandedPhase === 'entry' && (
                        <div className="p-4 pt-0 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top-2">
                            <JourneyPhaseGuide phase="entry" />
                            <div className="mt-4 flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sessionCounts.entry >= 2 ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                                    {sessionCounts.entry}/2 Completed
                                </span>
                            </div>
                            <button onClick={startSession} className="w-full py-3 bg-white border border-slate-200 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-100 text-slate-700 font-medium transition-colors shadow-sm">
                                {sessionCounts.entry >= 2 ? "Continue Preparation" : "Open Preparation Prompts"} <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Phase 2: Peak */}
                <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${expandedPhase === 'peak' ? 'border-purple-300 shadow-md ring-1 ring-purple-100' : 'border-slate-100 opacity-70'}`}>
                    <div
                        onClick={() => setExpandedPhase('peak')}
                        className={`p-4 flex justify-between items-center cursor-pointer ${expandedPhase === 'peak' ? 'bg-purple-50' : 'bg-white'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${expandedPhase === 'peak' ? 'bg-purple-200 text-purple-700' : 'bg-slate-100 text-slate-400'}`}>
                                <Zap size={18} />
                            </div>
                            <div>
                                <h4 className={`font-bold ${expandedPhase === 'peak' ? 'text-purple-900' : 'text-slate-500'}`}>Peak</h4>
                                <p className="text-xs text-slate-400">1 - 4 hours</p>
                            </div>
                        </div>
                        {expandedPhase === 'peak' ? <ChevronRight size={20} className="rotate-90 text-purple-400" /> : <ChevronRight size={20} className="text-slate-300" />}
                    </div>

                    {expandedPhase === 'peak' && (
                        <div className="p-4 pt-0 bg-purple-50 border-t border-purple-100 animate-in slide-in-from-top-2">
                            <JourneyPhaseGuide phase="peak" />
                            <div className="mt-4 flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">Progress</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sessionCounts.peak >= 3 ? 'bg-purple-200 text-purple-800' : 'bg-white/50 text-purple-600'}`}>
                                    {sessionCounts.peak}/3 Recommended
                                </span>
                            </div>
                            <button onClick={startSession} className="w-full py-3 bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 font-medium transition-colors shadow-sm">
                                {sessionCounts.peak > 0 ? "Continue Peak" : "Start Peak Connection"} <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Phase 3: Integration (formerly Landing) */}
                <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${expandedPhase === 'landing' ? 'border-indigo-300 shadow-md' : 'border-slate-100 opacity-70'}`}>
                    <div
                        onClick={() => setExpandedPhase('landing')}
                        className={`p-4 flex justify-between items-center cursor-pointer ${expandedPhase === 'landing' ? 'bg-indigo-50' : 'bg-white'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${expandedPhase === 'landing' ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
                                <Moon size={18} />
                            </div>
                            <div>
                                <h4 className={`font-bold ${expandedPhase === 'landing' ? 'text-indigo-900' : 'text-slate-500'}`}>Integration</h4>
                                <p className="text-xs text-slate-400">4+ hours</p>
                            </div>
                        </div>
                        {expandedPhase === 'landing' ? <ChevronRight size={20} className="rotate-90 text-indigo-400" /> : <ChevronRight size={20} className="text-slate-300" />}
                    </div>

                    {expandedPhase === 'landing' && (
                        <div className="p-4 pt-0 bg-indigo-50 border-t border-indigo-100 animate-in slide-in-from-top-2">
                            <JourneyPhaseGuide phase="landing" />
                            <div className="mt-4 flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Progress</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sessionCounts.landing >= 2 ? 'bg-indigo-200 text-indigo-800' : 'bg-white/50 text-indigo-600'}`}>
                                    {sessionCounts.landing}/2 Recommended
                                </span>
                            </div>
                            <button onClick={startSession} className="w-full py-3 bg-white border border-indigo-200 text-indigo-700 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-50 font-medium transition-colors shadow-sm">
                                Open Integration Prompts <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (step === 'session') return (
        <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col text-white animate-in fade-in duration-300">
            {showIntro && (
                <div className="absolute inset-0 z-[60] bg-slate-50">
                    <LoadingView duration={2000} onComplete={() => setShowIntro(false)} />
                </div>
            )}
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-30">
                <button onClick={() => {
                    if (selectedTemplate === 'expanded') setStep('expanded_journey');
                    else setStep('template');
                }} className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white/80 hover:bg-black/40">
                    <X size={20} />
                </button>

                {/* Progress Bar for Expanded State */}
                {selectedTemplate === 'expanded' ? (
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-purple-500/30 backdrop-blur-md rounded-full border border-purple-500/20">
                            {expandedPhase} Phase
                        </span>
                        <div className="flex gap-1 mt-1">
                            {[...Array(phaseGoal)].map((_, i) => (
                                <div key={i} className={`w-3 h-1 rounded-full ${i < phaseProgress ? 'bg-green-400' : 'bg-white/20'}`} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-white/10 backdrop-blur-md rounded-full">
                        Session Active
                    </span>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative flex flex-col">
                {sessionState === 'prompt' && currentPrompt && (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                        <div>
                            {currentPrompt.activityType && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                                    {currentPrompt.activityType === 'action' ? <Eye size={12} /> : currentPrompt.activityType === 'sensory' ? <Wind size={12} /> : <MessageSquare size={12} />}
                                    {currentPrompt.activityType}
                                </div>
                            )}
                            <h3 className="text-2xl sm:text-3xl font-medium leading-relaxed drop-shadow-lg">"{currentPrompt.text}"</h3>
                        </div>

                        <div className="flex flex-col gap-3 w-full max-w-xs">
                            <button
                                onClick={() => refreshPrompt()}
                                className="w-full py-3 text-sm text-slate-400 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center gap-2 transition-all"
                            >
                                <RefreshCw size={14} /> Shuffle Prompt
                            </button>
                        </div>

                        <div className="mt-8 max-w-sm mx-auto opacity-60">
                            <p className="text-xs text-slate-400 italic font-serif">"{QUOTES[Math.floor(Math.random() * QUOTES.length)]}"</p>
                        </div>
                    </div>
                )}

                {sessionState === 'record' && currentPrompt && (
                    <div className="flex-1 relative bg-black">
                        {cameraError ? (
                            <div className="absolute inset-0 flex items-center justify-center"><div className="text-center p-6"><AlertTriangle size={48} className="mx-auto mb-4 text-amber-500" /><p>Camera not accessible.</p></div></div>
                        ) : (
                            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-90" />
                        )}
                        <PromptOverlay prompt={currentPrompt} />
                    </div>
                )}

                {sessionState === 'save' && currentPrompt && (
                    <div className="flex-1 flex flex-col p-6 pt-24 bg-gradient-to-br from-slate-800 to-slate-900">
                        <div className="mb-8">
                            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Reflecting On</div>
                            <h3 className="text-xl font-medium text-white/90">"{currentPrompt.text}"</h3>
                        </div>
                        <textarea
                            value={textEntry}
                            onChange={(e) => setTextEntry(e.target.value)}
                            className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                            placeholder="Add a text note (optional)..."
                            autoFocus
                        />
                    </div>
                )}

                {sessionState === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6">
                            <Check size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Artifact Anchored</h3>
                        <p className="text-slate-400 mb-8 max-w-xs mx-auto">This moment is now stored safely in your shared vault.</p>

                        <div className="w-full space-y-3">
                            {/* Phase Transition Logic */}
                            {isPhaseComplete ? (
                                <>
                                    <div className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-xl mb-6">
                                        <div className="flex items-center justify-center gap-2 text-purple-300 mb-2 font-bold text-sm uppercase tracking-wide">
                                            <Sparkles size={14} /> Recommendation
                                        </div>
                                        <p className="text-sm text-white/90 leading-relaxed">
                                            You have completed the recommended depth for this phase. You can transition now, or continue exploring if you're in the flow.
                                        </p>
                                    </div>
                                    <Button onClick={handleNextStage} variant="inverse" className="w-full justify-center py-4 bg-purple-600 hover:bg-purple-500 text-white border-none shadow-purple-900/50 mb-3">
                                        {expandedPhase === 'entry' ? "Transition to Peak" : expandedPhase === 'peak' ? "Begin Landing" : "Complete Journey"} <ArrowRight size={18} />
                                    </Button>
                                    <Button onClick={startSession} variant="white" className="w-full justify-center py-4 text-white border-white/20 hover:bg-white/10">
                                        Stay & Explore Deeper
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={startSession} variant="inverse" className="w-full justify-center py-4">
                                    Next Prompt <ArrowRight size={18} />
                                </Button>
                            )}

                            <button onClick={() => {
                                if (selectedTemplate === 'expanded') setStep('expanded_journey');
                                else setStep('template');
                            }} className="w-full py-4 text-slate-400 hover:text-white font-medium mt-4"
                            >
                                Return to Hub
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            {sessionState !== 'success' && (
                <div className="h-32 bg-black/40 backdrop-blur-md flex items-center justify-center relative">
                    {sessionState === 'prompt' && (
                        <div className="w-full px-8 space-y-3">
                            <button onClick={() => setSessionState('record')} className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                                <Camera size={20} /> Answer with Video
                            </button>
                            <button onClick={() => setSessionState('save')} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all">
                                <MessageSquare size={20} /> Answer with Text
                            </button>
                        </div>
                    )}
                    {sessionState === 'record' && (
                        <div className="flex flex-col items-center gap-4 w-full">
                            <div className="text-2xl font-mono font-light tracking-widest drop-shadow-md">{formatTime(recordingTimer)}</div>
                            {!isRecording ? (
                                <button onClick={startRecording} className="w-16 h-16 rounded-full bg-red-500 border-4 border-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg"><div className="w-4 h-4 bg-white rounded-sm"></div></button>
                            ) : (
                                <button onClick={stopRecording} className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg"><div className="w-6 h-6 bg-red-500 rounded-sm"></div></button>
                            )}
                        </div>
                    )}
                    {sessionState === 'save' && (
                        <div className="w-full px-8">
                            <Button onClick={saveMemory} variant="inverse" className="w-full justify-center py-4">
                                <Check size={20} /> Save Artifact
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

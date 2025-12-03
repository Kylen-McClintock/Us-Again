import { Prompt, Profile } from './types';

export const DEFAULT_PROMPTS: Prompt[] = [
    // --- PEAK / DATE NIGHT (General Connection) ---
    { id: 'p1', text: "Look at your partner and tell them exactly what you admire about them right now.", category: 'peak', isCustom: false },
    { id: 'p2', text: "What is a promise you want to make to your future frustrated selves?", category: 'peak', isCustom: false },
    { id: 'p3', text: "What is the 'safe word' or phrase that brings you back to this feeling?", category: 'peak', isCustom: false },
    { id: 'p4', text: "Share a memory from our relationship that defines 'us' for you.", category: 'peak', isCustom: false },
    { id: 'p5', text: "What is one thing I do that makes you feel safest?", category: 'peak', isCustom: false },
    { id: 'p6', text: "When did you feel most proud of me this year?", category: 'peak', isCustom: false },
    { id: 'p7', text: "What is an adventure we haven't taken yet that you want to plan?", category: 'peak', isCustom: false },
    { id: 'p8', text: "What is the funniest thing we've ever experienced together?", category: 'peak', isCustom: false },
    { id: 'p9', text: "If we were characters in a book, what would our 'superpower' as a couple be?", category: 'peak', isCustom: false },
    { id: 'p10', text: "What is one small ritual we used to do that you'd like to bring back?", category: 'peak', isCustom: false },
    { id: 'p11', text: "Describe a time you saw me and thought 'Wow'.", category: 'peak', isCustom: false },
    { id: 'p12', text: "What is your favorite non-sexual way that I touch you?", category: 'peak', isCustom: false },

    // --- DEEP DIVE (Vulnerability & Growth) ---
    { id: 'dd1', text: "What is a resentment you are holding that feels too small to mention?", category: 'deep_dive', isCustom: false },
    { id: 'dd2', text: "How have I changed in the last 5 years that you appreciate?", category: 'deep_dive', isCustom: false },
    { id: 'dd3', text: "What is a fear about 'us' that keeps you up at night?", category: 'deep_dive', isCustom: false },
    { id: 'dd4', text: "If we could automate one conflict we have repeatedly, what would it be?", category: 'deep_dive', isCustom: false },
    { id: 'dd5', text: "What part of yourself do you feel you have to hide from me?", category: 'deep_dive', isCustom: false },
    { id: 'dd6', text: "When do you feel most lonely in our relationship?", category: 'deep_dive', isCustom: false },
    { id: 'dd7', text: "What is one thing you need from me but are afraid to ask for?", category: 'deep_dive', isCustom: false },
    { id: 'dd8', text: "What does 'support' look like to you when you are stressed?", category: 'deep_dive', isCustom: false },
    { id: 'dd9', text: "Is there an apology you are still waiting for?", category: 'deep_dive', isCustom: false },
    { id: 'dd10', text: "What childhood pattern are you trying hardest not to repeat with us?", category: 'deep_dive', isCustom: false },

    // --- EXPANDED: ENTRY (Setting the Container) ---
    { id: 'e1', text: "What is your highest intention for our connection tonight?", category: 'expanded_entry', isCustom: false },
    { id: 'e2', text: "Is there a fear you are holding about tonight that you can voice now to release?", category: 'expanded_entry', isCustom: false },
    { id: 'e3', text: "Create a shared 'container'. What rules do we need to feel totally free?", category: 'expanded_entry', isCustom: false },
    { id: 'e4', text: "What mask am I wearing right now that I can take off?", category: 'expanded_entry', isCustom: false },
    { id: 'e5', text: "Check your body. Where are you holding tension? Can we breathe into it?", category: 'expanded_entry', isCustom: false, activityType: 'sensory' },
    { id: 'e6', text: "If this evening could heal one thing between us, what would it be?", category: 'expanded_entry', isCustom: false },
    { id: 'e7', text: "Look at me. Without speaking, let your face show me how much you want to be here.", category: 'expanded_entry', isCustom: false, activityType: 'action' },
    { id: 'e8', text: "What distraction (mental or physical) do you need to put in a box for the next 4 hours?", category: 'expanded_entry', isCustom: false },
    { id: 'e9', text: "Hold hands. Sync your breathing for 10 breaths. No words.", category: 'expanded_entry', isCustom: false, activityType: 'action' },

    // --- EXPANDED: PEAK (Deep Connection & Empathy) ---
    { id: 'ep1', text: "Look into my eyes for 60 seconds without speaking. Then say the first word that comes to mind.", category: 'expanded_peak', isCustom: false, activityType: 'action' },
    { id: 'ep2', text: "Sensory Check: Describe the texture of your love right now using non-emotional words (colors, temperatures, materials).", category: 'expanded_peak', isCustom: false, activityType: 'sensory' },
    { id: 'ep3', text: "If you could physically take a piece of my pain away, what would it look like?", category: 'expanded_peak', isCustom: false },
    { id: 'ep4', text: "Tell me a truth you have been too afraid to say because you didn't want to hurt me.", category: 'expanded_peak', isCustom: false },
    { id: 'ep5', text: "Touch my hand. Imagine sending a beam of light from your heart to mine through that touch.", category: 'expanded_peak', isCustom: false, activityType: 'action' },
    { id: 'ep6', text: "What is a childhood wound you feel is healing right now?", category: 'expanded_peak', isCustom: false },
    { id: 'ep7', text: "Visualize our relationship as a landscape. Describe it to me.", category: 'expanded_peak', isCustom: false, activityType: 'sensory' },
    { id: 'ep8', text: "What is a part of me you used to judge, but now you understand?", category: 'expanded_peak', isCustom: false },
    { id: 'ep9', text: "If we stripped away our jobs, house, and roles, who are we to each other right now?", category: 'expanded_peak', isCustom: false },
    { id: 'ep10', text: "What do you forgive yourself for in this moment?", category: 'expanded_peak', isCustom: false },
    { id: 'ep11', text: "Lie back to back. Feel the support. What does it feel like to be upheld?", category: 'expanded_peak', isCustom: false, activityType: 'action' },
    { id: 'ep12', text: "Describe the energy between us right now as a color.", category: 'expanded_peak', isCustom: false, activityType: 'sensory' },
    { id: 'ep13', text: "What is the most beautiful thing about my soul that you can see right now?", category: 'expanded_peak', isCustom: false },

    // --- EXPANDED: LANDING (Integration & Future) ---
    { id: 'el1', text: "What is one insight from tonight that we must not forget on Tuesday morning?", category: 'expanded_landing', isCustom: false },
    { id: 'el2', text: "How do you want to change our morning routine based on what we felt tonight?", category: 'expanded_landing', isCustom: false },
    { id: 'el3', text: "Record a message to your 'Sober Self' about how much you love your partner.", category: 'expanded_landing', isCustom: false },
    { id: 'el4', text: "What is one behavior I want to leave behind in this trip?", category: 'expanded_landing', isCustom: false },
    { id: 'el5', text: "What is one concrete action we will take this week to honor this connection?", category: 'expanded_landing', isCustom: false },
    { id: 'el6', text: "How can I support your 'landing' over the next 24 hours?", category: 'expanded_landing', isCustom: false },
    { id: 'el7', text: "What was the hardest moment of tonight, and what did we learn from it?", category: 'expanded_landing', isCustom: false },
    { id: 'el8', text: "Make a wish for our relationship for the next 3 months.", category: 'expanded_landing', isCustom: false },

    // --- DAILY PULSE ---
    { id: 'd1', text: "Describe a moment this week where you felt truly seen by your partner.", category: 'daily', isCustom: false },
    { id: 'd2', text: "What is one small thing your partner did that made your life easier today?", category: 'daily', isCustom: false },
    { id: 'd3', text: "What is a stressor you are carrying that you haven't shared yet?", category: 'daily', isCustom: false },
    { id: 'd4', text: "What is one thing you are looking forward to doing with me?", category: 'daily', isCustom: false },
    { id: 'd5', text: "How are your energy levels today (1-10)?", category: 'daily', isCustom: false },

    // --- CRISIS / REPAIR ---
    { id: 'c1', text: "If we are fighting right now, what is the one thing I need to remember?", category: 'crisis', isCustom: false },
    { id: 'c2', text: "Remind me: We are on the same team. What is our shared goal?", category: 'crisis', isCustom: false },
    { id: 'c3', text: "Record a calm voice note: 'I love you, even when I'm angry.'", category: 'crisis', isCustom: false },
    { id: 'c4', text: "What is your best quality that I sometimes forget when we argue?", category: 'crisis', isCustom: false },
];

export const RECOMMENDED_COUNTS = {
    entry: 2,
    peak: 3,
    landing: 2
};

export const DEFAULT_PROFILE: Profile = {
    name: "You",
    partnerName: "Partner",
    priorities: ["Honesty & Transparency", "Quality Time (No phones)", "Financial Safety"],
    likes: ["Morning coffee together", "Back scratches", "Planning trips"],
    dislikes: ["Being interrupted", "Unwashed dishes left out", "Sarcasm during fights", "Walking away without saying when you'll return"],
    expandedStateEnabled: true,
    streak: 0,
    lastPulse: 0,
};

export const QUOTES = [
    "Love is not about how much you say 'I love you', but how much you prove that it's true.",
    "The best thing to hold onto in life is each other.",
    "A successful marriage requires falling in love many times, always with the same person.",
    "In the end, we only regret the chances we didn't take.",
    "To be fully seen by somebody, then, and be loved anyhow - this is a human offering that can border on miraculous.",
    "Love recognizes no barriers. It jumps hurdles, leaps fences, penetrates walls to arrive at its destination full of hope.",
    "The simple lack of her is more to me than others' presence.",
    "We are most alive when we're in love.",
    "There is no remedy for love but to love more.",
    "Love is composed of a single soul inhabiting two bodies."
];

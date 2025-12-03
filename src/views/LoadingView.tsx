import { useEffect } from 'react';
import { motion } from 'framer-motion';

export const LoadingView = ({ onComplete, duration = 3000 }: { onComplete: () => void, duration?: number }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, duration);
        return () => clearTimeout(timer);
    }, [onComplete, duration]);

    return (
        <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50">
            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Left Circle (Partner 1) */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: -20, opacity: 0.8 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute w-32 h-32 rounded-full bg-rose-400 mix-blend-multiply filter blur-xl"
                />

                {/* Right Circle (Partner 2) */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 20, opacity: 0.8 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute w-32 h-32 rounded-full bg-indigo-400 mix-blend-multiply filter blur-xl"
                />

                {/* Logo & Text Fade In */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="relative z-10 text-center flex flex-col items-center gap-3"
                >
                    <img src="/icon.png" alt="Us Again Logo" className="w-16 h-16 rounded-2xl shadow-lg mb-2" />
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Us Again</h1>
                </motion.div>
            </div>
        </div>
    );
};

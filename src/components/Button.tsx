import React from 'react';

export const Button = ({ children, onClick, variant = 'primary', className = "", disabled = false }: { children: React.ReactNode, onClick?: () => void, variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'purple' | 'inverse' | 'white', className?: string, disabled?: boolean }) => {
    const variants = {
        primary: "bg-slate-900 text-white hover:bg-slate-800",
        secondary: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
        danger: "bg-rose-500 text-white hover:bg-rose-600",
        outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
        ghost: "text-slate-600 hover:bg-slate-100",
        purple: "bg-purple-600 text-white hover:bg-purple-700",
        inverse: "bg-white text-slate-900 hover:bg-slate-100 shadow-lg font-bold border border-slate-100",
        white: "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md"
    };
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
};

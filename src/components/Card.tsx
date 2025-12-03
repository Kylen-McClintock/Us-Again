import { motion } from 'framer-motion';

export const Card = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`bg-white rounded-xl shadow-sm border border-slate-100 p-4 ${className}`}
    >
        {children}
    </motion.div>
);

import React from 'react';
import { motion } from 'framer-motion';

const ChatLayout = ({ children }) => {
    return (
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // smooth ease-out-quart ish
                className="
          w-full max-w-4xl h-[85vh] 
          bg-white/40 backdrop-blur-xl 
          border border-white/50 
          rounded-[3rem] 
          shadow-[0_8px_32px_rgba(31,38,135,0.1)]
          flex flex-col overflow-hidden relative
        "
            >
                {children}
            </motion.div>
        </div>
    );
};

export default ChatLayout;

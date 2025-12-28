import React from 'react';
import { motion } from 'framer-motion';

const ChatBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-white">
            {/* Subtle Noise Texture */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Blue Orb */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full bg-[#bae6fd] blur-3xl opacity-40 mix-blend-multiply"
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -100, 50, 0],
                    scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{ top: '10%', left: '10%' }}
            />

            {/* Purple Orb */}
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full bg-[#e9d5ff] blur-3xl opacity-40 mix-blend-multiply"
                animate={{
                    x: [0, -80, 40, 0],
                    y: [0, 120, -60, 0],
                    scale: [1, 1.2, 0.8, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{ bottom: '10%', right: '10%' }}
            />

            {/* Another Blue Orb for balance */}
            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full bg-[#bae6fd] blur-3xl opacity-30 mix-blend-multiply"
                animate={{
                    x: [0, 60, -30, 0],
                    y: [0, -60, 30, 0],
                    scale: [1, 0.9, 1.1, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{ top: '40%', left: '60%' }}
            />
        </div>
    );
};

export default ChatBackground;

import React, { useEffect, useRef, useState } from 'react';
import { Send, Bot, Sparkles, Loader2, Download, Clock } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import ChatBackground from './ChatBackground';
import ChatLayout from './ChatLayout';
import MessageBubble from './MessageBubble';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

const ChatInterface = () => {
    const { messages, isLoading, input, setInput, sendMessage, thinkingText } = useChat();
    const messagesEndRef = useRef(null);

    // Session Timer State
    const [duration, setDuration] = useState(0);
    const [isActive, setIsActive] = useState(false);

    // Start timer on first message
    useEffect(() => {
        if (messages.length > 0 && !isActive) {
            setIsActive(true);
        }
    }, [messages, isActive]);

    // Timer Logic
    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setDuration((seconds) => seconds + 1);
            }, 1000);
        } else if (!isActive && duration !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, duration]);

    // Format Duration (MM:SS)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, thinkingText]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Download Transcript Logic
    const handleDownload = () => {
        if (messages.length === 0) {
            toast.error('No messages to download!');
            return;
        }

        const transcription = messages.map(msg =>
            `[${msg.timestamp}] ${msg.role === 'user' ? 'User' : 'MyDoc'}: ${msg.content}`
        ).join('\n\n');

        const blob = new Blob([transcription], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Medical_Consultation_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Transcript downloaded!');
    };

    return (
        <>
            <Toaster position="top-center" />
            <ChatBackground />
            <ChatLayout>
                {/* Header */}
                <header className="px-6 py-5 border-b border-white/40 flex items-center justify-between backdrop-blur-sm sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-tr from-sky-400 to-violet-500 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-500">
                                MyDoc
                            </h1>
                            <p className="text-xs text-slate-400 font-medium tracking-wide">AI Medical Companion</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-4">
                        {/* Timer */}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${isActive ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                            <Clock size={14} className={isActive ? 'animate-pulse' : ''} />
                            <span className="text-xs font-mono font-medium">{formatTime(duration)}</span>
                        </div>

                        {/* Download Button */}
                        <button
                            onClick={handleDownload}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Download Transcript"
                        >
                            <Download size={20} />
                        </button>
                    </div>
                </header>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
                    <AnimatePresence initial={false}>
                        {messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center h-[60%] text-slate-300"
                            >
                                <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                    <Bot size={40} className="text-slate-300" />
                                </div>
                                <p className="font-light text-lg">How can I help you today?</p>
                            </motion.div>
                        )}

                        {messages.map((msg, index) => (
                            <MessageBubble
                                key={index}
                                role={msg.role}
                                content={msg.content}
                                timestamp={msg.timestamp}
                            />
                        ))}
                    </AnimatePresence>

                    {/* Typing Indicator & Thinking State */}
                    {isLoading && (
                        <div className="ml-2 space-y-2">
                            {/* Dynamic Thinking Pill */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium border border-blue-100 shadow-sm animate-pulse"
                            >
                                <Sparkles size={10} />
                                <span>{thinkingText}</span>
                            </motion.div>

                            {/* Dots */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex gap-2 items-center text-slate-400"
                            >
                                <div className="text-xs font-medium mr-2">MyDoc is typing</div>
                                <div className="flex gap-1">
                                    <motion.span
                                        className="w-1.5 h-1.5 bg-sky-400 rounded-full"
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                    />
                                    <motion.span
                                        className="w-1.5 h-1.5 bg-violet-400 rounded-full"
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                    />
                                    <motion.span
                                        className="w-1.5 h-1.5 bg-sky-400 rounded-full"
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                    />
                                </div>
                            </motion.div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Floating Capsule Input */}
                <div className="p-6 relative">
                    <div className="max-w-3xl mx-auto relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-200 to-violet-200 rounded-full opacity-30 group-focus-within:opacity-70 transition duration-500 blur"></div>

                        <div className="relative flex items-center bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white p-1.5 hover:shadow-lg transition-shadow duration-300">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your health question..."
                                disabled={isLoading}
                                className="flex-1 bg-transparent px-5 py-3 text-slate-600 placeholder:text-slate-300 focus:outline-none text-sm font-medium"
                            />

                            <motion.button
                                whileHover={{ rotate: 10, scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={sendMessage}
                                disabled={isLoading || !input.trim()}
                                className="p-3 bg-gradient-to-tr from-sky-400 to-violet-500 text-white rounded-full shadow-md disabled:opacity-50 disabled:shadow-none transition-all"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </motion.button>
                        </div>

                        <p className="text-center text-[10px] text-slate-300 mt-3 font-light tracking-wide">
                            AI responses generated by Groq (Llama 3.3). Generated content may be inaccurate.
                        </p>
                    </div>
                </div>
            </ChatLayout>
        </>
    );
};

export default ChatInterface;

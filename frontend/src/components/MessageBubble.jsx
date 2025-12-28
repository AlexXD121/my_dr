import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const MessageBubble = ({ role, content, timestamp }) => {
    const isUser = role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, x: isUser ? 50 : -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25
            }}
            className={cn(
                "flex gap-3 max-w-[85%] md:max-w-[70%] mb-4",
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
        >
            {/* Avatar */}
            <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
                isUser ? "bg-gradient-to-tr from-sky-400 to-violet-500 text-white" : "bg-white border border-blue-50 text-blue-500"
            )}>
                {isUser ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Bubble */}
            <div className={cn(
                "p-4 shadow-sm text-sm leading-relaxed overflow-hidden",
                isUser
                    ? "bg-gradient-to-tr from-sky-400 to-violet-500 text-white rounded-2xl rounded-br-none"
                    : "bg-white/80 backdrop-blur-md border border-blue-50 text-slate-700 rounded-2xl rounded-bl-none"
            )}>
                {role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0 text-slate-700 dark:prose-invert">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                ) : (
                    <p className="whitespace-pre-wrap break-words">{content}</p>
                )}

                <span className={cn(
                    "text-[10px] block mt-1 opacity-70 text-right font-medium",
                    isUser ? "text-blue-50" : "text-slate-400"
                )}>
                    {timestamp}
                </span>
            </div>
        </motion.div>
    );
};

export default MessageBubble;

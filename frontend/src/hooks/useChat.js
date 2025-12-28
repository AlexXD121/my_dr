import { useState, useEffect } from 'react';

export const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const [thinkingText, setThinkingText] = useState('');

    const thinkingMessages = [
        'Analyzing symptoms...',
        'Searching medical knowledge base...',
        'Verifying drug interactions...',
        'Formulating response...'
    ];

    useEffect(() => {
        let interval;
        if (isLoading) {
            let index = 0;
            setThinkingText(thinkingMessages[0]);
            interval = setInterval(() => {
                index = (index + 1) % thinkingMessages.length;
                setThinkingText(thinkingMessages[index]);
            }, 1500);
        } else {
            setThinkingText('');
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input, timestamp: new Date().toLocaleTimeString() };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: messages.map(m => ({ role: m.role, content: m.content }))
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response');
            }

            const data = await response.json();

            const aiMessage = {
                role: 'assistant',
                content: data.response,
                timestamp: new Date(data.timestamp).toLocaleTimeString()
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage = {
                role: 'assistant',
                content: "Sorry, I'm having trouble connecting right now. Please try again.",
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        setMessages,
        isLoading,
        input,
        setInput,
        sendMessage,
        thinkingText
    };
};

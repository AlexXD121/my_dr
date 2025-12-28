import { useState } from 'react';

export const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');

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
        isLoading,
        input,
        setInput,
        sendMessage,
    };
};

import React, { useState, useEffect, useRef } from 'react';
import { type Chat } from '@google/genai';
import { type ChatMessage } from '../types';
import { startMedicalChat } from '../services/geminiService';
import Spinner from './ui/Spinner';

const AIChat: React.FC = () => {
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Initialize chat session on component mount
    useEffect(() => {
        const session = startMedicalChat();
        setChatSession(session);
        setMessages([{
            role: 'model',
            content: 'Xin chào! Tôi là trợ lý y tế AI của bạn. Bạn có câu hỏi nào về sức khỏe không? Tôi ở đây để giúp cung cấp thông tin.'
        }]);
    }, []);

    // Auto-scroll to the bottom of the chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chatSession) return;

        const userMessage: ChatMessage = { role: 'user', content: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await chatSession.sendMessage({ message: userInput });
            const modelMessage: ChatMessage = { role: 'model', content: response.text };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
            const errorMessage: ChatMessage = { role: 'model', content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="p-4 border-b dark:border-gray-700 flex items-center space-x-3">
                <SparklesIcon />
                <h2 className="text-xl font-bold">Trò chuyện với AI Y tế</h2>
            </div>
            <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <ChatMessageBubble key={index} message={msg} />
                ))}
                {isLoading && <ChatMessageBubble message={{ role: 'model', content: '' }} isLoading={true} />}
            </div>
            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Nhập câu hỏi của bạn ở đây..."
                        className="flex-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !userInput.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Spinner /> : <SendIcon />}
                    </button>
                </form>
            </div>
        </div>
    );
};

const ChatMessageBubble: React.FC<{ message: ChatMessage; isLoading?: boolean }> = ({ message, isLoading = false }) => {
    const isModel = message.role === 'model';

    // A simple markdown-like formatter for bold text and list items
    const formatContent = (text: string) => {
        return text.split('\n').map((line, i) => {
            if (line.startsWith('***')) {
                 return <p key={i} className="text-sm font-semibold mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">{line.replace(/\*\*\*/g, '')}</p>
            }
             if (line.startsWith('* ')) {
                return <li key={i} className="ml-5 list-disc">{line.substring(2)}</li>;
            }
            if (line.match(/^\d+\./)) {
                return <li key={i} className="ml-5 list-decimal">{line.substring(line.indexOf('.') + 1)}</li>
            }
            if (line.startsWith('**')) {
                return <p key={i} className="font-bold mt-2">{line.replace(/\*\*/g, '')}</p>;
            }
            return <p key={i}>{line}</p>;
        });
    };
    
    return (
        <div className={`flex items-end gap-2 ${!isModel ? 'justify-end' : ''}`}>
            {isModel && <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0"><SparklesIcon small/></div>}
            <div className={`max-w-xl p-3 rounded-2xl ${isModel ? 'bg-gray-200 dark:bg-gray-700 rounded-bl-none' : 'bg-blue-500 text-white rounded-br-none'}`}>
                 {isLoading ? (
                    <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                    </div>
                 ) : (
                    <div className="text-sm prose dark:prose-invert max-w-none">{formatContent(message.content)}</div>
                 )}
            </div>
        </div>
    );
};


const SparklesIcon: React.FC<{small?: boolean}> = ({ small = false }) => <svg className={small ? "w-5 h-5 text-gray-300" : "w-8 h-8 text-blue-500"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4 4 4-4 5.293-5.293a1 1 0 011.414 0L21 12m-5-9l2.293 2.293a1 1 0 010 1.414l-2.293 2.293" /></svg>;
const SendIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;

export default AIChat;

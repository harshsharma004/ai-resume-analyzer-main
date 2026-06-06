import {type FormEvent, useEffect, useRef, useState} from 'react'
import Navbar from "~/components/Navbar";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";

export const meta = () => {
    return [
        { title: 'CareerForge AI | Career Coach' },
        { name: 'description', content: 'Chat with your AI Career Coach' },
    ];
};

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

const CareerCoach = () => {
    const { auth, isLoading, ai } = usePuterStore();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', content: 'Hello! I am your CareerForge AI Career Coach. How can I help you with your career goals, resume, or interview prep today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate('/auth?next=/career-coach');
    }, [isLoading, auth.isAuthenticated, navigate]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMessage = input.trim();
        setInput('');
        
        const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setIsTyping(true);

        try {
            // Puter AI chat uses previous messages for context
            const response: any = await ai.chat(newMessages);
            
            if (response && response.message) {
                const aiMessageContent = typeof response.message.content === 'string'
                    ? response.message.content
                    : response.message.content[0].text;
                    
                setMessages([...newMessages, { role: 'assistant', content: aiMessageContent }]);
            } else {
                setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        }
        
        setIsTyping(false);
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex flex-col">
            <Navbar />

            <section className="main-section flex-grow flex flex-col">
                <div className="page-heading py-8 flex-shrink-0">
                    <h1>AI Career Coach</h1>
                    <h2>Get personalized advice, interview tips, and career guidance.</h2>
                </div>

                <div className="w-full max-w-[1000px] mx-auto mb-8 px-4 flex-grow flex flex-col">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-grow h-[600px] max-h-[70vh]">
                        
                        {/* Chat History */}
                        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div 
                                        className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                                            msg.role === 'user' 
                                                ? 'bg-secondary text-white rounded-tr-none' 
                                                : 'bg-gray-50 text-dark-200 border border-gray-100 rounded-tl-none'
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-none p-4 flex gap-1 items-center">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                            <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask anything about your career..."
                                    className="flex-grow px-6 py-4 rounded-xl border border-gray-200 focus:outline-accent shadow-inner text-sm"
                                    disabled={isTyping}
                                />
                                <button 
                                    type="submit" 
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-2 top-2 bottom-2 bg-primary text-white px-6 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50 transition-colors"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default CareerCoach

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faWandMagicSparkles, faLightbulb, faCode, faPenNib, faUser } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Assistant = () => {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const suggestions = [
        {
            title: "Analyze Spending",
            description: "How can I reduce my monthly grocery expenses?",
            icon: faLightbulb
        },
        {
            title: "Plan Budget",
            description: "Create a 50/30/20 budget plan for $4000/month",
            icon: faPenNib
        },
        {
            title: "Investment Ideas",
            description: "What are some low-risk investment options for a beginner?",
            icon: faWandMagicSparkles
        },
        {
            title: "Tax Saving",
            description: "How to maximize tax savings this year?",
            icon: faCode
        }
    ];

    const handleSend = async (overrideText = null) => {
        const textToSend = overrideText || inputText;
        if (!textToSend.trim() || isLoading) return;

        const userMessage = { role: 'user', content: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_ASSISTANT_URL}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: textToSend }),
            });
            const data = await response.json();

            let assistantMessageContent = "Sorry, I couldn't understand that.";
            if (data && data.reply) {
                assistantMessageContent = data.reply;
            }

            const aiMessage = { role: 'assistant', content: assistantMessageContent };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);
            const errorMessage = { role: 'assistant', content: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSuggestionClick = (description) => {
        handleSend(description);
    };

    const hasMessages = messages.length > 0;

    return (
        <div className="flex flex-col h-screen md:ml-[7rem] bg-slate-50 text-gray-800 font-sans overflow-hidden">

            <div className={`flex-1 flex flex-col w-full mx-auto px-4 ${hasMessages ? 'justify-between' : 'justify-center'} overflow-hidden`}>

                {/* Welcome Section - conditionally shown and centered */}
                <div className={`flex flex-col items-center justify-center w-full transition-all duration-700 ease-in-out transform ${!hasMessages ? 'opacity-100 scale-100 max-h-[800px] pb-8' : 'opacity-0 scale-95 max-h-0 overflow-hidden'}`}>
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center shadow-lg shadow-blue-100 border border-blue-100 mt-[-10vh]">
                        <FontAwesomeIcon icon={faWandMagicSparkles} className="text-2xl text-blue-600" />
                    </div>

                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-center text-gray-900 mt-6">
                        How can I help you with your finances today?
                    </h1>

                    {/* Suggestions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mt-8">
                        {suggestions.map((item, index) => (
                            <div
                                key={index}
                                className="group p-4 rounded-xl border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-200 hover:shadow-md cursor-pointer transition-all duration-300 ease-out flex flex-col gap-2"
                                onClick={() => handleSuggestionClick(item.description)}
                            >
                                <div className="flex items-center gap-3 text-gray-700 font-medium group-hover:text-blue-700 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                                        <FontAwesomeIcon icon={item.icon} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                    {item.title}
                                </div>
                                <div className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                                    {item.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Messages Area - shown when chat starts */}
                <div className={`w-full max-w-4xl mx-auto flex flex-col overflow-y-auto transition-all duration-700 ${hasMessages ? 'flex-1 opacity-100 pt-8 pb-4 space-y-8' : 'opacity-0 h-0 overflow-hidden'}`}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-4 md:gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 mt-1 shadow-sm">
                                    <FontAwesomeIcon icon={faWandMagicSparkles} className="text-blue-600 text-sm md:text-base" />
                                </div>
                            )}
                            <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-md' : 'bg-white border border-gray-200 text-gray-800 shadow-sm rounded-tl-none'}`}>
                                {msg.role === 'user' ? (
                                    <div className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content}</div>
                                ) : (
                                    <div className="prose prose-sm md:prose-base prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-a:text-blue-600">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                            {msg.role === 'user' && (
                                <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 mt-1 shadow-sm">
                                    <FontAwesomeIcon icon={faUser} className="text-gray-500 text-sm md:text-base" />
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4 md:gap-6 justify-start">
                            <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 mt-1 shadow-sm">
                                <FontAwesomeIcon icon={faWandMagicSparkles} className="text-blue-600 text-sm md:text-base animate-pulse" />
                            </div>
                            <div className="px-5 py-5 max-w-[85%] md:max-w-[75%] rounded-2xl bg-white border border-gray-200 text-gray-800 shadow-sm rounded-tl-none flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Input Area */}
                <div className={`w-full transition-all duration-700 ease-in-out mx-auto ${!hasMessages ? 'max-w-3xl' : 'max-w-4xl'} pb-6 pt-2`}>
                    <div className="relative flex items-center w-full bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-200 transition-colors overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Message ExpenseMate AI..."
                            className="w-full max-h-48 py-4 pl-4 pr-14 bg-transparent text-gray-800 placeholder-gray-400 resize-none outline-none overflow-y-auto text-base leading-relaxed"
                            rows="1"
                            style={{ minHeight: '56px' }}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!inputText.trim() || isLoading}
                            className="absolute right-3 bottom-3 w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white disabled:bg-gray-100 disabled:text-gray-400 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed shadow-sm"
                        >
                            <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
                        </button>
                    </div>
                    <div className="text-center mt-3 text-xs text-gray-500">
                        ExpenseMate AI can make mistakes. Consider verifying important financial information.
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Assistant;

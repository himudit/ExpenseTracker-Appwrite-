import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faWandMagicSparkles, faLightbulb, faCode, faPenNib, faUser, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import logo from '../../../public/logo.png'
import { useSelector } from 'react-redux';

const Assistant = () => {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const messagesEndRef = useRef(null);
    const userContext = useSelector((store) => store.user.user);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const getChat = async () => {
            const userId = userContext.$id;
            const response = await fetch(`${import.meta.env.VITE_ASSISTANT_URL}/chat/${userId}`, {});
            const data = await response.json();
            setMessages(data);
        }
        if (userContext.$id) {
            getChat();
        }
    }, [userContext]);

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
                body: JSON.stringify({ user_id: userContext.$id, message: textToSend }),
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

    const handleCopy = (content, idx) => {
        navigator.clipboard.writeText(content);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const hasMessages = messages.length > 0;

    return (
        <div className="flex flex-col min-h-screen md:ml-[4rem] text-gray-800 font-sans overflow-hidden relative selection:bg-[#033ff6]/30 selection:text-indigo-900">
            {/* Radial Gradient Background from Bottom */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #6366f1 100%)",
                }}
            />

            <div className={`flex-1 flex flex-col w-full mx-auto px-4 ${hasMessages ? 'justify-between' : 'justify-center'} overflow-hidden relative z-10`}>

                {/* Welcome Section - conditionally shown and centered */}
                <div className={`flex flex-col items-center justify-center w-full  transition-all duration-700 ease-in-out transform ${!hasMessages ? 'opacity-100 scale-100 max-h-[800px] pb-8' : 'opacity-0 scale-95 max-h-0 overflow-hidden'}`}>
                    <div className="w-16 h-16 rounded-2xl bg-[#033ff6] backdrop-blur-md flex items-center justify-center shadow-xl shadow-indigo-500/10 border border-white/60 mt-[-10vh]">
                        <img src={logo} alt="Logo" className="w-10 h-10 object-cover rounded-md" />
                        {/* Rupiq.AI */}
                    </div>

                    <h2 className="text-xl md:text-xl font-semibold tracking-tight text-center text-gray-400 mt-6">
                        Good to See You!
                    </h2>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-center text-gray-900 mt-6">
                        How can i be Assistance
                    </h1>
                    <h1 className="text-xl md:text-xl font-semibold tracking-tight text-center text-gray-400 mt-6">
                        I am available for your help!
                    </h1>
                </div>

                {/* Messages Area - shown when chat starts */}
                <div className={`w-[50%] max-w-4xl mx-auto flex flex-col overflow-y-auto transition-all duration-700 ${hasMessages ? 'flex-1 opacity-100 pt-8 pb-4 space-y-8' : 'opacity-0 h-0 overflow-hidden'}`}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-4 md:gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
                            {/* {msg.role === 'assistant' && (
                                <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full bg-[#033ff6]/70 backdrop-blur-md flex items-center justify-center border border-blue-200 mt-1 shadow-sm">
                                   
                                    Rupiq.AI
                                </div>
                            )} */}
                            <div className={`flex flex-col gap-1 w-full max-w-[85%] md:max-w-[75%]`}>
                                <div className={`${msg.role === 'user' ? 'bg-gray-100 text-gray-800 rounded-2xl px-5 py-2.5 inline-block w-fit ml-auto' : 'bg-transparent text-gray-800 py-2'}`}>
                                    {msg.role === 'user' ? (
                                        <div className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content}</div>
                                    ) : (
                                        <div className="prose prose-sm md:prose-base prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-a:text-blue-600 selection:bg-blue-300 selection:text-white">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} opacity-0 group-hover:opacity-100 transition-opacity px-2`}>
                                    <button
                                        onClick={() => handleCopy(msg.content, idx)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex items-center gap-1 text-xs font-medium"
                                        title="Copy message"
                                    >
                                        <FontAwesomeIcon icon={copiedIndex === idx ? faCheck : faCopy} className={copiedIndex === idx ? "text-green-500" : ""} />
                                        {copiedIndex === idx ? <span className="text-green-500">Copied!</span> : <span>Copy</span>}
                                    </button>
                                </div>
                            </div>
                            {msg.role === 'user' && (
                                <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 mt-1 shadow-sm overflow-hidden">
                                    {userContext?.profilePictureUrl ? (
                                        <img src={userContext.profilePictureUrl} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <FontAwesomeIcon icon={faUser} className="text-gray-500 text-sm md:text-base" />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4 md:gap-6 justify-start">
                            <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full bg-[#033ff6] flex items-center justify-center border border-blue-200 mt-1 shadow-sm">
                                <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[#033ff6] text-sm md:text-base animate-pulse" />
                            </div>
                            <div className="py-3 flex items-center gap-2">
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
                            className="absolute right-3 bottom-3 w-8 h-8 flex items-center justify-center rounded-lg bg-[#033ff6] text-white disabled:bg-gray-100 disabled:text-gray-400 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed shadow-sm"
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

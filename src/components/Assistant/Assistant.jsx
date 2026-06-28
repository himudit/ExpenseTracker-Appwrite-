import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser, faCheck, faClone, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import logo from '../../../public/logo.png'
import logo1 from '../../../public/logo1.png' // << Rupiq R icon for AI avatar

import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

// Modern text transition animation loader component
const TextTransitionLoader = () => {
    const loadingTexts = [
        "Scanning your transactions...",
        "Running expense analysis...",
        "Calculating spending patterns...",
        "Identifying cost drivers...",
        "Mapping your cash flow...",
        "Reconciling the numbers...",
        "Detecting spending anomalies...",
        "Forecasting budget trends...",
        "Categorizing expenditures...",
        "Auditing your finances...",
        "Processing financial data...",
        "Extracting spending insights...",
        "Benchmarking your expenses...",
        "Optimizing budget breakdown...",
        "Parsing transaction history...",
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ height: '24px', overflow: 'hidden', position: 'relative', width: '250px' }}>
            <AnimatePresence>
                <motion.div
                    key={index}
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -24, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        color: '#5A5A5A',
                        fontFamily: '"Comic Neue", cursive',
                        fontSize: '15px',
                        fontWeight: 400,
                        whiteSpace: 'nowrap'
                    }}
                >
                    {loadingTexts[index]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// Sketch-style inline SVG filter for hand-drawn effect
const SketchFilter = () => (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
            <filter id="sketchy">
                <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="4" result="noise" seed="2" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
        </defs>
    </svg>
);

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

    // const handleSuggestionClick = (description) => {
    //     handleSend(description);
    // };

    const handleCopy = (content, idx) => {
        navigator.clipboard.writeText(content);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const hasMessages = messages.length > 0;

    // ===== SKETCH STYLE TOKENS (edit values here to tweak the look) =====
    // BORDER COLOR: #5A5A5A (darkened from #8A8A8A)
    // BORDER RADIUS: reduced across all elements
    // BOX SHADOW: softened to 2px offset with #DCDCDC
    // TEXT COLOR: #2A2A2A (darkened from #3A3A3A)
    const sketchStyles = {
        /* --- Container background & font --- */
        container: {
            background: 'linear-gradient(180deg, #F2F2F2 0%, #F5F5F5 100%)',
            fontFamily: '"Comic Neue", cursive',
            color: '#2A2A2A', // << TEXT COLOR (darkened)
        },
        /* --- User chat bubble --- */
        userBubble: {
            background: '#FFFFFF',
            border: '2px solid #8A8A8A',       // << BORDER COLOR (darkened)
            borderRadius: '12px 12px 3px 12px', // << BORDER RADIUS (reduced)
            boxShadow: '2px 2px 0px #DCDCDC',   // << SHADOW (reduced)
            fontFamily: '"Comic Neue", cursive',
        },
        /* --- AI chat bubble --- */
        aiBubble: {
            background: '#FFFFFF',
            border: '2px solid #8A8A8A',        // << BORDER COLOR (darkened)
            borderRadius: '3px 12px 12px 12px',  // << BORDER RADIUS (reduced)
            boxShadow: '2px 2px 0px #DCDCDC',    // << SHADOW (reduced)
            fontFamily: '"Comic Neue", cursive',
        },
        /* --- Input text box --- */
        inputBox: {
            border: '2px solid #8A8A8A',   // << BORDER COLOR (darkened)
            borderRadius: '14px',           // << BORDER RADIUS (reduced from 20px)
            boxShadow: '2px 2px 0px #DCDCDC', // << SHADOW (reduced)
            background: '#FFFFFF',
            fontFamily: '"Comic Neue", cursive',
        },
        /* --- Send button --- */
        sendButton: {
            border: '2px solid #2A2A2A',    // << BORDER COLOR (darkened)
            borderRadius: '8px',             // << BORDER RADIUS (reduced from 10px)
            boxShadow: '1px 1px 0px #DCDCDC', // << SHADOW (reduced)
        },
        /* --- User avatar --- */
        avatar: {
            border: '2px solid white',    // << BORDER COLOR (darkened)
            borderRadius: '8px',             // << BORDER RADIUS (reduced from 12px)
            boxShadow: '1px 1px 0px #DCDCDC', // << SHADOW (reduced)
        },
        /* --- Loading avatar --- */
        loadingAvatar: {
            border: '2px solid #5A5A5A',    // << BORDER COLOR (darkened)
            borderRadius: '50%',
            boxShadow: '1px 1px 0px #DCDCDC', // << SHADOW (reduced)
        },
    };

    return (
        <div
            className="flex flex-col h-screen md:ml-[4rem] overflow-hidden relative  selection:text-white selection:bg-indigo-500"
            style={sketchStyles.container}
        >
            <SketchFilter />

            <div className={`flex-1 flex flex-col w-full mx-auto px-4 overflow-hidden relative z-10 h-full ${hasMessages ? '' : 'justify-center'}`}>

                {/* Welcome Section - cartoonish & playful */}
                {/* --- Welcome Section (logo, headings) --- */}
                <div className={`flex flex-col items-center justify-center w-full transition-all duration-700 ease-in-out transform ${!hasMessages ? 'opacity-100 scale-100 max-h-[800px] pb-8' : 'opacity-0 scale-95 max-h-0 overflow-hidden'}`}>
                    <div
                        className="w-18 h-18 bg-[#033ff6] flex items-center justify-center mt-[-10vh]"
                        style={{
                            border: '2.5px solid #2A2A2A',    // << LOGO BORDER (darkened)
                            borderRadius: '12px',               // << LOGO RADIUS (reduced from 16px)
                            boxShadow: '2px 2px 0px #DCDCDC',   // << LOGO SHADOW (reduced)
                            transform: 'rotate(-2deg)',
                        }}
                    >
                        <img src={logo} alt="Logo" className="w-11 h-11 object-cover rounded-md" />
                    </div>

                    {/* << WELCOME SUBTITLE TEXT COLOR */}
                    <h2
                        className="text-xl md:text-xl font-bold text-center mt-6"
                        style={{ fontFamily: '"Comic Neue", cursive', color: '#6A6A6A' }}
                    >
                        Good to See You! ✏️
                    </h2>
                    {/* << WELCOME MAIN HEADING TEXT COLOR */}
                    <h1
                        className="text-2xl md:text-3xl font-bold text-center mt-4"
                        style={{ fontFamily: '"Comic Neue", cursive', color: '#2A2A2A' }}
                    >
                        How can I help you today?
                    </h1>
                    {/* << WELCOME TAGLINE TEXT COLOR */}
                    <h2
                        className="text-lg md:text-xl font-normal text-center mt-3"
                        style={{ fontFamily: '"Comic Neue", cursive', fontStyle: 'italic', color: '#6A6A6A' }}
                    >
                        Im here whenever you need me!
                    </h2>
                </div>

                {/* Messages Area */}
                <div className={`flex-1 transition-all duration-700 ${hasMessages ? 'overflow-y-auto opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                    <div className={`w-[50%] max-w-4xl mx-auto flex flex-col ${hasMessages ? 'pt-8 pb-4 space-y-8' : ''}`}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-4 md:gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
                                {/* << AI AVATAR (Rupiq R icon) - shown on left of assistant messages */}
                                {msg.role === 'assistant' && (
                                    <div
                                        className="w-7 h-7 md:w-10 md:h-10 flex-shrink-0 bg-[#033ff6] flex items-center justify-center mt-1 overflow-hidden"
                                        style={sketchStyles.avatar}
                                    >
                                        <img src={logo} alt="Rupiq AI" className="w-7 h-7 object-cover" />
                                    </div>
                                )}
                                <div className={`flex flex-col gap-1 w-full ${msg.role === 'user' ? 'max-w-[85%] md:max-w-[75%]' : 'max-w-full'}`}>
                                    <div
                                        className={`${msg.role === 'user' ? 'px-5 py-3 inline-block w-fit ml-auto' : 'py-4 px-5 w-full'}`}
                                        style={msg.role === 'user' ? sketchStyles.userBubble : sketchStyles.aiBubble}
                                    >
                                        {msg.role === 'user' ? (
                                            // {/* Message of User */}
                                            // << USER MESSAGE TEXT COLOR
                                            <div
                                                className="whitespace-pre-wrap leading-relaxed text-[15px]"
                                                style={{ color: '#2A2A2A', fontFamily: '"Comic Neue", cursive', fontWeight: 400 }}
                                            >
                                                {msg.content}
                                            </div>
                                        ) : (
                                            // {/* Message of AI */}
                                            // << AI MESSAGE TEXT COLOR
                                            <div
                                                className="prose prose-sm md:prose-base max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-a:text-blue-600   selection:text-white selection:bg-indigo-500"
                                                style={{ fontFamily: '"Comic Neue", cursive', color: '#2A2A2A' }}
                                            >
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                    <div className={`flex ${msg.role === 'user' ? 'justify-end opacity-0 ' : 'justify-start'} group-hover:opacity-100 transition-opacity px-2`}>
                                        <button
                                            onClick={() => handleCopy(msg.content, idx)}
                                            className="hover:text-gray-600 transition-colors p-1 flex items-center gap-1 text-xs"
                                            style={{ fontFamily: '"Comic Neue", cursive', fontWeight: 700, color: '#5A5A5A' }} // << COPY BUTTON TEXT COLOR
                                            title="Copy message"
                                        >
                                            <FontAwesomeIcon icon={copiedIndex === idx ? faCheck : faClone} className={copiedIndex === idx ? "text-green-500 w-4 h-4" : "text-gray-500 w-4 h-4"} />
                                            {copiedIndex === idx ? <span className="text-green-500">Copied!</span> : <span></span>}
                                        </button>
                                        {/* <button
                                            onClick={() => handleCopy(msg.content, idx)}
                                            className="hover:text-gray-600 transition-colors p-1 flex items-center gap-1 text-xs"
                                            style={{ fontFamily: '"Comic Neue", cursive', fontWeight: 700, color: '#5A5A5A' }} 
                                            title="Copy message"
                                        >
                                            <FontAwesomeIcon icon={copiedIndex === idx ? faCheck : faThumbsUp} className={copiedIndex === idx ? "text-green-500 w-4 h-4" : "text-gray-500 w-4 h-4"} />
                                            {copiedIndex === idx ? <span className="text-green-500">Liked!</span> : <span></span>}
                                        </button>
                                        <button
                                            onClick={() => handleCopy(msg.content, idx)}
                                            className="hover:text-gray-600 transition-colors p-1 flex items-center gap-1 text-xs"
                                            style={{ fontFamily: '"Comic Neue", cursive', fontWeight: 700, color: '#5A5A5A' }} 
                                            title="Copy message"
                                        >
                                            <FontAwesomeIcon icon={copiedIndex === idx ? faCheck : faThumbsDown} className={copiedIndex === idx ? "text-green-500 w-4 h-4" : "text-gray-500 w-4 h-4"} />
                                            {copiedIndex === idx ? <span className="text-green-500">Disliked!</span> : <span></span>}
                                        </button> */}
                                    </div>
                                </div>
                                {/* << USER AVATAR - shown on right of user messages */}
                                {msg.role === 'user' && (
                                    <div
                                        className="w-7 h-7 md:w-10 md:h-10 flex-shrink-0 bg-gray-200 flex items-center justify-center mt-1 overflow-hidden"
                                        style={sketchStyles.avatar}
                                    >
                                        {userContext?.profilePictureUrl ? (
                                            <img src={userContext.profilePictureUrl} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <FontAwesomeIcon icon={faUser} className="text-sm md:text-base" style={{ color: '#5A5A5A' }} />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-4 md:gap-6 justify-start">
                                {/* << LOADING AVATAR - uses Rupiq R icon */}
                                <div
                                    className="w-7 h-7 md:w-10 md:h-10 flex-shrink-0 bg-white flex items-center justify-center mt-1 overflow-hidden"
                                    style={sketchStyles.avatar}
                                >
                                    <img src={logo1} alt="Rupiq AI" className="w-full h-full object-cover animate-pulse" />
                                </div>
                                <div className="py-2 flex items-center ml-4">
                                    <TextTransitionLoader />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                </div>

                {/* Input Area - sketch style */}
                <div className={`w-[60%] transition-all duration-700 ease-in-out mx-auto flex-shrink-0 ${!hasMessages ? 'max-w-3xl' : 'max-w-4xl'} pb-6 pt-2`}>
                    <div
                        className="relative flex items-center w-full overflow-hidden focus-within:ring-2 focus-within:ring-blue-200"
                        style={sketchStyles.inputBox}
                    >
                        <textarea
                            value={inputText}
                            onChange={(e) => {
                                setInputText(e.target.value);

                                e.target.style.height = "auto";

                                const maxHeight = 200; // px
                                const newHeight = Math.min(e.target.scrollHeight, maxHeight);

                                e.target.style.height = `${newHeight}px`;
                                e.target.style.overflowY =
                                    e.target.scrollHeight > maxHeight ? "auto" : "hidden";
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message here..."
                            className="w-full py-3 pl-4 pr-14 bg-transparent placeholder-gray-400 resize-none outline-none overflow-hidden text-base leading-relaxed"
                            rows={1}
                            style={{
                                minHeight: "40px",
                                fontFamily: '"Comic Neue", cursive',
                                color: "#2A2A2A",
                                fontWeight: 400,
                            }}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!inputText.trim() || isLoading}
                            className="absolute right-3 bottom-3 w-8 h-8 flex items-center justify-center bg-[#033ff6] text-white disabled:bg-gray-100 disabled:text-gray-400 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed"
                            style={sketchStyles.sendButton}
                        >
                            <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
                        </button>
                    </div>
                    {/* << DISCLAIMER TEXT COLOR */}
                    <div
                        className="text-center mt-3 text-xs"
                        style={{ fontFamily: '"Comic Neue", cursive', fontStyle: 'italic', color: '#6A6A6A' }}
                    >
                        ExpenseMate AI can make mistakes. Consider verifying important info
                    </div>
                </div>
            </div>

        </div >
    );
};

export default Assistant;

'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [houseNumber, setHouseNumber] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [authError, setAuthError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to connect to the server.' }]);
    }
    setLoading(false);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // basic base64 hashing as requested: MTU= (15), MjE2 (216)
    if (btoa(houseNumber.trim()) === 'MTU=' && btoa(streetNumber.trim()) === 'MjE2') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect details. Only Aimen is allowed!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex flex-col items-center justify-center p-4 sm:p-8 font-sans overflow-hidden relative">
        {/* Background decorative elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 text-pink-200/50 pointer-events-none"
        >
          <Sparkles size={80} />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 right-10 text-rose-200/50 pointer-events-none"
        >
          <Sparkles size={120} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-pink-200/50 border border-white p-8 sm:p-10 text-center relative z-10"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="flex justify-center mb-6"
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-pink-400 to-rose-300 rounded-full flex items-center justify-center shadow-lg shadow-pink-300/50">
              <Sparkles className="text-white" size={40} />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400 mb-2"
          >
            For Aimen Only 💕
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 text-sm mb-8 font-medium leading-relaxed"
          >
            By a rude developer 😒<br/>Please verify it's really you to unlock the chat.
          </motion.p>

          <form onSubmit={handleAuth} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-left mb-1.5 ml-2 text-[10px] font-bold text-pink-400 uppercase tracking-widest">Secret Question 1</div>
              <input
                type="text"
                placeholder="What is your House Number?"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                className="w-full p-4 bg-white border-2 border-pink-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-400/20 focus:border-pink-400 text-gray-700 placeholder-pink-200 transition-all font-medium text-center text-lg"
                required
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-left mb-1.5 ml-2 text-[10px] font-bold text-pink-400 uppercase tracking-widest">Secret Question 2</div>
              <input
                type="text"
                placeholder="What is your Street Number?"
                value={streetNumber}
                onChange={(e) => setStreetNumber(e.target.value)}
                className="w-full p-4 bg-white border-2 border-pink-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-400/20 focus:border-pink-400 text-gray-700 placeholder-pink-200 transition-all font-medium text-center text-lg"
                required
              />
            </motion.div>

            <AnimatePresence>
              {authError && (
                <motion.p 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-500 text-sm font-semibold bg-red-50 py-3 px-4 rounded-2xl border border-red-100"
                >
                  {authError}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(244 114 182 / 0.25)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 mt-6 bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold rounded-2xl shadow-lg shadow-pink-300/50 transition-all relative overflow-hidden group text-lg tracking-wide"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Unlock Chat
              </span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-rose-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-400 to-rose-400 p-6 text-white flex items-center justify-center gap-3 shadow-md z-10 relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-50"></div>
          <Sparkles className="relative z-10 animate-pulse" size={28} />
          <h1 className="relative z-10 text-2xl font-bold tracking-wide">Ali Haider's AI Chat</h1>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-pink-50/30">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-pink-300 space-y-4"
              >
                <Bot size={64} className="text-pink-200" />
                <p className="text-lg font-medium text-pink-400">Say hello! 💕</p>
              </motion.div>
            )}

            {messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-pink-500 text-white' : 'bg-white text-pink-400 border border-pink-100'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl shadow-sm text-sm sm:text-base ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-tr-sm' 
                      : 'bg-white text-gray-800 border border-pink-100 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-white text-pink-400 border border-pink-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot size={16} />
                </div>
                <div className="p-4 rounded-2xl shadow-sm bg-white border border-pink-100 rounded-tl-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-pink-100">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-4 bg-pink-50 border border-pink-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent text-gray-700 placeholder-pink-300 transition-all"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="p-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

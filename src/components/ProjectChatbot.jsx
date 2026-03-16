import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Trash2, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { praxisService } from '../services/praxisService';

/* ── Typing indicator (three pulsing dots) ─────────────────────── */
const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-1 py-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-2 h-2 rounded-full bg-cyan-400"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        style={{ boxShadow: '0 0 8px rgba(34,211,238,0.6)' }}
      />
    ))}
  </div>
);

/* ── Toast notification ────────────────────────────────────────── */
const Toast = ({ message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg
               bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium
               backdrop-blur-sm"
    onAnimationComplete={() => setTimeout(onClose, 1500)}
  >
    {message}
  </motion.div>
);

/* ── Single chat bubble ────────────────────────────────────────── */
const ChatBubble = ({ role, content, isTyping, error }) => {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Avatar — AI (left) */}
      {!isUser && (
        <div className="shrink-0 w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mt-1">
          <Bot size={14} className="text-cyan-400" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-white/5 border border-white/10 text-slate-200'
        } ${error ? 'border-red-500/30 bg-red-500/10' : ''}`}
      >
        {isTyping ? (
          <TypingIndicator />
        ) : error ? (
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle size={14} />
            <span>{content}</span>
          </div>
        ) : (
          content
        )}
      </div>

      {/* Avatar — User (right) */}
      {isUser && (
        <div className="shrink-0 w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mt-1">
          <User size={14} className="text-indigo-400" />
        </div>
      )}
    </motion.div>
  );
};

/* ── Main Chatbot component ────────────────────────────────────── */
const ProjectChatbot = ({ projectId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  /* ── Fetch history on mount ──────────────────────────────────── */
  useEffect(() => {
    if (!projectId) return;
    setIsLoading(true);
    praxisService
      .getChatHistory(projectId)
      .then((history) => {
        if (Array.isArray(history)) setMessages(history);
      })
      .catch(() => {
        /* silently start with empty history */
      })
      .finally(() => setIsLoading(false));
  }, [projectId]);

  /* ── Auto-scroll on new messages ─────────────────────────────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ── Focus input when panel opens ────────────────────────────── */
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  /* ── Send message with optimistic UI ─────────────────────────── */
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    // 1) Optimistically append user bubble + typing indicator
    const userMsg = { role: 'user', content: trimmed };
    const typingMsg = { role: 'assistant', isTyping: true, _temp: true };
    setMessages((prev) => [...prev, userMsg, typingMsg]);
    setInput('');
    setIsSending(true);

    try {
      // 2) Call backend
      const data = await praxisService.sendMessage(projectId, trimmed);

      // 3) Replace typing indicator with real answer
      setMessages((prev) => {
        const next = prev.filter((m) => !m._temp);
        next.push({ role: 'assistant', content: data.answer });
        return next;
      });
    } catch {
      // Replace typing indicator with error bubble
      setMessages((prev) => {
        const next = prev.filter((m) => !m._temp);
        next.push({
          role: 'assistant',
          error: true,
          content: 'Connection failed. Please try again.',
        });
        return next;
      });
    } finally {
      setIsSending(false);
    }
  };

  /* ── Clear chat history ──────────────────────────────────────── */
  const handleClear = async () => {
    try {
      await praxisService.clearChat(projectId);
      setMessages([]);
      setToast('Chat history cleared');
    } catch {
      setToast('Failed to clear history');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ── Panel animation variants ────────────────────────────────── */
  const panelVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 350, damping: 28 },
    },
    exit: { opacity: 0, scale: 0.85, y: 30, transition: { duration: 0.2 } },
  };

  return (
    <>
      {/* ── Floating Action Button ───────────────────────────────── */}
      <motion.button
        id="chatbot-fab"
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center
                   bg-gradient-to-br from-indigo-600 to-cyan-600 text-white shadow-lg
                   hover:shadow-indigo-500/40 transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ boxShadow: '0 0 24px rgba(99,102,241,0.4)' }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Sparkles size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat Panel ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[540px] flex flex-col
                       rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10
                       shadow-2xl shadow-indigo-500/10 overflow-hidden"
          >
            {/* Header */}
            <div className="relative px-5 py-4 border-b border-white/5 bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">PraxisForge AI</h3>
                  <p className="text-[11px] text-slate-400">Ask anything about your project</p>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Clear chat history"
              >
                <Trash2 size={16} />
              </button>

              {/* Toast */}
              <AnimatePresence>
                {toast && <Toast message={toast} onClose={() => setToast(null)} />}
              </AnimatePresence>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="animate-spin text-indigo-500" size={24} />
                  <span className="ml-2 text-slate-400 text-sm">Loading history…</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-slate-500 text-xs pt-10">
                  <Sparkles size={28} className="mx-auto mb-3 text-indigo-500/40" />
                  Start a conversation with your project AI.
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((msg, idx) => (
                    <ChatBubble
                      key={idx}
                      role={msg.role}
                      content={msg.content}
                      isTyping={msg.isTyping}
                      error={msg.error}
                    />
                  ))}
                </AnimatePresence>
              )}
              {/* Auto-scroll anchor */}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/5 bg-slate-900/60">
              <div className="flex items-center gap-2 bg-slate-800/60 rounded-xl px-3 py-2 border border-white/5 focus-within:border-indigo-500/40 transition-colors">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask PraxisForge AI…"
                  className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder-slate-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isSending}
                  className="w-8 h-8 rounded-lg flex items-center justify-center
                             bg-indigo-600 text-white disabled:opacity-30 hover:bg-indigo-500 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectChatbot;

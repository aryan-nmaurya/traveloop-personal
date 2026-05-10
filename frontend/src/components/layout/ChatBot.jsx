import { useEffect, useRef, useState } from 'react';
import { Compass, MessageCircle, Send, Sparkles, Trash2, X } from 'lucide-react';
import api from '../../api/axiosInstance';
import { cn } from '../../utils/cn';
import { useLocation } from 'react-router-dom';

const QUICK_PROMPTS = [
  'Best budget trip under ₹50,000 🏕',
  'Plan a Goa trip for 5 days 🌊',
  'Honeymoon destinations in India 💑',
  'Solo travel tips for beginners 🎒',
  'Hidden gems in Southeast Asia ✈',
];

const TypingDots = () => (
  <div className="flex items-center gap-1 px-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500"
        style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
      />
    ))}
    <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
  </div>
);

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm **Traveloop AI** ✈ — your personal travel planning assistant.\n\nAsk me anything: trip ideas, budgets, destinations, itineraries, or hidden gems. Where would you like to go?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();

  // Close chatbot on navigation
  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, messages]);

  const sendMessage = async (text) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    const next = [...messages, { role: 'user', content: userText }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        messages: next.filter((m) => m.role !== 'assistant' || next.indexOf(m) > 0).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, I couldn't connect right now. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n•/g, '<br/>•')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* Floating button — sits above the "Plan a new trip" FAB on dashboard */}
      <button
        type="button"
        className={cn(
          'fixed bottom-20 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full shadow-[0_20px_60px_rgba(14,116,144,0.36)] transition-all duration-300',
          open
            ? 'bg-slate-900 dark:bg-slate-700 scale-95'
            : 'bg-[linear-gradient(135deg,#0f766e_0%,#0ea5e9_100%)] hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(14,116,144,0.44)]',
        )}
        aria-label={open ? 'Close AI assistant' : 'Open AI travel assistant'}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
      </button>

      {/* Chat panel */}
      <div
        className={cn(
          'fixed bottom-36 right-5 z-50 flex w-[360px] flex-col overflow-hidden rounded-[28px] border shadow-[0_32px_100px_rgba(15,23,42,0.22)] backdrop-blur transition-all duration-400 sm:w-[400px]',
          open ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-95 opacity-0 translate-y-4 pointer-events-none',
        )}
        style={{
          background: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
          maxHeight: 'calc(100vh - 180px)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 border-b px-5 py-4"
          style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e,#0ea5e9)]">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Traveloop AI</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Powered by NVIDIA NIM · Always on</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border transition hover:-translate-y-0.5"
              style={{ borderColor: 'var(--input-border)', color: 'var(--text-muted)', background: 'var(--input-bg)' }}
              title="Clear chat"
              onClick={() => setMessages([{
                role: 'assistant',
                content: "Chat cleared! I'm ready to help you plan your next adventure. Where would you like to go?",
              }])}
            >
              <Trash2 size={14} />
            </button>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border transition hover:-translate-y-0.5"
              style={{ borderColor: 'var(--input-border)', color: 'var(--text-muted)', background: 'var(--input-bg)' }}
              onClick={() => setOpen(false)}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ minHeight: 280, maxHeight: 380 }}>
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex gap-2.5', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e,#0ea5e9)] mt-0.5">
                  <Compass size={14} className="text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[82%] rounded-[18px] px-4 py-3 text-sm leading-6',
                  msg.role === 'user'
                    ? 'rounded-tr-md bg-[linear-gradient(135deg,#0f766e,#0ea5e9)] text-white'
                    : 'rounded-tl-md',
                )}
                style={msg.role !== 'user' ? { background: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--line)', border: '1px solid var(--line)' } : {}}
                dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
              />
            </div>
          ))}
          {loading && (
            <div className="flex gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e,#0ea5e9)]">
                <Compass size={14} className="text-white" />
              </div>
              <div
                className="rounded-[18px] rounded-tl-md px-4 py-3"
                style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
              >
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="border-t px-4 py-3" style={{ borderColor: 'var(--line)' }}>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>
              Quick start
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="rounded-full border px-3 py-1.5 text-[11px] font-medium transition hover:-translate-y-0.5"
                  style={{ borderColor: 'var(--input-border)', color: 'var(--text-secondary)', background: 'var(--input-bg)' }}
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t px-4 py-3" style={{ borderColor: 'var(--line)' }}>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          >
            <input
              ref={inputRef}
              className="flex-1 rounded-full border px-4 py-2.5 text-sm outline-none transition"
              style={{
                background: 'var(--input-bg)',
                borderColor: 'var(--input-border)',
                color: 'var(--text-primary)',
              }}
              placeholder="Ask about destinations, budgets, activities…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e,#0ea5e9)] text-white shadow-[0_8px_24px_rgba(14,116,144,0.30)] transition hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Send size={15} />
            </button>
          </form>
          <p className="mt-2 text-center text-[10px]" style={{ color: 'var(--text-muted)' }}>
            AI responses are suggestions — always verify before booking.
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatBot;

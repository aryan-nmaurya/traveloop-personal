import { useEffect, useRef, useState } from 'react';
import { Compass, MapPin, MessageCircle, Plus, Send, Sparkles, Trash2, X } from 'lucide-react';
import api from '../../api/axiosInstance';
import { cn } from '../../utils/cn';
import { useLocation, useNavigate } from 'react-router-dom';

const QUICK_PROMPTS = [
  'Best budget trip under ₹50,000 🏕',
  'Plan a Goa trip for 5 days 🌊',
  'Honeymoon destinations in India 💑',
  'Solo travel tips for beginners 🎒',
  'Hidden gems in Rajasthan 🏜',
];

const TypingDots = () => (
  <div className="flex items-center gap-1 px-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="h-2 w-2 rounded-full bg-slate-400"
        style={{ animation: `chatBounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
      />
    ))}
    <style>{`@keyframes chatBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
  </div>
);

const ChatBot = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'init',
      role: 'assistant',
      content: "Hi! I'm **Traveloop AI** ✈ — your personal travel planner.\n\nAsk me anything about destinations, budgets, activities, or say **\"Plan a trip to [city]\"** and I'll generate a full itinerary you can save!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [creatingTrip, setCreatingTrip] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(location.pathname);
  const isDashboard = location.pathname === '/';

  // Close chatbot on navigation
  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, messages]);

  if (isAuthPage) return null;

  const sendMessage = async (text) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    const next = [...messages, { id: `user-${Date.now()}`, role: 'user', content: userText }];
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
      const reply = res.data.reply || "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { id: `ai-${Date.now()}`, role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: 'assistant', content: "Sorry, I couldn't connect right now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = async () => {
    if (creatingTrip) return;
    setCreatingTrip(true);

    // Gather context from the conversation
    const userMessages = messages.filter((m) => m.role === 'user').map((m) => m.content);
    const assistantMessages = messages.filter((m) => m.role === 'assistant').map((m) => m.content);
    const lastAssistant = assistantMessages[assistantMessages.length - 1] || '';

    // Extract a trip name from conversation
    const cityMatch = userMessages.join(' ').match(/(?:trip to|visit|go to|plan.*?)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/i);
    const tripName = cityMatch ? `AI Trip to ${cityMatch[1]}` : 'AI-Generated Trip';

    // Try to extract a budget figure from the conversation (e.g. "₹45,000" or "50000")
    const budgetMatch = userMessages.join(' ').match(/₹?\s*(\d[\d,]{2,})/);
    const parsedBudget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, ''), 10) : 50000;

    try {
      const response = await api.post('/trips', {
        name: tripName,
        description: `Generated from Traveloop AI chat:\n\n${lastAssistant.slice(0, 500)}`,
        budget: parsedBudget,
        is_public: false,
      });

      const tripId = response.data.id;

      // Parse the AI response to create sections
      const lines = lastAssistant.split('\n');
      let sectionIndex = 0;

      for (const line of lines) {
        // Match patterns like "Day 1-3:", "**Day 1:**", "• **Manali**", etc.
        const dayMatch = line.match(/(?:\*\*)?Day\s*(\d+(?:[–-]\d+)?)\s*(?::|\*\*)/i);
        const bulletMatch = line.match(/[•\-\*]\s*\*?\*?([^:*]+)\*?\*?\s*[:\—–-]/);

        if (dayMatch || (bulletMatch && line.length > 30)) {
          const desc = line.replace(/[*•\-]/g, '').replace(/<[^>]+>/g, '').trim();
          if (desc.length > 10) {
            try {
              await api.post(`/trips/${tripId}/sections`, {
                type: 'stay',
                description: desc,
                budget: 0,
                order_index: sectionIndex++,
              });
            } catch { /* continue */ }
          }
        }
      }

      // If no sections were parsed, create one with the full response
      if (sectionIndex === 0) {
        await api.post(`/trips/${tripId}/sections`, {
          type: 'stay',
          description: lastAssistant.slice(0, 500).replace(/[*#]/g, '').trim(),
          budget: 0,
          order_index: 0,
        }).catch(() => {});
      }

      setMessages((prev) => [
        ...prev,
        { id: `created-${Date.now()}`, role: 'assistant', content: `✅ **Trip created!** "${tripName}" with ${Math.max(sectionIndex, 1)} sections.\n\nRedirecting you to the itinerary view…` },
      ]);

      setTimeout(() => {
        setOpen(false);
        navigate(`/trips/${tripId}/view`);
      }, 1500);
    } catch (err) {
      console.error('Trip creation failed:', err);
      setMessages((prev) => [
        ...prev,
        { id: `fail-${Date.now()}`, role: 'assistant', content: "❌ Sorry, I couldn't create the trip. Please try again or use the **Plan a trip** button." },
      ]);
    } finally {
      setCreatingTrip(false);
    }
  };

  // Escape HTML entities FIRST to prevent XSS, then apply safe markdown transforms.
  const renderContent = (text) => {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    return escaped
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n•/g, '<br/>•')
      .replace(/\n/g, '<br/>');
  };

  const hasEnoughContext = messages.filter((m) => m.role === 'assistant').length >= 2;

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        className={cn(
          'fixed z-50 inline-flex items-center justify-center rounded-full shadow-[0_20px_60px_rgba(14,116,144,0.36)] transition-all duration-300',
          isDashboard ? 'right-6' : 'right-6',
          open
            ? cn(isDashboard ? 'bottom-[84px]' : 'bottom-6', 'h-12 w-12 bg-slate-900 scale-95')
            : cn(isDashboard ? 'bottom-[84px]' : 'bottom-6', 'h-14 w-14 bg-[linear-gradient(135deg,#0f766e_0%,#0ea5e9_100%)] hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(14,116,144,0.44)]'),
        )}
        aria-label={open ? 'Close AI assistant' : 'Open AI travel assistant'}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X size={20} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
      </button>

      {/* Chat panel */}
      <div
        className={cn(
          'fixed z-50 flex flex-col overflow-hidden rounded-[24px] border shadow-[0_32px_100px_rgba(15,23,42,0.22)] backdrop-blur transition-all duration-300',
          isDashboard ? 'bottom-[144px]' : 'bottom-[76px]',
          'right-6 w-[370px] sm:w-[400px]',
          open ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-95 opacity-0 translate-y-4 pointer-events-none',
        )}
        style={{
          background: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
          maxHeight: 'min(520px, calc(100vh - 120px))',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 border-b px-5 py-3.5 shrink-0"
          style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e,#0ea5e9)]">
            <Sparkles size={16} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>Traveloop AI</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Powered by NVIDIA NIM</p>
          </div>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border transition hover:opacity-70"
            style={{ borderColor: 'var(--input-border)', color: 'var(--text-muted)', background: 'var(--input-bg)' }}
            title="Clear chat"
            onClick={() => setMessages([{
              id: 'init',
              role: 'assistant',
              content: "Chat cleared! I'm ready to help plan your next adventure. ✈",
            }])}
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
          style={{ minHeight: 200 }}
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={cn('flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
              {msg.role === 'assistant' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e,#0ea5e9)] mt-0.5">
                  <Compass size={12} className="text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-[16px] px-3.5 py-2.5 text-[13px] leading-[1.6]',
                  msg.role === 'user'
                    ? 'rounded-tr-md bg-[linear-gradient(135deg,#0f766e,#0ea5e9)] text-white'
                    : 'rounded-tl-md',
                )}
                style={msg.role !== 'user' ? { background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--line)' } : {}}
                dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
              />
            </div>
          ))}
          {loading && (
            <div className="flex gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e,#0ea5e9)]">
                <Compass size={12} className="text-white" />
              </div>
              <div className="rounded-[16px] rounded-tl-md px-3.5 py-2.5" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Create Trip CTA — shows after at least 2 AI responses */}
        {hasEnoughContext && !loading && (
          <div className="shrink-0 border-t px-4 py-2.5" style={{ borderColor: 'var(--line)' }}>
            <button
              type="button"
              disabled={creatingTrip}
              onClick={handleCreateTrip}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f766e,#0ea5e9)] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_24px_rgba(14,116,144,0.25)] transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {creatingTrip ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating your trip…
                </>
              ) : (
                <>
                  <Plus size={14} />
                  Create trip from this conversation
                </>
              )}
            </button>
          </div>
        )}

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="shrink-0 border-t px-4 py-2.5" style={{ borderColor: 'var(--line)' }}>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>
              Quick start
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="rounded-full border px-2.5 py-1 text-[10px] font-medium transition hover:-translate-y-0.5"
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
        <div className="shrink-0 border-t px-4 py-2.5" style={{ borderColor: 'var(--line)' }}>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          >
            <input
              ref={inputRef}
              className="flex-1 rounded-full border px-3.5 py-2 text-[13px] outline-none transition"
              style={{
                background: 'var(--input-bg)',
                borderColor: 'var(--input-border)',
                color: 'var(--text-primary)',
              }}
              placeholder="Ask about destinations, budgets…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e,#0ea5e9)] text-white shadow-[0_8px_24px_rgba(14,116,144,0.30)] transition hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatBot;

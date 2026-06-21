// components/Chatbot.tsx
import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle, X, Send, Minimize2, Maximize2,
  Loader2, Sparkles, User, Bot, AlertCircle,
  Search, Star, Calendar, Phone, HelpCircle,
  RefreshCw, ChevronDown,
} from 'lucide-react';
import { chatbotApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  response?: string;
  metadata?: any;
  created_at: string;
}

interface Suggestion {
  label: string;
  icon?: any;
}

const SUGGESTIONS: Suggestion[] = [
  { label: 'Bonjour', icon: Sparkles },
  { label: 'Chercher un appartement à Paris', icon: Search },
  { label: 'Quels sont les prix ?', icon: Star },
  { label: 'Comment réserver ?', icon: Calendar },
  { label: "Politique d'annulation", icon: HelpCircle },
  { label: 'Aide', icon: Phone },
];

const WELCOME_MESSAGES = [
  'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider à trouver un espace ?',
  'Salut ! Je suis là pour vous aider à trouver le logement idéal. Que recherchez-vous ?',
  'Bienvenue ! Je suis votre guide pour trouver des espaces. Posez-moi vos questions !',
];

export function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMounted = useRef(true);
  // Ref instead of state → synchronous guard, immune to StrictMode double-invoke
  const hasStartedRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (sessionIdRef.current) {
        try { chatbotApi.closeConversation(sessionIdRef.current); } catch (_) {}
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && !hasStartedRef.current) {
      startConversation();
    }
  }, [isOpen]);

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages, typing]);

  useEffect(() => {
    if (isOpen && !isMinimized && !loading) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized, loading]);

  const scrollToBottom = () => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } catch (_) {}
  };

  const startConversation = async () => {
    // Synchronous ref check — blocks the second StrictMode call immediately
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    try {
      setError(null);
      setLoading(true);
      const response = await chatbotApi.start();
      if (!isMounted.current) return;
      const sid = response.data.session_id;
      sessionIdRef.current = sid;
      setSessionId(sid);
      const welcomeMessage = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
      setMessages([{
        id: 'welcome',
        sender: 'bot',
        message: welcomeMessage,
        created_at: new Date().toISOString(),
      }]);
      setShowSuggestions(true);
    } catch (err: any) {
      if (isMounted.current) {
        setError('Impossible de démarrer la conversation. Veuillez réessayer.');
        hasStartedRef.current = false; // allow retry on error
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  // FIX: accepte un messageOverride pour éviter le problème de closure sur `input`
  const sendMessage = async (messageOverride?: string) => {
    const trimmedMessage = (messageOverride ?? input).trim();
    if (!trimmedMessage || !sessionId || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      message: trimmedMessage,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowSuggestions(false);
    setLoading(true);
    setTyping(true);
    setError(null);

    try {
      const response = await chatbotApi.sendMessage(sessionId, trimmedMessage);
      if (!isMounted.current) return;

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        message: response.data.message || "Je n'ai pas compris votre demande.",
        response: response.data.message,
        metadata: response.data.metadata,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, botMessage]);
      setTyping(false);
      setShowSuggestions(true);
    } catch (err: any) {
      if (isMounted.current) {
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          sender: 'bot',
          message: 'Désolé, une erreur est survenue. Veuillez réessayer.',
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, errorMessage]);
        setTyping(false);
        setShowSuggestions(true);
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.repeat) {
      e.preventDefault();
      sendMessage();
    }
  };

  // FIX: passe directement le label sans passer par setInput
  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const closeConversation = async () => {
    if (sessionIdRef.current) {
      try { await chatbotApi.closeConversation(sessionIdRef.current); } catch (_) {}
    }
    sessionIdRef.current = null;
    hasStartedRef.current = false;
    setIsOpen(false);
    setSessionId(null);
    setMessages([]);
    setError(null);
    setInput('');
  };

  const toggleChat = () => {
    if (isOpen) closeConversation();
    else setIsOpen(true);
  };

  const resetConversation = async () => {
    if (sessionIdRef.current) {
      try { await chatbotApi.closeConversation(sessionIdRef.current); } catch (_) {}
    }
    sessionIdRef.current = null;
    hasStartedRef.current = false;
    setSessionId(null);
    setMessages([]);
    setError(null);
    setShowSuggestions(true);
    setTyping(false);
    setLoading(false);
    setInput('');
    setTimeout(() => startConversation(), 200);
  };

  const getTime = (date: string) => {
    try { return format(new Date(date), 'HH:mm', { locale: fr }); }
    catch { return ''; }
  };

  /* ─── CLOSED STATE ──────────────────────────────────────────────── */
  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        aria-label="Ouvrir le chat"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(99,102,241,0.45)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(99,102,241,0.55)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(99,102,241,0.45)';
        }}
      >
        <MessageCircle size={24} color="#fff" />
        {/* Pulse indicator */}
        <span style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          width: '12px',
          height: '12px',
          background: '#22c55e',
          borderRadius: '50%',
          border: '2px solid #fff',
          animation: 'pulse 2s infinite',
        }} />
        <style>{`
          @keyframes pulse {
            0%,100%{opacity:1;transform:scale(1)}
            50%{opacity:.6;transform:scale(1.2)}
          }
          @keyframes slideUp {
            from{opacity:0;transform:translateY(20px)}
            to{opacity:1;transform:translateY(0)}
          }
          @keyframes fadeIn {
            from{opacity:0}
            to{opacity:1}
          }
          @keyframes bounce {
            0%,80%,100%{transform:translateY(0)}
            40%{transform:translateY(-6px)}
          }
          @keyframes msgIn {
            from{opacity:0;transform:translateY(8px)}
            to{opacity:1;transform:translateY(0)}
          }
        `}</style>
      </button>
    );
  }

  /* ─── OPEN STATE ────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @keyframes pulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:.6;transform:scale(1.2)}
        }
        @keyframes slideUp {
          from{opacity:0;transform:translateY(20px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes fadeIn {
          from{opacity:0}
          to{opacity:1}
        }
        @keyframes bounce {
          0%,80%,100%{transform:translateY(0)}
          40%{transform:translateY(-6px)}
        }
        @keyframes msgIn {
          from{opacity:0;transform:translateY(8px)}
          to{opacity:1;transform:translateY(0)}
        }
        .chatbot-scroll::-webkit-scrollbar{width:4px}
        .chatbot-scroll::-webkit-scrollbar-track{background:transparent}
        .chatbot-scroll::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px}
        .chatbot-scroll::-webkit-scrollbar-thumb:hover{background:#cbd5e1}
        .suggestion-chip:hover{
          background:#eef2ff !important;
          border-color:#6366f1 !important;
          color:#6366f1 !important;
        }
        .send-btn:not(:disabled):hover{
          background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%) !important;
          transform:scale(1.04);
        }
        .send-btn:disabled{opacity:0.45;cursor:not-allowed}
        .action-btn:hover{background:#f1f5f9 !important}
        .reset-btn:hover{color:#6366f1 !important}

        /* Responsive */
        @media (max-width: 480px) {
          .chatbot-window {
            bottom: 0 !important;
            right: 0 !important;
            left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            border-radius: 20px 20px 0 0 !important;
            height: 92dvh !important;
          }
          .chatbot-trigger {
            bottom: 16px !important;
            right: 16px !important;
          }
        }
      `}</style>

      <div
        className="chatbot-window"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          width: '400px',
          maxWidth: 'calc(100vw - 32px)',
          height: isMinimized ? '68px' : '620px',
          maxHeight: 'calc(100dvh - 48px)',
          borderRadius: '20px',
          background: '#ffffff',
          boxShadow: '0 24px 64px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.3s ease',
          transition: 'height 0.3s cubic-bezier(.4,0,.2,1)',
          border: '1px solid rgba(99,102,241,0.12)',
        }}
      >
        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid rgba(255,255,255,0.3)',
              }}>
                <Sparkles size={18} color="#fff" />
              </div>
              <span style={{
                position: 'absolute',
                bottom: '1px',
                right: '1px',
                width: '10px',
                height: '10px',
                background: '#22c55e',
                borderRadius: '50%',
                border: '2px solid white',
                animation: 'pulse 2s infinite',
              }} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#fff', letterSpacing: '0.01em' }}>
                Assistant IA
              </p>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: 'rgba(255,255,255,0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: typing ? '#fbbf24' : '#86efac',
                  animation: typing ? 'pulse 1s infinite' : 'none',
                }} />
                {typing ? "En train d'écrire…" : 'En ligne'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              className="action-btn"
              onClick={() => setIsMinimized(m => !m)}
              title={isMinimized ? 'Agrandir' : 'Réduire'}
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                border: 'none', background: 'rgba(255,255,255,0.15)',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', transition: 'background 0.15s',
              }}
            >
              {isMinimized
                ? <Maximize2 size={15} color="#fff" />
                : <Minimize2 size={15} color="#fff" />}
            </button>
            <button
              onClick={closeConversation}
              title="Fermer"
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                border: 'none', background: 'rgba(255,255,255,0.15)',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
            >
              <X size={15} color="#fff" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* ── MESSAGES ─────────────────────────────────────── */}
            <div
              className="chatbot-scroll"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: '#f8fafc',
              }}
            >
              {/* Error banner */}
              {error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px 12px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  animation: 'fadeIn 0.2s ease',
                }}>
                  <AlertCircle size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#dc2626' }}>{error}</p>
                    <button
                      onClick={() => setError(null)}
                      style={{
                        marginTop: '4px', fontSize: '11px', color: '#ef4444',
                        border: 'none', background: 'none', cursor: 'pointer', padding: 0,
                      }}
                    >
                      Ignorer
                    </button>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {messages.length === 0 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  textAlign: 'center',
                  padding: '24px 16px',
                  animation: 'fadeIn 0.4s ease',
                }}>
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '14px',
                    boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
                  }}>
                    <Sparkles size={32} color="#fff" />
                  </div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#1e293b' }}>Bonjour 👋</p>
                  <p style={{ margin: '6px 0 16px', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                    Je suis votre assistant IA.<br />Posez-moi vos questions sur les espaces, les réservations ou les prix.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                    {SUGGESTIONS.slice(0, 3).map((s, i) => (
                      <button
                        key={i}
                        className="suggestion-chip"
                        onClick={() => handleSuggestionClick(s.label)}
                        style={{
                          padding: '6px 12px', borderRadius: '99px',
                          border: '1.5px solid #e2e8f0',
                          background: '#fff', cursor: 'pointer',
                          fontSize: '12px', color: '#475569',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages list */}
              {messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  style={{
                    display: 'flex',
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: '8px',
                    animation: 'msgIn 0.2s ease',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: msg.sender === 'user'
                      ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                      : '#fff',
                    border: msg.sender === 'bot' ? '1.5px solid #e2e8f0' : 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}>
                    {msg.sender === 'user'
                      ? <User size={14} color="#fff" />
                      : <Bot size={14} color="#6366f1" />}
                  </div>

                  <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: msg.sender === 'user'
                        ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                        : '#ffffff',
                      border: msg.sender === 'bot' ? '1px solid #e2e8f0' : 'none',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}>
                      <p style={{
                        margin: 0,
                        fontSize: '13.5px',
                        lineHeight: 1.55,
                        color: msg.sender === 'user' ? '#fff' : '#1e293b',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}>
                        {msg.message}
                      </p>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px', paddingInline: '4px' }}>
                      {getTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div style={{
                  display: 'flex', alignItems: 'flex-end', gap: '8px',
                  animation: 'fadeIn 0.2s ease',
                }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#fff', border: '1.5px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}>
                    <Bot size={14} color="#6366f1" />
                  </div>
                  <div style={{
                    padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
                    background: '#fff', border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    display: 'flex', gap: '4px', alignItems: 'center',
                  }}>
                    {[0, 150, 300].map(delay => (
                      <span key={delay} style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: '#a5b4fc',
                        display: 'inline-block',
                        animation: `bounce 1.2s ${delay}ms infinite ease-in-out`,
                      }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── SUGGESTIONS ──────────────────────────────────── */}
            {showSuggestions && messages.length > 0 && !typing && (
              <div style={{
                padding: '8px 12px',
                borderTop: '1px solid #f1f5f9',
                background: '#fff',
                overflowX: 'auto',
                flexShrink: 0,
              }}>
                <div style={{ display: 'flex', gap: '6px', width: 'max-content' }}>
                  {SUGGESTIONS.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={i}
                        className="suggestion-chip"
                        onClick={() => handleSuggestionClick(s.label)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '5px 11px', borderRadius: '99px',
                          border: '1.5px solid #e2e8f0',
                          background: '#f8fafc', cursor: 'pointer',
                          fontSize: '12px', color: '#475569',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {Icon && <Icon size={12} />}
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── INPUT ─────────────────────────────────────────── */}
            <div style={{
              padding: '12px 14px',
              borderTop: '1px solid #f1f5f9',
              background: '#fff',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Écrivez votre message…"
                  disabled={loading || !sessionId}
                  maxLength={500}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '13.5px',
                    color: '#1e293b',
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                    opacity: (!sessionId || loading) ? 0.5 : 1,
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#fff'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                />
                <button
                  className="send-btn"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading || !sessionId}
                  aria-label="Envoyer"
                  style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    border: 'none', flexShrink: 0,
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {loading
                    ? <Loader2 size={17} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
                    : <Send size={17} color="#fff" />}
                </button>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginTop: '8px',
              }}>
                <span style={{
                  fontSize: '11px', color: '#94a3b8',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#22c55e', display: 'inline-block',
                  }} />
                  {user ? `Connecté — ${user.name}` : 'Mode invité'}
                </span>
                <button
                  className="reset-btn"
                  onClick={resetConversation}
                  style={{
                    fontSize: '11px', color: '#94a3b8',
                    border: 'none', background: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    transition: 'color 0.15s ease',
                  }}
                >
                  <RefreshCw size={11} />
                  Nouvelle conversation
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes bounce {
          0%,80%,100%{transform:translateY(0)}
          40%{transform:translateY(-5px)}
        }
        @keyframes pulse {
          0%,100%{opacity:1}
          50%{opacity:.5}
        }
        @keyframes slideUp {
          from{opacity:0;transform:translateY(16px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes fadeIn {
          from{opacity:0}
          to{opacity:1}
        }
        @keyframes msgIn {
          from{opacity:0;transform:translateY(6px)}
          to{opacity:1;transform:translateY(0)}
        }
      `}</style>
    </>
  );
}
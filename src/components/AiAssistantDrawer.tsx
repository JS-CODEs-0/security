"use client";

import React, { useState, useRef, useEffect } from "react";
import { CyberBook, BookPage } from "@/data/cybersecurityBooks";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Terminal,
  Copy,
  Check,
  ChevronRight,
  Maximize2,
  Minimize2,
  Cpu,
  Trash2,
  AlertCircle,
} from "lucide-react";

interface AiAssistantProps {
  book: CyberBook;
  currentPage: BookPage;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export function AiAssistantDrawer({ book, currentPage, isOpen, onClose }: AiAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastPromptRef = useRef<string>("");

  // Initialize or update welcome message when book or page changes
  useEffect(() => {
    setMessages([
      {
        id: `welcome-${book.id}-${currentPage.pageNumber}`,
        role: "assistant",
        content: `**Tactical Intelligence Copilot initialized.**\n\n- **Model:** NVIDIA Nemotron 3 Ultra (550B)\n- **Context:** Book 0${book.number}: ${book.title} // Page ${currentPage.pageNumber}: *${currentPage.title}*\n- **Discipline:** ${book.discipline}\n\nI am synchronized with Page ${currentPage.pageNumber}'s technical directives. Ask me to synthesize threat signatures, analyze attack vectors, or evaluate mitigation controls.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setError(null);
  }, [book.id, currentPage.pageNumber]);

  // Auto-scroll chat to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearHistory = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
    setError(null);
    setMessages([
      {
        id: `welcome-${book.id}-${currentPage.pageNumber}-${Date.now()}`,
        role: "assistant",
        content: `Conversation reset. Ready for technical inquiries on **Book 0${book.number}: ${book.title}** (Page ${currentPage.pageNumber}).`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const userPrompt = textToSend || input.trim() || lastPromptRef.current;
    if (!userPrompt || isLoading) return;

    lastPromptRef.current = userPrompt;
    setError(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setIsLoading(true);

    // Prepare assistant streaming placeholder
    const assistantMsgId = `assistant-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isStreaming: true,
    };

    setMessages([...newMessages, initialAssistantMsg]);

    // Setup abort controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const historyPayload = newMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book.id,
          pageNumber: currentPage.pageNumber,
          messages: historyPayload,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${res.status}: Failed to connect to NVIDIA AI service.`
        );
      }

      if (!res.body) {
        throw new Error("Response body is empty.");
      }

      // Stream response chunks
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, content: accumulatedText, isStreaming: true }
              : msg
          )
        );
      }

      // Mark streaming complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg
        )
      );
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Request aborted by operator.");
        return;
      }
      console.error("AI Chat generation failed:", err);
      const errorMsg = err.message || "Failed to reach NVIDIA Nemotron service.";
      setError(errorMsg);

      setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <aside
      className={`fixed inset-0 sm:inset-auto sm:top-0 sm:right-0 z-[100] h-[100dvh] sm:h-full bg-[#0c0818]/98 sm:bg-[#0c0818]/95 backdrop-blur-2xl border-l border-[#c084fc]/25 shadow-2xl flex flex-col transition-all duration-300 ${
        isExpanded ? "w-full md:w-[760px]" : "w-full sm:w-[480px]"
      }`}
      role="complementary"
      aria-label="Cybersecurity Intelligence AI Assistant"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 sm:px-5 py-3 sm:py-3.5 border-b border-[#c084fc]/15 bg-[#0e091c]/90 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#f472b6] p-[1px] shadow-lg shadow-[#c084fc]/20 shrink-0">
            <div className="w-full h-full bg-[#0e091c] rounded-[10px] sm:rounded-[11px] flex items-center justify-center text-[#f472b6]">
              <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-white font-mono truncate">
                NVIDIA NEMOTRON 3 ULTRA
              </span>
              <span className="px-1.5 py-0.2 text-[8px] sm:text-[9px] font-mono rounded-full bg-[#c084fc]/20 text-[#f472b6] border border-[#c084fc]/40 shrink-0">
                550B
              </span>
            </div>
            <p className="text-[9.5px] sm:text-[10px] text-zinc-400 font-mono truncate max-w-[200px] sm:max-w-[240px]">
              0{book.number}: {book.title} · P{currentPage.pageNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleClearHistory}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors hidden sm:block cursor-pointer"
            title={isExpanded ? "Collapse" : "Expand width"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close AI Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Operational Context Sub-bar */}
      <div className="px-3.5 sm:px-5 py-1.5 sm:py-2 bg-[#090514]/70 border-b border-white/5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-zinc-400 shrink-0">
        <span className="flex items-center gap-1.5 truncate">
          <Terminal className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
          <span className="text-zinc-500">SYSTEM:</span> <span className="truncate">{book.discipline}</span>
        </span>
        <span className="shrink-0 text-[9px] sm:text-[10px] text-[#c084fc] font-mono flex items-center gap-1 ml-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-ping" />
          ACTIVE
        </span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-3.5 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[10px] text-zinc-500 font-mono">
              {msg.role === "assistant" ? (
                <>
                  <Bot className="w-3 h-3 text-[#f472b6]" />
                  <span>TACTICAL COPILOT</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3 text-[#c084fc]" />
                  <span>OPERATOR</span>
                </>
              )}
              <span>· {msg.timestamp}</span>
              {msg.isStreaming && (
                <span className="px-1 py-0.2 rounded text-[8px] font-mono bg-[#c084fc]/20 text-[#f472b6] animate-pulse">
                  STREAMING
                </span>
              )}
            </div>

            <div
              className={`rounded-2xl px-4 py-3 text-xs leading-relaxed max-w-[94%] ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-[#8b5cf6] to-[#c084fc] text-white font-medium shadow-md shadow-[#8b5cf6]/20"
                  : "bg-[#140b26]/80 text-zinc-200 border border-[#c084fc]/20"
              }`}
            >
              <div className="whitespace-pre-wrap font-sans space-y-2">
                {msg.content || (
                  <span className="text-zinc-500 italic">Formulating tactical response...</span>
                )}
              </div>

              {msg.role === "assistant" && msg.content && (
                <div className="mt-2 pt-2 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedIndex === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Response</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs py-2">
            <Bot className="w-3.5 h-3.5 text-[#f472b6] animate-spin" />
            <span className="font-mono text-[11px]">Connecting to NVIDIA Nemotron 3 Ultra...</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/50 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold mb-1">NVIDIA AI Service Error</p>
                <button
                  onClick={() => setError(null)}
                  className="text-zinc-400 hover:text-white p-0.5 cursor-pointer -mt-1"
                  title="Dismiss error"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-rose-200/80 mb-2">{error}</p>
              <button
                onClick={() => handleSendMessage(lastPromptRef.current)}
                className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-mono border border-rose-500/40 transition-colors cursor-pointer"
              >
                Retry Request
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-[#090514]/70 border-t border-white/5 shrink-0">
        <div className="flex items-center justify-between mb-1 sm:mb-1.5">
          <p className="text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            Suggested Contextual Queries
          </p>
          <span className="text-[8.5px] sm:text-[9px] font-mono text-[#f472b6]">Page {currentPage.pageNumber}</span>
        </div>
        <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-visible gap-1.5 pb-1 sm:pb-0 [touch-action:pan-x] no-scrollbar">
          {book.suggestedPrompts.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-[10.5px] sm:text-[11px] text-zinc-300 bg-[#140b26] hover:bg-[#1f103d] border border-[#c084fc]/25 hover:border-[#f472b6]/50 rounded-full px-2.5 sm:px-3 py-1 transition-all text-left flex items-center gap-1 disabled:opacity-40 cursor-pointer shrink-0 sm:shrink"
            >
              <span className="whitespace-nowrap sm:whitespace-normal">{prompt}</span>
              <ChevronRight className="w-2.5 h-2.5 text-[#f472b6] shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Formulation Bar */}
      <div className="p-3 sm:p-4 border-t border-[#c084fc]/15 bg-[#0e091c]/95 shrink-0 pb-[max(12px,env(safe-area-inset-bottom))]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={`Ask Nemotron 3 Ultra about ${book.title}...`}
            className="flex-1 bg-[#140b26] border border-[#c084fc]/30 rounded-xl px-3.5 sm:px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#f472b6] transition-colors disabled:opacity-50 min-h-[42px]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 min-h-[42px] min-w-[42px] flex items-center justify-center rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#f472b6] text-[#0b0714] font-bold hover:shadow-[0_0_16px_rgba(244,114,182,0.45)] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between mt-2 px-1 text-[8.5px] sm:text-[9px] text-zinc-500 font-mono">
          <span>Backend: NVIDIA OpenAI API (/v1)</span>
          <span className="text-[#c084fc]">nvidia/nemotron-3-ultra-550b-a55b</span>
        </div>
      </div>
    </aside>
  );
}

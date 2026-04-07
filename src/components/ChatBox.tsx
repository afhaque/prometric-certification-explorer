"use client";

import { useEffect, useRef, useState } from "react";

type Message = { id: string; role: "user" | "assistant"; content: string };

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (content: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, I couldn't connect. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Send greeting once when the panel is first opened
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true);
      sendMessage("__greeting__");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Filter out the hidden greeting trigger message
  const visibleMessages = messages.filter((m) => m.content !== "__greeting__");

  return (
    <>
      {/* Floating bubble button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open certification advisor chat"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-mint shadow-lg flex items-center justify-center hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-mint focus:ring-offset-2"
      >
        {isOpen ? (
          // X icon
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Chat bubble icon
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[540px] flex flex-col rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden">
          {/* Header */}
          <div className="bg-navy px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-mint flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-heading text-sm font-semibold text-white leading-tight">Certification Advisor</p>
              <p className="font-body text-xs text-mint">Powered by AI</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-off-white min-h-0" style={{ minHeight: 0 }}>
            {visibleMessages.length === 0 && isLoading && (
              <TypingIndicator />
            )}
            {visibleMessages.map((m: Message) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm font-body leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-navy text-white rounded-br-sm"
                      : "bg-white text-navy border border-gray-200 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && visibleMessages.length > 0 && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); if (input.trim() && !isLoading) sendMessage(input); }}
            className="flex items-center gap-2 px-3 py-3 border-t border-gray-200 bg-white"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me about your career goals…"
              disabled={isLoading}
              className="flex-1 text-sm font-body bg-gray-50 border border-gray-200 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-mint focus:border-transparent placeholder-gray-400 text-navy disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="w-9 h-9 rounded-full bg-mint flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function TypingIndicator() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm shadow-sm px-4 py-3 inline-flex gap-1 items-center">
      <span className="w-2 h-2 rounded-full bg-mint animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 rounded-full bg-mint animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 rounded-full bg-mint animate-bounce" />
    </div>
  );
}

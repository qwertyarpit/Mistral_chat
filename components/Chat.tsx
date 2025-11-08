// components/Chat.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Message = { role: "user" | "assistant" | "system"; content: string };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Smooth scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Reset textarea height when input is cleared
    if (textareaRef.current && !input) {
      textareaRef.current.style.height = "52px";
    }
  }, [input]);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    const next = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-10) }),
      });
      const data = await res.json();
      const reply: Message = {
        role: "assistant",
        content: data.content ?? "(no reply)",
      };
      setMessages((m) => [...m, reply]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Error contacting model." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const visibleMessages = messages.filter((m) => m.role !== "system");

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Minimal Header */}
      <header className="sticky top-0 z-10 bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-100">Mistral Chat</h1>
          <button
            onClick={signOut}
            className="btn-sign-out btn-secondary text-sm text-white  hover:bg-white hover:text-black transition-all px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600">
            Sign out
          </button>
        </div>
      </header>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {visibleMessages.length === 0 && (
            <div className="text-center text-gray-400 mt-12">
              <p className="text-lg">Start a conversation</p>
              <p className="text-sm mt-2">Ask me anything...</p>
            </div>
          )}
          {visibleMessages.map((m, i) => (
            <div
              key={i}
              className={`flex animate-fade-in ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
              style={{
                animationDelay: m.role === "assistant" ? "100ms" : "0ms",
              }}>
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                  m.role === "user"
                    ? "bg-blue-900 text-gray-100"
                    : "bg-gray-800 text-gray-100 border border-gray-700"
                }`}>
                <p className="leading-relaxed whitespace-pre-wrap break-words">
                  {m.content}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex space-x-1.5">
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sticky Input Area */}
      <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Message Mistral Chat..."
                rows={1}
                className="w-full px-4 py-3 pr-12 border border-gray-600 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500 bg-gray-700 shadow-sm"
                style={{
                  minHeight: "52px",
                  maxHeight: "200px",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.min(
                    target.scrollHeight,
                    200
                  )}px`;
                }}
              />
            </div>
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="btn-send btn-primary px-6 py-3 bg-gray-700 text-white rounded-2xl font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Sending
                </span>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

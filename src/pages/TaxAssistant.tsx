import { useState, useRef, useEffect } from "react";
import { ArrowUp, BadgeCheck, ChevronRight } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import fbrLogo from "@/assets/fbr-logo.jfif";
import ChatBubble from "@/components/ChatBubble";
import TypingIndicator from "@/components/TypingIndicator";

const PROMPT_CATEGORIES = [
  {
    label: "Budget 2025–2026",
    prompts: [
      "Key tax changes in Budget 2025–2026?",
      "How does Budget 2025–2026 affect salaried individuals?",
      "Corporate tax changes in 2025–2026?",
      "FBR revenue target for 2025–2026?",
      "New tax exemptions in Budget 2025–2026?",
      "Projected fiscal deficit for 2025–2026?",
    ],
  },
  {
    label: "Income Tax",
    prompts: [
      "What deductions can I claim?",
      "How do I file a tax return?",
      "Explain the latest tax brackets",
      "Penalties or compliance changes introduced?",
    ],
  },
  {
    label: "Sales Tax",
    prompts: [
      "New sales tax adjustments in 2025–2026?",
      "Sales tax registration requirements?",
    ],
  },
  {
    label: "Customs & Duties",
    prompts: [
      "Customs duty changes proposed?",
      "Export incentives in Budget 2025–2026?",
    ],
  },
];

const TaxAssistant = () => {
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    sendMessage(prompt);
  };

  const [activeCategory, setActiveCategory] = useState(0);

  const hasMessages = messages.length > 1;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="shrink-0 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={fbrLogo}
              alt="FBR Logo"
              className="w-11 h-11 rounded-lg object-cover bg-primary-foreground/10 border border-primary-foreground/20"
            />
            <div>
              <h1 className="text-base font-bold tracking-tight">Tax RAG Agent</h1>
              <span className="text-[11px] opacity-80 font-medium">Federal Board of Revenue - AI Tax Guidance</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-primary-foreground font-medium">
            <BadgeCheck className="w-5 h-5" />
            <span>Verified Sources Only</span>
          </div>
        </div>
        <div className="h-1 bg-accent" />
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto chat-scroll">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 space-y-3">
          {/* Welcome */}
          {!hasMessages && (
            <div className="animate-float-in">
              <div className="bg-card border border-border rounded-lg p-5 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src={fbrLogo} alt="FBR Logo" className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <h2 className="text-base font-bold text-foreground">Welcome to the Tax RAG Agent</h2>
                    <p className="text-xs text-muted-foreground">AI-Powered Federal Tax Guidance</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your AI-powered assistant for federal tax guidance, explanations, and insights. Ask your tax question below and our system will provide formal, concise, and reliable responses.
                </p>
              </div>
            </div>
          )}

          {/* Category Tabs & Quick Prompts - Always visible */}
          <div className={hasMessages ? "" : "animate-float-in"}>
            <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
              {PROMPT_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(idx)}
                  className={`px-3 py-1.5 text-[12px] font-semibold rounded-md border whitespace-nowrap transition-colors ${
                    activeCategory === idx
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PROMPT_CATEGORIES[activeCategory].prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="group flex items-center gap-2 px-3 py-2.5 text-[13px] font-medium rounded-lg border border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <div className="relative flex items-end gap-2 bg-background border border-border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your tax question here..."
              rows={1}
              className="flex-1 bg-transparent text-foreground text-sm resize-none focus:outline-none placeholder:text-muted-foreground/60 py-1.5 max-h-[150px]"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="shrink-0 w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-20 disabled:cursor-not-allowed mb-0.5"
              title="Send"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground/50 text-center mt-1.5">
            Responses sourced exclusively from verified research resources
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="shrink-0 border-t border-border bg-muted/50 py-2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-muted-foreground gap-1">
          <span>Federal Board of Revenue - Tax RAG Agent</span>
          <span>Designed & Developed by MISBAH RIAZ</span>
          <span>Powered by AI Research · All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
};

export default TaxAssistant;

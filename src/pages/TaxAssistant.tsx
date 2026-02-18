import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import fbrLogo from "@/assets/fbr-logo.jfif";
import ChatBubble from "@/components/ChatBubble";
import TypingIndicator from "@/components/TypingIndicator";

const QUICK_PROMPTS = [
  "What deductions can I claim?",
  "How do I file a tax return?",
  "Explain the latest tax brackets",
  "Capital gains tax rules",
];

const TaxAssistant = () => {
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize textarea
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

  const showWelcome = messages.length <= 1;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="shrink-0 border-b border-border/60 bg-card/90 glass sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={fbrLogo} alt="FBR Logo" className="w-9 h-9 rounded-lg object-cover" />
            <div>
              <h1 className="text-[15px] font-bold tracking-tight text-foreground">Tax RAG Assistant</h1>
              <span className="text-[10px] text-muted-foreground font-medium">Verified sources only</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto chat-scroll">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
          {/* Welcome */}
          {showWelcome && (
            <div className="text-center py-10 animate-float-in">
              <img src={fbrLogo} alt="FBR Logo" className="w-14 h-14 rounded-2xl object-cover mx-auto mb-5 shadow-lg" />
              <h2 className="text-xl font-bold text-foreground mb-2">How can I help with your taxes?</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
                Every response is retrieved from verified research - no assumptions, no AI-generated guesses.
              </p>
              <div className="grid grid-cols-2 gap-2 max-w-lg mx-auto">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="px-4 py-3 text-[13px] font-medium rounded-xl border border-border bg-card text-foreground hover:border-accent/50 hover:bg-muted/50 transition-all duration-200 text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t border-border/60 bg-card/90 glass">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <div className="relative flex items-end gap-2 bg-background border border-border rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-accent/40 focus-within:border-accent/50 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a tax question..."
              rows={1}
              className="flex-1 bg-transparent text-foreground text-sm font-medium resize-none focus:outline-none placeholder:text-muted-foreground/50 py-1.5 max-h-[150px]"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-20 disabled:cursor-not-allowed mb-0.5"
              title="Send"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground/40 text-center mt-2">
            Responses sourced exclusively from verified research workflows
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaxAssistant;

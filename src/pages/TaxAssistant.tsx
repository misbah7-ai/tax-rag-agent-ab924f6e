import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Sparkles, Shield, MessageSquare } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import ChatBubble from "@/components/ChatBubble";
import TypingIndicator from "@/components/TypingIndicator";

const QUICK_PROMPTS = [
  "What deductions can I claim?",
  "How do I file a tax return?",
  "What are the latest tax brackets?",
];

const TaxAssistant = () => {
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage } = useChat();
  const { isListening, transcript, startListening, stopListening, clearTranscript } = useSpeechToText();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
    clearTranscript();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMic = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    sendMessage(prompt);
  };

  const showWelcome = messages.length <= 1;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="shrink-0 border-b bg-card/80 glass sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent border-2 border-card" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground">Your AI Tax Assistant</h1>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-accent" />
                <span className="text-[11px] text-muted-foreground font-medium">Verified research only</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-medium">{messages.length - 1} messages</span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto chat-scroll">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Welcome Hero */}
          {showWelcome && (
            <div className="text-center py-8 animate-float-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-5 shadow-xl animate-pulse-ring">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">How can I help with your taxes?</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                Ask any tax-related question — I'll research it through our verified knowledge base and provide accurate, sourced answers.
              </p>
              {/* Quick prompts */}
              <div className="flex flex-wrap justify-center gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="px-4 py-2.5 text-sm font-medium rounded-xl border border-border bg-card text-foreground hover:border-accent hover:shadow-md transition-all duration-200"
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
      <div className="shrink-0 border-t bg-card/80 glass">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          {isListening && (
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-xs font-semibold text-destructive">Recording — speak now...</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {/* Mic */}
            <button
              onClick={toggleMic}
              className={`p-2.5 rounded-xl transition-all duration-200 shrink-0 ${
                isListening
                  ? "bg-destructive text-destructive-foreground animate-mic-pulse"
                  : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              title={isListening ? "Stop recording" : "Voice input"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening..." : "Ask a tax question..."}
                className="w-full px-4 py-3 rounded-xl border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent placeholder:text-muted-foreground/60 transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Send */}
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:shadow-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none shrink-0"
              title="Send"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
            All responses are sourced from verified tax databases — no AI-generated assumptions
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaxAssistant;

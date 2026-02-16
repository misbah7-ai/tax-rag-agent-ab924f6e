import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Settings } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import ChatBubble from "@/components/ChatBubble";
import TypingIndicator from "@/components/TypingIndicator";

const WEBHOOK_STORAGE_KEY = "tax-assistant-webhook-url";

const TaxAssistant = () => {
  const [input, setInput] = useState("");
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem(WEBHOOK_STORAGE_KEY) || "");
  const [showSettings, setShowSettings] = useState(false);
  const { messages, isLoading, sendMessage } = useChat();
  const { isListening, transcript, startListening, stopListening, clearTranscript } = useSpeechToText();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Sync transcript to input
  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    if (!webhookUrl.trim()) {
      setShowSettings(true);
      return;
    }
    sendMessage(input, webhookUrl);
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
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const saveWebhook = () => {
    localStorage.setItem(WEBHOOK_STORAGE_KEY, webhookUrl);
    setShowSettings(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-background">
      {/* Header */}
      <header className="bg-chat-header text-chat-header-foreground px-5 py-4 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-md animate-pulse-gold">
            <span className="text-accent-foreground font-bold text-sm">TA</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Your AI Tax Assistant</h1>
            <p className="text-xs text-chat-header-foreground/60">Powered by verified research</p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg hover:bg-chat-header-foreground/10 transition-colors"
          title="Webhook settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Settings panel */}
      {showSettings && (
        <div className="bg-card border-b px-5 py-4 space-y-2 shrink-0">
          <label className="text-sm font-medium text-foreground">n8n Webhook URL</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-n8n-instance.com/webhook/..."
              className="flex-1 px-3 py-2 text-sm rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              onClick={saveWebhook}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter your n8n webhook URL. All queries will be sent here for processing.
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-5">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t bg-card px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          {/* Mic button */}
          <button
            onClick={toggleMic}
            className={`p-3 rounded-full transition-all ${
              isListening
                ? "bg-destructive text-destructive-foreground animate-pulse"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
            title={isListening ? "Stop recording" : "Start voice input"}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Ask a tax question..."}
            className="flex-1 px-4 py-3 rounded-xl border bg-background text-foreground text-[15px] focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted-foreground"
            disabled={isLoading}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {isListening && (
          <p className="text-xs text-accent font-medium mt-2 ml-14 animate-pulse">
            🎙 Listening... speak now
          </p>
        )}
      </div>
    </div>
  );
};

export default TaxAssistant;

import { useState, useRef, useCallback } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  speechUrl?: string;
  references?: { title: string; url?: string }[];
  timestamp: Date;
}

const WEBHOOK_URL = ""; // User must set this

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hello! I'm your AI Tax Assistant. Ask me any tax-related question — I'll research it for you through our knowledge base. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (text: string, webhookUrl?: string) => {
    const url = webhookUrl || WEBHOOK_URL;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      abortRef.current = new AbortController();

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text.trim() }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text:
          data.text ||
          data.message ||
          data.response ||
          "I apologize, but I was unable to retrieve an answer for your query at this time. Please try rephrasing your question or contact a tax professional for assistance.",
        speechUrl: data.speech || data.audio || undefined,
        references: data.references || data.sources || undefined,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Auto-play speech if available
      if (botMsg.speechUrl) {
        try {
          const audio = new Audio(botMsg.speechUrl);
          await audio.play();
        } catch {
          // Ignore autoplay errors
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") return;

      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: "I'm sorry, I'm currently unable to process your request. This could be due to a connectivity issue or the service being temporarily unavailable. Please try again shortly.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, sendMessage };
}

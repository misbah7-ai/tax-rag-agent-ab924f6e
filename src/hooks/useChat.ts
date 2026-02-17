import { useState, useRef, useCallback } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  speechUrl?: string;
  references?: { title: string; url?: string }[];
  timestamp: Date;
}

const WEBHOOK_URL = "https://taxragagent.app.n8n.cloud/webhook/lovable-chat";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hello! I'm your AI Tax Assistant. I do not generate answers on my own — every response is sourced exclusively from our verified research workflow. Ask me any tax-related question and I'll retrieve the relevant information for you.",
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
          "Our research workflow did not return a result for this query. This means the information was not found in our verified knowledge base. Please rephrase your question or consult a tax professional for further assistance.",
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
        text: "Unable to reach the research workflow at this time. No answer can be provided without a verified source. Please check your connection and try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, sendMessage };
}

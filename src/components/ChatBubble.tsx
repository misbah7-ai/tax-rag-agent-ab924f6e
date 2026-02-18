import { ChatMessage } from "@/hooks/useChat";
import { Copy, Download, Check, FileText, ExternalLink } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  message: ChatMessage;
}

const ChatBubble = ({ message }: Props) => {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = message.text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = () => {
    const blob = new Blob([message.text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tax-response-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex items-start gap-2 animate-float-in ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`max-w-[85%] space-y-1 flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        {/* Label */}
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
          {isUser ? "You" : "Tax Assistant"}
        </span>

        {/* Bubble */}
        <div
          className={`px-4 py-3 text-[14px] leading-relaxed ${
            isUser
              ? "bg-primary text-primary-foreground rounded-lg rounded-br-sm"
              : "bg-card text-card-foreground rounded-lg rounded-bl-sm border border-border"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.text}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-headings:text-card-foreground prose-p:text-card-foreground prose-strong:text-card-foreground prose-li:text-card-foreground prose-ul:my-1 prose-ol:my-1 prose-p:my-1.5 prose-headings:my-2">
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Action buttons for assistant messages */}
        {!isUser && (
          <div className="flex items-center gap-0.5 px-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-primary/5"
              title="Copy response"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-primary/5"
              title="Download response"
            >
              <Download className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        )}

        {/* References */}
        {message.references && message.references.length > 0 && (
          <div className="bg-[hsl(var(--blue-soft))] rounded-lg p-3 space-y-1.5 w-full border border-primary/10">
            <p className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              Sources
            </p>
            {message.references.map((ref, i) => (
              <div key={i} className="text-xs text-foreground">
                {ref.url ? (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary transition-colors underline underline-offset-2"
                  >
                    {ref.title}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span>{ref.title}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-muted-foreground/50 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;

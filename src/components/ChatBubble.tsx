import { ChatMessage } from "@/hooks/useChat";
import { Volume2, FileText, ExternalLink, Bot, User } from "lucide-react";

interface Props {
  message: ChatMessage;
}

const ChatBubble = ({ message }: Props) => {
  const isUser = message.role === "user";

  const playSpeech = () => {
    if (message.speechUrl) {
      const audio = new Audio(message.speechUrl);
      audio.play();
    }
  };

  return (
    <div className={`flex items-end gap-3 animate-float-in ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-gradient-to-br from-accent to-[hsl(var(--gold-glow))] text-accent-foreground"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div className={`max-w-[78%] space-y-1.5 flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        {/* Label */}
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
          {isUser ? "You" : "Tax Assistant"}
        </span>

        {/* Bubble */}
        <div
          className={`px-4 py-3 text-[14.5px] leading-relaxed ${
            isUser
              ? "bg-primary text-primary-foreground rounded-2xl rounded-br-lg shadow-md"
              : "bg-card text-card-foreground rounded-2xl rounded-bl-lg shadow-sm border border-border/50"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>

        {/* Speech button */}
        {message.speechUrl && (
          <button
            onClick={playSpeech}
            className="flex items-center gap-1.5 text-[11px] font-medium text-accent hover:text-accent/80 transition-colors px-1"
          >
            <Volume2 className="w-3.5 h-3.5" />
            Play audio
          </button>
        )}

        {/* References */}
        {message.references && message.references.length > 0 && (
          <div className="bg-[hsl(var(--blue-soft))] rounded-xl p-3 space-y-1.5 w-full border border-[hsl(var(--blue-accent)/0.15)]">
            <p className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              References
            </p>
            {message.references.map((ref, i) => (
              <div key={i} className="text-xs text-foreground">
                {ref.url ? (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-accent transition-colors underline underline-offset-2"
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
        <span className="text-[10px] text-muted-foreground/60 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;

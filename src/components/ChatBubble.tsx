import { ChatMessage } from "@/hooks/useChat";
import { Volume2, FileText, ExternalLink } from "lucide-react";

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
    <div className={`flex items-start gap-3 px-4 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-md">
          <span className="text-primary-foreground text-sm font-bold">TA</span>
        </div>
      )}

      <div className={`max-w-[80%] space-y-2 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        {/* Bubble */}
        <div
          className={`px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
            isUser ? "chat-bubble-user" : "chat-bubble-bot"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>

        {/* Speech button */}
        {message.speechUrl && (
          <button
            onClick={playSpeech}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            Play response
          </button>
        )}

        {/* References */}
        {message.references && message.references.length > 0 && (
          <div className="bg-blue-soft rounded-xl p-3 space-y-1.5 w-full">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
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
                    className="flex items-center gap-1 hover:text-accent transition-colors underline"
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
        <span className="text-[10px] text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;

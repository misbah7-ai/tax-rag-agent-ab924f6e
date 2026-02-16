import { Bot } from "lucide-react";

const TypingIndicator = () => (
  <div className="flex items-end gap-3 animate-float-in">
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-[hsl(var(--gold-glow))] flex items-center justify-center shrink-0 shadow-sm">
      <Bot className="w-4 h-4 text-accent-foreground" />
    </div>
    <div className="space-y-1.5">
      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
        Tax Assistant
      </span>
      <div className="bg-card rounded-2xl rounded-bl-lg px-5 py-4 shadow-sm border border-border/50">
        <div className="flex gap-1.5">
          <span className="typing-dot w-2 h-2 rounded-full bg-accent inline-block" />
          <span className="typing-dot w-2 h-2 rounded-full bg-accent inline-block" />
          <span className="typing-dot w-2 h-2 rounded-full bg-accent inline-block" />
        </div>
      </div>
    </div>
  </div>
);

export default TypingIndicator;

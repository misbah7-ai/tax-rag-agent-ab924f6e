const TypingIndicator = () => (
  <div className="flex items-start gap-2 animate-float-in">
    <div className="space-y-1">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
        Tax Assistant
      </span>
      <div className="bg-card rounded-lg rounded-bl-sm px-4 py-3 border border-border">
        <div className="flex gap-1.5">
          <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
          <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
          <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
        </div>
      </div>
    </div>
  </div>
);

export default TypingIndicator;

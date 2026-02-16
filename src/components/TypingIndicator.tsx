const TypingIndicator = () => (
  <div className="flex items-start gap-3 px-4">
    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
      <span className="text-primary-foreground text-sm font-bold">TA</span>
    </div>
    <div className="chat-bubble-bot px-5 py-4 shadow-sm">
      <div className="flex gap-1.5">
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground inline-block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground inline-block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground inline-block" />
      </div>
    </div>
  </div>
);

export default TypingIndicator;

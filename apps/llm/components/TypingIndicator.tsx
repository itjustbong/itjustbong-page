"use client";

export function TypingIndicator() {
  return (
    <div className="animate-message-in flex items-center gap-3 px-1">
      <div className="flex items-center gap-1.5">
        <span className="typing-dot h-2 w-2 rounded-full bg-primary/60" />
        <span className="typing-dot h-2 w-2 rounded-full bg-primary/60" />
        <span className="typing-dot h-2 w-2 rounded-full bg-primary/60" />
      </div>
      <span className="text-sm text-muted-foreground">답변을 생성하고 있습니다</span>
    </div>
  );
}

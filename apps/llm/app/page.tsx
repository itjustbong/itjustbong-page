"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { Send, AlertCircle } from "lucide-react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatMessage } from "@/components/ChatMessage";
import { TypingIndicator } from "@/components/TypingIndicator";

const transport = new DefaultChatTransport({ api: "/api/chat" });

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";
  const isStreaming = status === "streaming";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 입력창 자동 높이 조절
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // 첫 메시지일 때 애니메이션 트리거
    if (messages.length === 0) {
      setIsTransitioning(true);
      // 애니메이션 후 메시지 전송
      setTimeout(() => {
        sendMessage({ text: input });
        setInput("");
        setIsTransitioning(false);
      }, 300);
    } else {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (messages.length === 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        sendMessage({ text: suggestion });
        setIsTransitioning(false);
      }, 300);
    } else {
      sendMessage({ text: suggestion });
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-[calc(100dvh-56px)] flex-col">
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages && !isTransitioning ? (
          <WelcomeScreen
            onSuggestionClick={handleSuggestionClick}
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        ) : (
          <div
            className={`mx-auto max-w-3xl px-4 py-6 ${isTransitioning ? "animate-fade-in" : ""}`}
          >
            <div className="space-y-6">
              {messages
                .filter((message) => message.role !== "system")
                .map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role as "user" | "assistant"}
                    content={message.parts
                      .filter((part) => part.type === "text")
                      .map((part) => (part.type === "text" ? part.text : ""))
                      .join("")}
                    isStreaming={
                      isStreaming && message === messages[messages.length - 1]
                    }
                  />
                ))}

              {/* 로딩 인디케이터 */}
              {isLoading &&
                messages[messages.length - 1]?.role !== "assistant" && (
                  <TypingIndicator />
                )}

              {/* 에러 메시지 */}
              {error && (
                <div className="animate-message-in flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <div>
                    <p className="text-sm font-medium text-destructive">
                      오류가 발생했습니다
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {error.message || "다시 시도해주세요."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* 입력 영역 - 채팅 시작 후에만 표시 */}
      {hasMessages && (
        <div className="shrink-0 border-t border-border/50 bg-background/80 px-4 py-4 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-3xl items-end gap-3"
          >
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="질문을 입력하세요..."
                rows={1}
                className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 pr-4 text-sm text-foreground placeholder-muted-foreground shadow-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              aria-label="전송"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          <p className="mx-auto mt-3 max-w-3xl text-center text-xs text-muted-foreground">
            블로그와 이력서 콘텐츠를 기반으로 답변합니다. 정확하지 않을 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}

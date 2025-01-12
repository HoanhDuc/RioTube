"use client";

import { Avatar } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].role === "assistant" &&
      currentMessageIndex < messages[messages.length - 1].content.length
    ) {
      const timer = setTimeout(() => {
        setDisplayText(
          messages[messages.length - 1].content.slice(
            0,
            currentMessageIndex + 1
          )
        );
        setCurrentMessageIndex(currentMessageIndex + 1);
      }, 20);

      return () => clearTimeout(timer);
    }
  }, [currentMessageIndex, messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response.content,
        },
      ]);
      setDisplayText("");
      setCurrentMessageIndex(0);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const { data: session } = useSession();

  return (
    <div className="container mx-auto mt-8 max-w-4xl h-[80vh] flex flex-col bg-black">
      {/* Chat Messages */}
      <div className="flex-1 overflow-auto p-4 bg-black border border-primary rounded-xl mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex items-center gap-2 ${
              message.role === "user"
                ? "text-right flex-row-reverse"
                : "text-left"
            }`}
          >
            <Avatar
              src={
                message.role === "user" ? session?.user?.picture : "/logo.svg"
              }
              className={`${message.role === "user" ? "" : "bg-primary"}`}
            />
            <div
              className={`inline-block p-4 rounded-2xl max-w-[80%] ${
                message.role === "user"
                  ? "bg-primary/10 border border-primary text-primary-foreground"
                  : "bg-secondary/10 border border-secondary text-secondary-foreground"
              }`}
            >
              {message.role === "assistant" && index === messages.length - 1 ? (
                <div className="rounded-lg">
                  {displayText || message.content}
                </div>
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left">
            <div className="inline-block p-4 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary-foreground">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-.3s]" />
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-.5s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-4 rounded-xl bg-secondary/10 border border-secondary text-secondary-foreground placeholder-secondary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`px-6 py-4 bg-primary/10 border border-secondary text-secondary-foreground rounded-xl transition-all hover:bg-primary/20 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

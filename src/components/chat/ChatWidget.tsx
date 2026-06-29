"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ChatWidget.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "mdm-chat-history";
const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm the MDM assistant. Ask me about our services, portfolio, or anything about MDM Events Management. You can also switch to Feedback mode to leave a review!",
};

function loadHistory(): Message[] {
  if (typeof window === "undefined") return [WELCOME_MESSAGE];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore */
  }
  return [WELCOME_MESSAGE];
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"chat" | "feedback">("chat");
  const [messages, setMessages] = useState<Message[]>(() => loadHistory());
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    company: "",
    rating: 0,
    comment: "",
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });

      const text = await res.text();
      let data: { response?: string; error?: string };
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Server returned non-JSON: ${text.slice(0, 100)}`);
      }
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      const aiMsg: Message = { role: "assistant", content: data.response! };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      const errorMsg: Message = {
        role: "assistant",
        content: `Error: ${message}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFeedbackForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRatingClick = (rating: number) => {
    setFeedbackForm((prev) => ({ ...prev, rating }));
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError("");

    if (
      !feedbackForm.name.trim() ||
      !feedbackForm.email.trim() ||
      feedbackForm.rating === 0 ||
      !feedbackForm.comment.trim()
    ) {
      setFeedbackError("Please fill in all required fields.");
      return;
    }

    setIsFeedbackSubmitting(true);
    try {
      const res = await fetch("/api/feedback/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: feedbackForm.name.trim(),
          email: feedbackForm.email.trim(),
          company: feedbackForm.company.trim() || null,
          rating: feedbackForm.rating,
          comment: feedbackForm.comment.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit feedback");
      }

      setFeedbackSubmitted(true);
      setFeedbackForm({ name: "", email: "", company: "", rating: 0, comment: "" });
    } catch (err) {
      setFeedbackError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setIsFeedbackSubmitting(false);
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}

      <button
        className={styles.fab}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.header}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/mdm_logo_t.png" alt="MDM Events Management" className={styles.logo} />
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Close">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className={styles.toggleRow}>
            <button
              className={`${styles.toggleBtn} ${mode === "chat" ? styles.toggleActive : ""}`}
              onClick={() => setMode("chat")}
            >
              Chat
            </button>
            <button
              className={`${styles.toggleBtn} ${mode === "feedback" ? styles.toggleActive : ""}`}
              onClick={() => setMode("feedback")}
            >
              Feedback
            </button>
          </div>

          {mode === "chat" ? (
            <>
              <div className={styles.messages} ref={chatContainerRef}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`${styles.bubble} ${msg.role === "user" ? styles.userBubble : styles.aiBubble}`}
                  >
                    {msg.content}
                  </div>
                ))}
                {isLoading && (
                  <div className={`${styles.bubble} ${styles.aiBubble} ${styles.typing}`}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className={styles.inputRow}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                <button
                  className={styles.sendBtn}
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  aria-label="Send"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>

              <button className={styles.clearBtn} onClick={clearChat}>
                Clear conversation
              </button>
            </>
          ) : (
            <div className={styles.feedbackContainer}>
              {feedbackSubmitted ? (
                <div className={styles.feedbackSuccess}>
                  <span className={styles.successIcon}>✓</span>
                  <h3>Thank you for your feedback!</h3>
                  <p>We appreciate your input.</p>
                  <button
                    className={styles.backToChatBtn}
                    onClick={() => {
                      setFeedbackSubmitted(false);
                      setMode("chat");
                    }}
                  >
                    Back to Chat
                  </button>
                </div>
              ) : (
                <form className={styles.feedbackForm} onSubmit={handleFeedbackSubmit}>
                  <p className={styles.feedbackIntro}>
                    We&apos;d love to hear your thoughts! Please leave us a review.
                  </p>

                  <input
                    type="text"
                    name="name"
                    placeholder="Name *"
                    className={styles.feedbackInput}
                    value={feedbackForm.name}
                    onChange={handleFeedbackChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    className={styles.feedbackInput}
                    value={feedbackForm.email}
                    onChange={handleFeedbackChange}
                    required
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company (optional)"
                    className={styles.feedbackInput}
                    value={feedbackForm.company}
                    onChange={handleFeedbackChange}
                  />

                  <div className={styles.ratingRow}>
                    <span className={styles.ratingLabel}>Rating *</span>
                    <div className={styles.stars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`${styles.star} ${star <= feedbackForm.rating ? styles.starActive : ""}`}
                          onClick={() => handleRatingClick(star)}
                          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        >
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill={star <= feedbackForm.rating ? "#f59e0b" : "none"}
                            stroke="#f59e0b"
                            strokeWidth="2"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    name="comment"
                    placeholder="Your comments *"
                    className={styles.feedbackTextarea}
                    rows={4}
                    value={feedbackForm.comment}
                    onChange={handleFeedbackChange}
                    required
                  />

                  {feedbackError && <p className={styles.feedbackError}>{feedbackError}</p>}

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isFeedbackSubmitting}
                  >
                    {isFeedbackSubmitting ? "Submitting..." : "Submit Feedback"}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className={styles.resizeHandle} />
        </div>
      )}
    </>
  );
}

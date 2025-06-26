import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessageToSession,
  addSession,
  renameSession,
  updateSessionMessage,
} from "@/features/chatSessionsSlice";
import { askToOpenRouter } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ChevronUpIcon, Copy, Pen, Share2, User } from "lucide-react";
import { RootState } from "@/store";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Card, CardContent } from "./ui/card";

export default function Chat() {
  const dispatch = useDispatch();
  const { sessions, activeSessionId } = useSelector(
    (state: RootState) => state.chat
  );
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  const [editing, setEditing] = useState<null | number>(null);
  const [editedText, setEditedText] = useState("");

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!activeSessionId) {
      dispatch(addSession());
    }
  }, [activeSessionId, dispatch]);

  const sendMessage = async () => {
    if (!input.trim() || !activeSessionId) return;

    const userMsg = input.trim();

    dispatch(
      addMessageToSession({
        sessionId: activeSessionId,
        message: { role: "user", content: userMsg },
      })
    );

    if (messages.length === 0) {
      const preview =
        userMsg.length > 30 ? userMsg.slice(0, 30) + "..." : userMsg;
      dispatch(renameSession({ sessionId: activeSessionId, title: preview }));
    }

    setInput("");
    setLoading(true);

    try {
      const reply = await askToOpenRouter(userMsg);
      dispatch(
        addMessageToSession({
          sessionId: activeSessionId,
          message: { role: "ai", content: reply },
        })
      );
    } catch {
      dispatch(
        addMessageToSession({
          sessionId: activeSessionId,
          message: { role: "ai", content: "❌ Gagal menjawab." },
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-16 py-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-4 max-w-2xl mx-auto ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div className="text-xl select-none mt-1 text-muted-foreground">
                {msg.role === "user" ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>

              {/* Bubble */}
              <Card
                className={`relative w-fit max-w-[80%] md:max-w-[65ch] rounded-xl shadow-none pt-10 ${
                  msg.role === "user"
                    ? "bg-white text-black dark:bg-[#1e1e20] dark:text-white ml-auto"
                    : "bg-[#f7f7f8] text-black dark:bg-[#2a2b32] dark:text-white"
                }`}
              >
                {/* Action Buttons */}
                <div className="absolute top-2 right-3 flex space-x-1">
                  <TooltipProvider>
                    {/* Copy */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-8 h-8 text-muted-foreground hover:text-primary"
                          onClick={() =>
                            navigator.clipboard.writeText(msg.content)
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Salin</TooltipContent>
                    </Tooltip>

                    {/* Edit - hanya user */}
                    {msg.role === "user" && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 text-muted-foreground hover:text-primary"
                            onClick={() => {
                              setEditedText(msg.content);
                              setEditing(idx);
                            }}
                          >
                            <Pen className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                    )}

                    {/* Share */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-8 h-8 text-muted-foreground hover:text-primary"
                          onClick={() => {
                            const urlEncoded = encodeURIComponent(msg.content);
                            const wa = `https://wa.me/?text=${urlEncoded}`;
                            window.open(wa, "_blank");
                          }}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bagikan</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Markdown Content */}
                <CardContent className="prose dark:prose-invert prose-p:my-2 prose-pre:my-3 prose-pre:rounded-lg max-w-none px-5 py-4 md:px-6 md:py-5 leading-relaxed text-left text-base">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-4 max-w-2xl mx-auto"
            >
              <div className="p-8 rounded-2xl w-full bg-muted text-muted-foreground">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 bg-muted-foreground rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 md:px-16 pb-6">
        <div className="max-w-2xl mx-auto space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <div className="relative">
              <Textarea
                ref={textareaRef}
                className="resize-none rounded-2xl bg-muted py-5 pr-11 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Ketik pesan kamu di sini..."
                value={input}
                rows={1}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (e.ctrlKey || e.metaKey) {
                      e.preventDefault();
                      const textarea = e.currentTarget;
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const newValue =
                        input.substring(0, start) + "\n" + input.substring(end);
                      setInput(newValue);
                      requestAnimationFrame(() => {
                        textarea.selectionStart = textarea.selectionEnd =
                          start + 1;
                      });
                    } else {
                      e.preventDefault();
                      sendMessage();
                    }
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                disabled={loading}
                className="absolute bottom-3 right-2.5 text-muted-foreground hover:text-primary"
              >
                <ChevronUpIcon className="w-4 h-4" />
              </Button>
            </div>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Tekan <kbd className="px-1 py-0.5 bg-muted rounded">Enter</kbd>{" "}
            untuk kirim,{" "}
            <kbd className="px-1 py-0.5 bg-muted rounded">Ctrl + Enter</kbd>{" "}
            untuk baris baru
          </p>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editing !== null} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pesan Kamu</DialogTitle>
          </DialogHeader>

          <Textarea
            className="bg-muted border-none shadow-none"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={6}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Batal
            </Button>
            <Button
              onClick={async () => {
                if (editing !== null && activeSessionId) {
                  // Update pesan user di Redux
                  dispatch(
                    updateSessionMessage({
                      sessionId: activeSessionId,
                      messageIndex: editing,
                      newContent: editedText,
                    })
                  );

                  setEditing(null);
                  setLoading(true);

                  try {
                    // Kirim ulang ke AI
                    const aiReply = await askToOpenRouter(editedText);

                    dispatch(
                      addMessageToSession({
                        sessionId: activeSessionId,
                        message: { role: "ai", content: aiReply },
                      })
                    );
                  } catch {
                    dispatch(
                      addMessageToSession({
                        sessionId: activeSessionId,
                        message: {
                          role: "ai",
                          content: "❌ Gagal menjawab ulang.",
                        },
                      })
                    );
                  } finally {
                    setLoading(false);
                  }
                }
              }}
            >
              Simpan & Kirim Ulang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

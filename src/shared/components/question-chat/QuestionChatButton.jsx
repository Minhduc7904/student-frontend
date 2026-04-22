import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, X, Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { questionChatService } from '../../../core/services/modules/questionChatService';
import MarkdownRenderer from '../markdown/MarkdownRenderer';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normalizeMessages = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
};

const injectQuestionMessage = (messages, questionTitle) => {
    if (!questionTitle) return messages || [];

    const firstMsg = {
        _system: true,
        role: 'AI',
        content: `${questionTitle}`,
        createdAt: new Date().toISOString(),
    };

    // Nếu đã có rồi thì không inject nữa
    const hasSystem = messages?.some((m) => m?._system);
    if (hasSystem) return messages;

    return [firstMsg, ...(messages || [])];
};

const resolveRole = (role) => {
    const normalized = String(role || '').trim().toUpperCase();
    return normalized === 'AI' || normalized === 'ASSISTANT' || normalized === 'BOT' ? 'AI' : 'USER';
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

const ChatMessage = memo(({ message }) => {
    const role = resolveRole(message?.role);
    const isAI = role === 'AI';

    return (
        <div className={`flex gap-2.5 ${isAI ? '' : 'flex-row-reverse'}`}>
            <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isAI
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                    }`}
            >
                {isAI ? <Bot size={14} /> : <User size={14} />}
            </div>

            <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${isAI
                    ? 'rounded-tl-md bg-slate-100 text-slate-800'
                    : 'rounded-tr-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                    }`}
            >
                {isAI ? (
                    <MarkdownRenderer
                        content={message?.content || ''}
                        className="question-chat-ai-message"
                        imgClassNameSize="max-w-full max-h-[300px]"
                    />
                ) : (
                    <p className="whitespace-pre-wrap">{message?.content || ''}</p>
                )}
            </div>
        </div>
    );
});

ChatMessage.displayName = 'ChatMessage';

const ChatTypingIndicator = memo(() => (
    <div className="flex gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white">
            <Bot size={14} />
        </div>
        <div className="rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3">
            <div className="flex items-center gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
            </div>
        </div>
    </div>
));

ChatTypingIndicator.displayName = 'ChatTypingIndicator';

// ─── Chat Panel (Portal) ──────────────────────────────────────────────────────

const ChatPanel = memo(({ onClose, chatId, questionId, questionTitle }) => {
    const [currentChatId, setCurrentChatId] = useState(chatId);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [sending, setSending] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [error, setError] = useState(null);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom
    const scrollToBottom = useCallback(() => {
        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, sending, scrollToBottom]);

    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 200);
    }, []);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Initialize chat
    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            if (!questionId) return;
            setLoadingMessages(true);
            setError(null);

            try {
                const listResponse = await questionChatService.getMyChats({
                    questionId,
                    page: 1,
                    limit: 1,
                    sortBy: 'updatedAt',
                    sortOrder: 'desc',
                });

                if (cancelled) return;

                const existingChats = normalizeMessages(listResponse?.data);

                if (existingChats.length > 0) {
                    const chat = existingChats[0];
                    const id = chat?.chatId ?? chat?.id;
                    setCurrentChatId(id);

                    // GET /question-chats/:id → includes messages[]
                    const detailResponse = await questionChatService.getChatById(id);

                    if (cancelled) return;

                    const chatDetail = detailResponse?.data?.data ?? detailResponse?.data;
                    const loadedMessages = Array.isArray(chatDetail?.messages) ? chatDetail.messages : [];

                    // Normalize: prefer contentHtml for AI messages
                    const normalized = loadedMessages.map((msg) => ({
                        ...msg,
                        content: (msg?.role === 'AI' && msg?.contentHtml) ? msg.contentHtml : (msg?.content || ''),
                    }));

                    setMessages(injectQuestionMessage(normalized, questionTitle));
                } else {
                    const createResponse = await questionChatService.createChat({
                        questionId: Number(questionId),
                        title: `Cuộc hội thoại với câu hỏi #${questionId}`,
                    });

                    if (cancelled) return;
                    const newChat = createResponse?.data?.data ?? createResponse?.data;
                    setCurrentChatId(newChat?.chatId ?? newChat?.id);
                    setMessages(injectQuestionMessage([], questionTitle));
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('Failed to initialize chat:', err);
                    setError('Không thể mở cuộc hội thoại. Vui lòng thử lại.');
                }
            } finally {
                if (!cancelled) setLoadingMessages(false);
            }
        };

        init();
        return () => { cancelled = true; };
    }, [questionId, questionTitle]);

    // Send message
    const handleSend = useCallback(async () => {
        const trimmed = inputValue.trim();
        if (!trimmed || !currentChatId || sending) return;

        const userMsg = {
            _tempId: Date.now(),
            chatId: currentChatId,
            role: 'USER',
            content: trimmed,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue('');
        setSending(true);
        setError(null);

        try {
            // API: role='USER' → server saves user msg + auto-generates AI reply
            // Response returns the AI message only
            const response = await questionChatService.sendMessage({
                chatId: Number(currentChatId),
                role: 'USER',
                content: trimmed,
            });

            const aiMessage = response?.data?.data ?? response?.data;

            if (aiMessage) {
                // Prefer contentHtml (pre-rendered markdown+LaTeX) over raw content
                const normalizedAiMsg = {
                    ...aiMessage,
                    content: aiMessage?.contentHtml || aiMessage?.content || '',
                };

                setMessages((prev) => [...prev, normalizedAiMsg]);
            }
        } catch (err) {
            console.error('Failed to send message:', err);
            setError('Gửi tin nhắn thất bại. Vui lòng thử lại.');
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    }, [inputValue, currentChatId, sending]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    const handleRetry = useCallback(() => {
        setCurrentChatId(null);
        setMessages([]);
        setError(null);
    }, []);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6" onClick={onClose}>
            {/* Backdrop */}
            <div className="fixed " />

            {/* Chat Window */}
            <div
                className="relative z-10 flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:h-[80vh] h-[80vh]"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'chatSlideUp 0.25s ease-out' }}
            >
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
                            <Bot size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Trợ lý AI</p>
                            <p className="text-[11px] text-slate-500">Hỏi đáp về câu hỏi này</p>

                        </div>

                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-slate-600"
                        aria-label="Đóng chat"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Messages */}
                <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-3">
                    {loadingMessages && (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                            <Loader2 size={24} className="animate-spin" />
                            <p className="text-xs">Đang tải cuộc trò chuyện...</p>
                        </div>
                    )}

                    {!loadingMessages && error && (
                        <div className="flex h-full flex-col items-center justify-center gap-3">
                            <div className="rounded-full bg-red-50 p-3">
                                <AlertCircle size={24} className="text-red-400" />
                            </div>
                            <p className="text-center text-xs text-red-600">{error}</p>
                            <button
                                type="button"
                                onClick={handleRetry}
                                className="cursor-pointer rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
                            >
                                Thử lại
                            </button>
                        </div>
                    )}

                    {!loadingMessages && !error && messages.length === 0 && (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                            <div className="rounded-full bg-amber-50 p-3">
                                <MessageCircle size={24} className="text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700">Bắt đầu hỏi đáp</p>
                                <p className="mt-1 max-w-[220px] text-xs text-slate-500">
                                    Hãy đặt câu hỏi về bài tập này, AI sẽ giải thích chi tiết cho bạn.
                                </p>
                            </div>
                        </div>
                    )}

                    {!loadingMessages &&
                        !error &&
                        messages.map((msg, idx) => (
                            <ChatMessage
                                key={msg?.messageId ?? msg?.id ?? msg?._tempId ?? idx}
                                message={msg}
                            />
                        ))}

                    {sending && <ChatTypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="shrink-0 border-t border-slate-100 bg-slate-50/50 px-3 py-3">
                    {error && !loadingMessages ? null : (
                        <div className="flex items-end gap-2">
                            <textarea
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Nhập câu hỏi..."
                                disabled={sending || loadingMessages}
                                rows={1}
                                className="flex-1 resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-amber-300 focus:ring-1 focus:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
                                style={{ maxHeight: '100px' }}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleSend}
                                disabled={!inputValue.trim() || sending || loadingMessages}
                                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                                aria-label="Gửi tin nhắn"
                            >
                                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            </button>
                        </div>
                    )}
                    <p className="mt-2 text-center text-[10px] text-slate-400">
                        AI có thể mắc sai sót. Hãy kiểm tra thông tin quan trọng.
                    </p>
                </div>
            </div>

            {/* Slide-up animation */}
            <style>{`
                @keyframes chatSlideUp {
                    from { opacity: 0; transform: translateY(24px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>,
        document.body
    );
});

ChatPanel.displayName = 'ChatPanel';

// ─── Main Component ───────────────────────────────────────────────────────────

const QuestionChatButton = ({ questionId, questionTitle }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = useCallback(() => setIsOpen(true), []);
    const handleClose = useCallback(() => setIsOpen(false), []);

    return (
        <>
            <button
                type="button"
                onClick={handleOpen}
                className="group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-all duration-200 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 hover:shadow-sm"
                aria-label="Hỏi đáp AI"
            >
                <MessageCircle size={14} />
                <span>Hỏi đáp AI</span>
                <span className="inline-flex h-4 items-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 text-[9px] font-bold text-white">
                    AI
                </span>
            </button>

            {isOpen && (
                <ChatPanel
                    onClose={handleClose}
                    questionId={questionId}
                    questionTitle={questionTitle}
                />
            )}
        </>
    );
};

QuestionChatButton.displayName = 'QuestionChatButton';

export default memo(QuestionChatButton);

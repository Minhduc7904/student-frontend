import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    Clipboard,
    ExternalLink,
    FileText,
    Image,
    Loader2,
    Paperclip,
    RefreshCw,
    Send,
    Trash2,
    UploadCloud,
} from "lucide-react";
import { learningItemService } from "../../../../../core/services";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILES = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt";

const formatFileSize = (size = 0) => {
    if (!size) return "";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

const getFallbackSubmission = (homeworkContent) => {
    return homeworkContent?.homeworkSubmit || homeworkContent?.progress?.homeworkSubmit || null;
};

const getErrorMessage = (error) => {
    return (
        error?.response?.data?.message ||
        error?.data?.message ||
        error?.message ||
        "Không thể nộp bài. Vui lòng thử lại."
    );
};

const resolveSubmissionList = (payload) => {
    const data = payload?.data?.data || payload?.data || payload || {};
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.homeworkSubmits)) return data.homeworkSubmits;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;
    return [];
};

const createFileItem = (file) => ({
    id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(16).slice(2)}`,
    file,
    previewUrl: file.type?.startsWith("image/") ? URL.createObjectURL(file) : null,
});

const isSameFile = (a, b) => (
    a?.name === b?.name &&
    a?.size === b?.size &&
    a?.lastModified === b?.lastModified
);

const isImageFile = (mimeType = "", name = "") => {
    if (mimeType?.startsWith("image/")) return true;
    return /\.(avif|gif|jpe?g|png|webp)$/i.test(name || "");
};

const isSubmissionGraded = (submit) => {
    const status = String(submit?.status || submit?.submitStatus || submit?.gradingStatus || "").toUpperCase();
    return Boolean(submit?.gradedAt || submit?.points != null || status === "GRADED");
};

const normalizeAttachment = (attachment, index = 0) => {
    const media = attachment?.media || attachment || {};
    const mediaId = attachment?.mediaId ?? media?.mediaId;
    if (mediaId == null) return null;

    return {
        key: `${mediaId}-${attachment?.usageId ?? index}`,
        mediaId,
        name: media?.originalName || attachment?.originalName || `File #${mediaId}`,
        viewUrl: media?.viewUrl || attachment?.viewUrl || "",
        mimeType: media?.mimeType || attachment?.mimeType || "",
        fileSize: media?.fileSize || attachment?.fileSize || 0,
        alt: media?.alt ?? attachment?.alt ?? media?.altText ?? attachment?.altText ?? "",
    };
};

const getAttachmentsFromSubmit = (submit) => {
    const attachments = Array.isArray(submit?.attachments) ? submit.attachments : [];
    const normalized = attachments.map(normalizeAttachment).filter(Boolean);
    if (normalized.length) return normalized;

    const mediaIds = Array.isArray(submit?.mediaIds) ? submit.mediaIds : [];
    return mediaIds.map((mediaId, index) => normalizeAttachment({ mediaId }, index)).filter(Boolean);
};

const FileIcon = ({ previewUrl, name, mimeType }) => {
    if (previewUrl) {
        return <img src={previewUrl} alt={name} className="h-20 w-full rounded-xl object-cover sm:h-24" />;
    }

    const isImage = isImageFile(mimeType, name);
    return (
        <div className="flex h-20 w-full items-center justify-center rounded-xl bg-blue-50 text-blue-800 sm:h-24">
            {isImage ? <Image size={24} /> : <FileText size={24} />}
        </div>
    );
};

const ExistingAttachmentCard = ({ attachment, disabled, onRemove }) => {
    const previewUrl = isImageFile(attachment.mimeType, attachment.name) ? attachment.viewUrl : null;

    return (
    <div className="group relative min-w-0 rounded-2xl border border-blue-100 bg-white p-2 shadow-sm transition hover:border-blue-200">
        <FileIcon previewUrl={previewUrl} name={attachment.name} mimeType={attachment.mimeType} />
        <div className="mt-2 min-w-0 pr-8">
            <p className="max-w-full truncate text-sm font-semibold text-blue-950" title={attachment.name}>{attachment.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(attachment.fileSize) || "File đã nộp"}</p>
        </div>
        {attachment.alt ? (
            <div className="mt-2 rounded-xl bg-blue-50 p-2">
                <p className="text-xs font-semibold uppercase text-blue-700">Nhận xét file</p>
                <p className="mt-1 break-words whitespace-pre-wrap text-xs leading-5 text-blue-950">{attachment.alt}</p>
            </div>
        ) : null}
        <div className="absolute right-2 top-2 flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            {attachment.viewUrl ? (
                <a
                    href={attachment.viewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-blue-800 shadow-sm transition hover:bg-blue-50"
                    aria-label="Xem file"
                >
                    <ExternalLink size={16} />
                </a>
            ) : null}
            <button
                type="button"
                onClick={() => onRemove(attachment.key)}
                disabled={disabled}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/95 text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Xóa file đã nộp"
            >
                <Trash2 size={16} />
            </button>
        </div>
    </div>
    );
};

const GradedAttachmentItem = ({ attachment, index }) => {
    const previewUrl = isImageFile(attachment.mimeType, attachment.name) ? attachment.viewUrl : null;

    return (
        <article className="min-w-0 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm sm:p-4">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase text-blue-700">File {index + 1}</p>
                    <h4 className="mt-1 max-w-full truncate text-base font-bold text-blue-950" title={attachment.name}>{attachment.name}</h4>
                    <p className="mt-1 text-xs text-gray-500">{formatFileSize(attachment.fileSize) || "File đã nộp"}</p>
                </div>
                {attachment.viewUrl ? (
                    <a
                        href={attachment.viewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-10 max-w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-100 px-3 text-sm font-semibold text-blue-800 transition hover:bg-blue-50 sm:max-w-40"
                        title={attachment.viewUrl}
                    >
                        <ExternalLink size={16} />
                        <span className="min-w-0 truncate">Xem file</span>
                    </a>
                ) : null}
            </div>

            <div className="mt-3 overflow-hidden rounded-xl border border-blue-100 bg-blue-50/60">
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt={attachment.name}
                        className="max-h-[520px] w-full object-contain"
                    />
                ) : (
                    <div className="flex min-h-32 items-center justify-center text-blue-800">
                        <FileText size={32} />
                    </div>
                )}
            </div>

            <div className="mt-3 rounded-xl bg-blue-50 p-3">
                <p className="text-xs font-semibold uppercase text-blue-700">Nhận xét cho file này</p>
                <p className="mt-1 break-words whitespace-pre-wrap text-sm leading-6 text-blue-950">
                    {attachment.alt || "Chưa có nhận xét riêng cho file này."}
                </p>
            </div>
        </article>
    );
};

const NewFileCard = ({ item, disabled, onRemove }) => (
    <div className="group relative min-w-0 max-w-full overflow-hidden rounded-2xl border border-blue-100 bg-blue-50/60 p-2 transition hover:border-blue-300">
        <FileIcon previewUrl={item.previewUrl} name={item.file.name} mimeType={item.file.type} />
        <div className="mt-2 min-w-0 max-w-full overflow-hidden pr-8">
            <p className="block max-w-full truncate text-sm font-semibold text-blue-950" title={item.file.name}>{item.file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(item.file.size)}</p>
        </div>
        <button
            type="button"
            onClick={() => onRemove(item.id)}
            disabled={disabled}
            className="absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/95 text-red-600 opacity-100 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
            aria-label="Xóa file mới"
        >
            <Trash2 size={16} />
        </button>
    </div>
);

const sameNumberList = (a = [], b = []) => {
    if (a.length !== b.length) return false;
    return a.map(Number).sort((x, y) => x - y).every((value, index) => value === b.map(Number).sort((x, y) => x - y)[index]);
};

const FileHomeworkSubmission = ({ homeworkContent, statusConfig, onSubmitted }) => {
    const inputRef = useRef(null);
    const pasteAreaRef = useRef(null);
    const fileItemsRef = useRef([]);
    const [note, setNote] = useState("");
    const [initialNote, setInitialNote] = useState("");
    const [initialMediaIds, setInitialMediaIds] = useState([]);
    const [existingSubmitDetail, setExistingSubmitDetail] = useState(null);
    const [keptAttachments, setKeptAttachments] = useState([]);
    const [fileItems, setFileItems] = useState([]);
    const [uploadedMedia, setUploadedMedia] = useState([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isDragActive, setIsDragActive] = useState(false);

    const fallbackSubmit = getFallbackSubmission(homeworkContent);
    const existingSubmit = existingSubmitDetail || fallbackSubmit;
    const keptMediaIds = useMemo(
        () => keptAttachments.map((attachment) => attachment.mediaId).filter((mediaId) => mediaId != null),
        [keptAttachments]
    );
    const hasExistingSubmit = Boolean(existingSubmit);
    const localSubmitted = uploadedMedia.length > 0;
    const isSubmitted = hasExistingSubmit || localSubmitted;
    const isGraded = isSubmissionGraded(existingSubmit);
    const canAttempt = homeworkContent?.progress?.canAttempt ?? !statusConfig?.disabled;
    const noteChanged = note.trim() !== initialNote.trim();
    const attachmentsChanged = !sameNumberList(keptMediaIds, initialMediaIds);
    const hasNewFiles = fileItems.length > 0;
    const hasChanges = !hasExistingSubmit || noteChanged || attachmentsChanged || hasNewFiles;
    const canSubmit = canAttempt && !isGraded && !submitting && !loadingSubmissions && hasChanges;
    const submitLabel = hasExistingSubmit ? "Nộp lại bài" : "Nộp bài";

    useEffect(() => {
        fileItemsRef.current = fileItems;
    }, [fileItems]);

    useEffect(() => {
        return () => {
            fileItemsRef.current.forEach((item) => {
                if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
            });
        };
    }, []);

    useEffect(() => {
        let cancelled = false;
        const fallbackAttachments = getAttachmentsFromSubmit(fallbackSubmit);

        const applySubmit = (submit) => {
            const nextSubmit = submit || fallbackSubmit || null;
            const nextAttachments = getAttachmentsFromSubmit(nextSubmit);
            const nextContent = nextSubmit?.content || "";
            const nextMediaIds = nextAttachments.map((item) => item.mediaId).filter((mediaId) => mediaId != null);

            setExistingSubmitDetail(nextSubmit);
            setKeptAttachments(nextAttachments);
            setNote(nextContent);
            setInitialNote(nextContent);
            setInitialMediaIds(nextMediaIds);
        };

        if (!homeworkContent?.homeworkContentId) {
            applySubmit(fallbackSubmit);
            return undefined;
        }

        setLoadingSubmissions(true);
        learningItemService
            .getMyFileHomeworkSubmissions({
                page: 1,
                limit: 20,
                homeworkContentId: homeworkContent.homeworkContentId,
            })
            .then((response) => {
                if (cancelled) return;
                const submits = resolveSubmissionList(response);
                const latestSubmit = submits[0] || fallbackSubmit || null;
                applySubmit(latestSubmit);
            })
            .catch(() => {
                if (cancelled) return;
                setKeptAttachments(fallbackAttachments);
                applySubmit(fallbackSubmit);
            })
            .finally(() => {
                if (!cancelled) setLoadingSubmissions(false);
            });

        return () => {
            cancelled = true;
        };
    }, [fallbackSubmit, homeworkContent?.homeworkContentId]);

    const addFiles = useCallback((incomingFiles) => {
        const files = Array.from(incomingFiles || []).filter(Boolean);
        if (!files.length) return;

        setError("");
        setSuccessMessage("");

        setFileItems((current) => {
            const nextItems = [...current];
            const rejected = [];

            files.forEach((file) => {
                if (file.size > MAX_FILE_SIZE) {
                    rejected.push(`${file.name} vượt quá 5 MB`);
                    return;
                }

                if (nextItems.some((item) => isSameFile(item.file, file))) {
                    return;
                }

                if (nextItems.length + keptAttachments.length >= MAX_FILES) {
                    rejected.push(`Chỉ được giữ tối đa ${MAX_FILES} file`);
                    return;
                }

                nextItems.push(createFileItem(file));
            });

            if (rejected.length) setError(rejected[0]);
            return nextItems;
        });
    }, [keptAttachments.length]);

    const handleInputChange = (event) => {
        addFiles(event.target.files);
        event.target.value = "";
    };

    const removeFile = (itemId) => {
        setSuccessMessage("");
        setFileItems((current) => {
            const removed = current.find((item) => item.id === itemId);
            if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
            return current.filter((item) => item.id !== itemId);
        });
    };

    const removeExistingAttachment = (attachmentKey) => {
        setSuccessMessage("");
        setKeptAttachments((current) => current.filter((attachment) => attachment.key !== attachmentKey));
    };

    const clearNewFiles = () => {
        fileItems.forEach((item) => {
            if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        });
        setFileItems([]);
        setUploadedMedia([]);
        setSuccessMessage("");
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragActive(false);
        addFiles(event.dataTransfer.files);
    };

    const handlePaste = (event) => {
        const files = Array.from(event.clipboardData?.files || []);
        const imageFiles = files.filter((file) => file.type?.startsWith("image/"));
        if (!imageFiles.length) return;
        event.preventDefault();
        addFiles(imageFiles);
    };

    const handleSubmit = async () => {
        if (!homeworkContent?.homeworkContentId || !canSubmit) return;

        const trimmedNote = note.trim();
        if (!trimmedNote) {
            setError("Vui lòng nhập ghi chú ngắn cho bài nộp.");
            pasteAreaRef.current?.focus();
            return;
        }

        if (!keptAttachments.length && !fileItems.length) {
            setError("Vui lòng giữ hoặc chọn ít nhất một file bài làm.");
            inputRef.current?.click();
            return;
        }

        setSubmitting(true);
        setError("");
        setSuccessMessage("");

        try {
            let uploadedList = [];
            if (fileItems.length) {
                const uploadResponse = await learningItemService.uploadHomeworkSubmissionFiles(
                    fileItems.map((item) => item.file)
                );
                uploadedList = uploadResponse?.data?.data || uploadResponse?.data || [];
            }

            const uploadedMediaIds = uploadedList
                .map((media) => media?.mediaId)
                .filter((mediaId) => mediaId != null);
            const mediaIds = [...keptMediaIds, ...uploadedMediaIds]
                .map(Number)
                .filter((mediaId, index, array) => Number.isFinite(mediaId) && array.indexOf(mediaId) === index);

            if (!mediaIds.length) {
                throw new Error("Bài nộp cần ít nhất một file đính kèm.");
            }

            const payload = {
                homeworkContentId: homeworkContent.homeworkContentId,
                content: trimmedNote,
                mediaIds,
            };

            const submitResponse = hasExistingSubmit
                ? await learningItemService.resubmitFileHomework(payload)
                : await learningItemService.submitFileHomework(payload);

            const submitData = submitResponse?.data?.data || submitResponse?.data;
            const nextAttachments = getAttachmentsFromSubmit(submitData);
            const fallbackUploadedAttachments = uploadedList.map(normalizeAttachment).filter(Boolean);
            const resolvedAttachments = nextAttachments.length
                ? nextAttachments
                : [
                    ...keptAttachments,
                    ...fallbackUploadedAttachments,
                ];

            fileItems.forEach((item) => {
                if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
            });

            setExistingSubmitDetail({
                ...existingSubmit,
                ...submitData,
                content: trimmedNote,
                mediaIds,
            });
            setKeptAttachments(resolvedAttachments);
            setInitialNote(trimmedNote);
            setInitialMediaIds(mediaIds);
            setFileItems([]);
            setUploadedMedia(uploadedList);
            setSuccessMessage(hasExistingSubmit ? "Đã nộp lại bài thành công." : "Đã nộp bài thành công.");
            onSubmitted?.(homeworkContent.homeworkContentId, submitData);
        } catch (submitError) {
            setError(getErrorMessage(submitError));
        } finally {
            setSubmitting(false);
        }
    };

    const existingSubmitLabel = useMemo(() => {
        if (!existingSubmit?.submitAt) return null;
        return new Date(existingSubmit.submitAt).toLocaleString("vi-VN");
    }, [existingSubmit?.submitAt]);

    return (
        <div className="flex flex-col gap-4">
            <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Bài tập nộp file</p>
                        <h3 className="mt-1 text-lg font-bold text-blue-950">Tải bài làm của em lên</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-600">
                            Chọn file từ điện thoại, kéo thả trên máy tính hoặc paste ảnh chụp màn hình vào khung nộp bài.
                        </p>
                    </div>
                    <span className={`inline-flex w-fit items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        isSubmitted ? "bg-green-100 text-green-700" : "bg-white text-blue-700"
                    }`}>
                        {loadingSubmissions ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                        {loadingSubmissions ? "Đang kiểm tra" : isSubmitted ? "Đã nộp" : "Chưa nộp"}
                    </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-white p-3">
                        <p className="text-xs font-semibold uppercase text-gray-500">Thời hạn</p>
                        <p className="mt-1 font-semibold text-blue-950">
                            {homeworkContent?.dueDate
                                ? new Date(homeworkContent.dueDate).toLocaleString("vi-VN")
                                : "Không giới hạn"}
                        </p>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                        <p className="text-xs font-semibold uppercase text-gray-500">Lần nộp gần nhất</p>
                        <p className="mt-1 font-semibold text-blue-950">
                            {existingSubmitLabel || (localSubmitted ? "Vừa nộp xong" : "Chưa nộp")}
                        </p>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                        <p className="text-xs font-semibold uppercase text-gray-500">File hiện tại</p>
                        <p className="mt-1 font-semibold text-blue-950">
                            {keptAttachments.length + fileItems.length}/{MAX_FILES} file
                        </p>
                    </div>
                </div>

                {isGraded ? (
                    <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-800">
                        Bài đã được chấm nên không thể nộp lại. Điểm: <span className="font-bold">{existingSubmit?.points ?? "--"}</span>
                    </div>
                ) : null}

                {!canAttempt && !isSubmitted ? (
                    <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">
                        Hiện chưa thể nộp bài này. Vui lòng kiểm tra thời hạn hoặc hướng dẫn của giáo viên.
                    </div>
                ) : null}
            </section>

            <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5">
                {isGraded ? (
                    <div className="flex flex-col gap-5">
                        <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase text-green-700">Kết quả chấm bài</p>
                                    <h3 className="mt-1 text-lg font-bold text-blue-950">Nhận xét của giáo viên</h3>
                                </div>
                                <div className="rounded-xl bg-white px-4 py-3 text-center shadow-sm">
                                    <p className="text-xs font-semibold uppercase text-gray-500">Điểm</p>
                                    <p className="mt-1 text-2xl font-bold text-blue-950">{existingSubmit?.points ?? "--"}</p>
                                </div>
                            </div>
                            <div className="mt-4 rounded-xl bg-white p-3">
                                <p className="text-xs font-semibold uppercase text-green-700">Nhận xét chung</p>
                                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-blue-950">
                                    {existingSubmit?.feedback || "Giáo viên chưa để lại nhận xét chung."}
                                </p>
                            </div>
                        </div>

                        {note ? (
                            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                                <p className="text-xs font-semibold uppercase text-blue-700">Ghi chú em đã gửi</p>
                                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-blue-950">{note}</p>
                            </div>
                        ) : null}

                        <div>
                            <div className="mb-3">
                                <p className="text-sm font-bold text-blue-950">File học sinh đã nộp</p>
                                <p className="text-xs text-gray-500">Mỗi file hiển thị kèm nhận xét riêng từ alt của media.</p>
                            </div>
                            {keptAttachments.length ? (
                                <div className="flex flex-col gap-4">
                                    {keptAttachments.map((attachment, index) => (
                                        <GradedAttachmentItem
                                            key={attachment.key}
                                            attachment={attachment}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-gray-600">
                                    Chưa có file đã nộp để hiển thị.
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                <label className="block">
                    <span className="text-sm font-semibold text-blue-950">Ghi chú bài làm</span>
                    <textarea
                        ref={pasteAreaRef}
                        value={note}
                        onChange={(event) => {
                            setNote(event.target.value);
                            setSuccessMessage("");
                        }}
                        onPaste={handlePaste}
                        rows={4}
                        placeholder="Ví dụ: Em gửi bài làm trang 12, gồm 3 ảnh chụp vở."
                        className="mt-2 w-full resize-none rounded-2xl border border-blue-100 bg-blue-50/40 px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-800 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                </label>

                {keptAttachments.length ? (
                    <div className="mt-5">
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <p className="text-sm font-bold text-blue-950">File đã nộp</p>
                                <p className="text-xs text-gray-500">Hover vào file hoặc ảnh để xóa khỏi lần nộp lại.</p>
                            </div>
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {keptAttachments.map((attachment) => (
                                <ExistingAttachmentCard
                                    key={attachment.key}
                                    attachment={attachment}
                                    disabled={submitting || isGraded}
                                    onRemove={removeExistingAttachment}
                                />
                            ))}
                        </div>
                    </div>
                ) : null}

                <div
                    onDragEnter={(event) => {
                        event.preventDefault();
                        setIsDragActive(true);
                    }}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragActive(true);
                    }}
                    onDragLeave={() => setIsDragActive(false)}
                    onDrop={handleDrop}
                    onPaste={handlePaste}
                    tabIndex={0}
                    className={`mt-5 rounded-2xl border-2 border-dashed p-4 outline-none transition sm:p-6 ${
                        isDragActive
                            ? "border-blue-800 bg-blue-50"
                            : "border-blue-100 bg-white hover:bg-blue-50/50"
                    }`}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        accept={ACCEPTED_FILES}
                        onChange={handleInputChange}
                        className="hidden"
                    />
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-800 text-white shadow-sm">
                            <UploadCloud size={26} />
                        </div>
                        <p className="mt-3 text-base font-bold text-blue-950">Thêm file mới</p>
                        <p className="mt-1 max-w-md text-sm text-gray-600">
                            Trên điện thoại bấm nút bên dưới để mở bộ nhớ. Trên máy tính có thể kéo thả hoặc nhấn Ctrl+V để paste ảnh.
                        </p>
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            disabled={!canAttempt || isGraded || submitting}
                            className="mt-4 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 sm:w-auto"
                        >
                            <Paperclip size={18} />
                            Chọn file từ thiết bị
                        </button>
                        <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1">
                                <Image size={13} /> Ảnh, nhiều ảnh
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1">
                                <FileText size={13} /> PDF, Word, Excel
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1">
                                <Clipboard size={13} /> Paste ảnh
                            </span>
                        </div>
                    </div>
                </div>

                {fileItems.length ? (
                    <div className="mt-5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-blue-950">File mới thêm ({fileItems.length})</p>
                            <button
                                type="button"
                                onClick={clearNewFiles}
                                disabled={submitting}
                                className="cursor-pointer text-xs font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Xóa file mới
                            </button>
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {fileItems.map((item) => (
                                <NewFileCard key={item.id} item={item} disabled={submitting} onRemove={removeFile} />
                            ))}
                        </div>
                    </div>
                ) : null}

                {existingSubmit?.feedback ? (
                    <div className="mt-5 rounded-xl bg-blue-50 p-3 text-sm text-gray-700">
                        <p className="text-xs font-semibold uppercase text-blue-700">Nhận xét</p>
                        <p className="mt-1">{existingSubmit.feedback}</p>
                    </div>
                ) : null}

                {error ? (
                    <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                ) : null}

                {successMessage ? (
                    <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-3 text-sm font-semibold text-green-700">
                        {successMessage}
                    </div>
                ) : null}

                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-blue-950">
                            {hasExistingSubmit
                                ? hasChanges
                                    ? "Có thay đổi mới, em có thể nộp lại bài."
                                    : "Chưa có thay đổi mới để nộp lại."
                                : "Thêm ghi chú và ít nhất một file để nộp bài."}
                        </p>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-yellow-500 px-4 py-3 text-sm font-bold text-blue-950 transition hover:bg-yellow-100 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 sm:w-auto sm:min-w-42"
                        >
                            {submitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send size={18} />}
                            {submitting ? "Đang nộp..." : submitLabel}
                        </button>
                    </div>
                </div>
                    </>
                )}
            </section>
        </div>
    );
};

export default memo(FileHomeworkSubmission);

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SvgIcon } from "..";
import { DebouncedSearchInput } from "..";
import UserClass from "../../../assets/icons/UserClass.svg";
import { questionService } from "../../../core/services/modules/questionService";
import { ROUTES } from "../../../core/constants";

const resolveCollectionFromPayload = (payload) => {
    const resolved = payload?.data ?? payload;

    if (Array.isArray(resolved)) return resolved;
    if (Array.isArray(resolved?.data)) return resolved.data;
    if (Array.isArray(resolved?.items)) return resolved.items;
    if (Array.isArray(resolved?.content)) return resolved.content;

    return [];
};

const resolveQuestionId = (question) => {
    return question?.questionId ?? question?.id ?? null;
};

const resolveQuestionContent = (question, index = 0) => {
    return (
        question?.content ||
        question?.questionContent ||
        question?.title ||
        question?.name ||
        `Câu hỏi ${index + 1}`
    );
};

const normalizeQuestionList = (payload) => {
    const questions = resolveCollectionFromPayload(payload);

    return questions
        .map((question, index) => {
            const questionId = resolveQuestionId(question);
            if (questionId == null) return null;

            return {
                ...question,
                questionId: String(questionId),
                content: resolveQuestionContent(question, index),
            };
        })
        .filter(Boolean);
};

/**
 * Search Header Component
 * Search bar và nút thêm khóa học
 */
const SearchHeader = memo(({ onAddCourse }) => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState("");
    const [searchedQuestions, setSearchedQuestions] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const requestRef = useRef(0);
    const containerRef = useRef(null);

    const shouldShowDropdown = useMemo(() => {
        return isDropdownOpen && keyword.trim().length > 0;
    }, [isDropdownOpen, keyword]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!containerRef.current?.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearchChange = useCallback(async (nextKeyword) => {
        const trimmedKeyword = String(nextKeyword || "").trim();

        setKeyword(trimmedKeyword);
        setSearchError("");

        if (!trimmedKeyword) {
            setSearchedQuestions([]);
            setSearchLoading(false);
            setIsDropdownOpen(false);
            return;
        }

        const currentRequestId = requestRef.current + 1;
        requestRef.current = currentRequestId;
        setIsDropdownOpen(true);
        setSearchLoading(true);

        try {
            const response = await questionService.searchPublicStudentQuestions({
                search: trimmedKeyword,
                page: 1,
                limit: 8,
            });

            if (requestRef.current !== currentRequestId) {
                return;
            }

            setSearchedQuestions(normalizeQuestionList(response));
        } catch (error) {
            if (requestRef.current !== currentRequestId) {
                return;
            }

            setSearchedQuestions([]);
            setSearchError(error?.message || "Không thể tìm kiếm câu hỏi");
        } finally {
            if (requestRef.current === currentRequestId) {
                setSearchLoading(false);
            }
        }
    }, []);

    const handleSelectQuestion = useCallback((questionId) => {
        if (!questionId) return;

        setIsDropdownOpen(false);
        navigate(ROUTES.PRACTICE_QUESTION_DETAIL(questionId));
    }, [navigate]);

    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
            <div ref={containerRef} className="relative">
                <DebouncedSearchInput
                    placeholder="Tìm kiếm câu hỏi..."
                    debounceMs={400}
                    onDebouncedChange={handleSearchChange}
                    containerClassName="w-full sm:w-58 md:w-56"
                />

                {shouldShowDropdown ? (
                    <div className="absolute right-0 top-full z-50 mt-2 w-full min-w-78 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                        {searchLoading ? (
                            <div className="px-2 py-3 text-xs text-gray-500">Đang tìm câu hỏi...</div>
                        ) : null}

                        {!searchLoading && searchError ? (
                            <div className="px-2 py-3 text-xs text-red-500">{searchError}</div>
                        ) : null}

                        {!searchLoading && !searchError && searchedQuestions.length === 0 ? (
                            <div className="px-2 py-3 text-xs text-gray-500">Không tìm thấy câu hỏi phù hợp.</div>
                        ) : null}

                        {!searchLoading && !searchError && searchedQuestions.length > 0 ? (
                            <div className="max-h-72 overflow-y-auto">
                                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                    Kết quả tìm kiếm
                                </div>

                                {searchedQuestions.map((question) => {
                                    return (
                                        <button
                                            key={question.questionId}
                                            type="button"
                                            onClick={() => handleSelectQuestion(question.questionId)}
                                            className="w-full cursor-pointer rounded-lg px-2 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                        >
                                            <span className="line-clamp-2">{question.content}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>

            {/* Add Course Button */}
            <button
                onClick={onAddCourse}
                className="bg-yellow-100 cursor-pointer active:scale-[0.98] hover:bg-yellow-500 
                    rounded-full 
                    px-4 py-1.5
                    flex flex-row gap-1.5 sm:gap-2 
                    items-center justify-center 
                    transition
                    "
            >
                <SvgIcon src={UserClass} className="w-5 h-5" />
                <div className="text-sm text-semibold text-blue-800 whitespace-nowrap">
                    Thêm khóa học
                </div>
            </button>
        </div>
    );
});

SearchHeader.displayName = "SearchHeader";

export default SearchHeader;

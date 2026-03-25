import { memo, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const GRADE_OPTIONS = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

/**
 * SecondaryGradeSelect
 * Dropdown chọn khối cho danh sách cuộc thi phụ.
 */
const SecondaryGradeSelect = ({ onChange, disabled = false }) => {
    const [selectedGrade, setSelectedGrade] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const handleSelectGrade = (value) => {
        if (disabled) return;
        setSelectedGrade(value);
        onChange?.(value);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!wrapperRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const label = selectedGrade ? `Khối ${selectedGrade}` : 'Tất cả';

    return (
        <div className="flex items-center gap-2" ref={wrapperRef}>
            <label htmlFor="secondary-grade-select" className="text-text-5 font-medium text-gray-600 ">
                Khối
            </label>

            <div className="relative">
                <button
                    id="secondary-grade-select"
                    type="button"
                    disabled={disabled}
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={`min-w-26 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-text-5 text-gray-700 flex items-center justify-between gap-2 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                    }`}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span>{label}</span>
                    <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && !disabled && (
                    <div
                        role="listbox"
                        className="absolute right-0 mt-2 w-34 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg z-30 p-1"
                    >
                        <button
                            type="button"
                            onClick={() => handleSelectGrade('')}
                            className={`cursor-pointer w-full text-left px-3 py-1.5 rounded-md text-text-5 transition-colors ${
                                selectedGrade === ''
                                    ? 'bg-blue-50 text-blue-800 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Tất cả
                        </button>

                        {GRADE_OPTIONS.map((grade) => {
                            const value = String(grade);
                            const isActive = selectedGrade === value;

                            return (
                                <button
                                    key={grade}
                                    type="button"
                                    onClick={() => handleSelectGrade(value)}
                                    className={`cursor-pointer w-full text-left px-3 py-1.5 rounded-md text-text-5 transition-colors ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-800 font-semibold'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Khối {grade}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(SecondaryGradeSelect);

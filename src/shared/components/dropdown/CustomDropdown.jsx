import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * CustomDropdown
 * Reusable custom dropdown styled for filter/select use cases.
 */
const CustomDropdown = ({
    id,
    label,
    value,
    options = [],
    onChange,
    disabled = false,
    placeholder = 'Chọn',
    containerClassName = '',
    labelClassName = '',
    buttonClassName = '',
    menuClassName = '',
    optionClassName = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!wrapperRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = useMemo(() => {
        const selectedOption = options.find((option) => String(option.value) === String(value));
        return selectedOption?.label || placeholder;
    }, [options, placeholder, value]);

    const handleSelect = (optionValue) => {
        if (disabled) return;
        onChange?.(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`flex md:w-fit w-full items-center gap-2 ${containerClassName}`.trim()} ref={wrapperRef}>
            {label ? (
                <label
                    htmlFor={id}
                    className={`text-text-5 font-medium text-gray-600 ${labelClassName}`.trim()}
                >
                    {label}
                </label>
            ) : null}

            <div className="relative md:w-fit w-full">
                <button
                    id={id}
                    type="button"
                    disabled={disabled}
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={`md:w-fit w-full min-w-26 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-text-5 text-gray-700 flex items-center justify-between gap-2 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                        } ${buttonClassName}`.trim()}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span>{selectedLabel}</span>
                    <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && !disabled ? (
                    <div
                        role="listbox"
                        className={`absolute right-0 mt-2 w-34 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg z-30 p-1 ${menuClassName}`.trim()}
                    >
                        {options.map((option) => {
                            const isActive = String(option.value) === String(value);

                            return (
                                <button
                                    key={String(option.value)}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={`cursor-pointer w-full text-left px-3 py-1.5 rounded-md text-text-5 transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-800 font-semibold'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        } ${optionClassName}`.trim()}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default memo(CustomDropdown);
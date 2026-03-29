import { memo, useEffect, useState } from 'react';
import { Search } from 'lucide-react';

const DebouncedSearchInput = memo(({
    value = '',
    onDebouncedChange,
    placeholder = 'Tìm kiếm...',
    debounceMs = 400,
    disabled = false,
    containerClassName = '',
    inputClassName = '',
    iconClassName = '',
}) => {
    const [localValue, setLocalValue] = useState(value || '');

    useEffect(() => {
        setLocalValue(value || '');
    }, [value]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            onDebouncedChange?.(localValue.trim());
        }, debounceMs);

        return () => window.clearTimeout(timer);
    }, [localValue, debounceMs, onDebouncedChange]);

    return (
        <div className={`w-50 flex justify-center items-center ${containerClassName}`.trim()}>
            <div className="relative w-full">
                <Search
                    className={`absolute left-2 sm:left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 ${iconClassName}`.trim()}
                />

                <input
                    type="text"
                    value={localValue}
                    onChange={(event) => setLocalValue(event.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full px-9 py-1.5 rounded-full bg-[#F5F5F5] text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition disabled:cursor-not-allowed disabled:opacity-60 ${inputClassName}`.trim()}
                />
            </div>
        </div>
    );
});

DebouncedSearchInput.displayName = 'DebouncedSearchInput';

export default DebouncedSearchInput;
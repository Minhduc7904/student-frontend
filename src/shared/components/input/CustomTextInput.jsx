import { memo } from 'react';

const CustomTextInput = ({
    value,
    onChange,
    onBlur,
    onKeyDown,
    placeholder = '',
    disabled = false,
    inputMode = 'text',
    className = '',
}) => {
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            inputMode={inputMode}
            className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        />
    );
};

export default memo(CustomTextInput);

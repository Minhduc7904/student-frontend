import { memo } from 'react';

const CustomRadio = ({
    checked = false,
    onChange,
    disabled = false,
    ariaLabel = 'Radio',
    className = '',
}) => {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={ariaLabel}
            disabled={disabled}
            onClick={onChange}
            className={`inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${checked
                ? 'border-blue-600 bg-blue-600'
                : 'border-slate-300 bg-white hover:border-blue-400'
                } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
        >
            <span
                className={`h-2 w-2 rounded-full transition-colors ${checked ? 'bg-white' : 'bg-transparent'}`}
            />
        </button>
    );
};

export default memo(CustomRadio);

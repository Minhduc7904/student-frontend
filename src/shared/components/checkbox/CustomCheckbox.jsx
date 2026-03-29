import { memo } from 'react';
import { Check } from 'lucide-react';

const CustomCheckbox = ({
    checked = false,
    onChange,
    disabled = false,
    ariaLabel = 'Checkbox',
    className = '',
}) => {
    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={checked}
            aria-label={ariaLabel}
            disabled={disabled}
            onClick={onChange}
            className={`inline-flex h-5 w-5 items-center justify-center rounded border transition-colors ${checked
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-emerald-300 bg-white text-transparent hover:border-emerald-400'
                } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
        >
            <Check size={13} strokeWidth={3} />
        </button>
    );
};

export default memo(CustomCheckbox);

import { memo, useState } from 'react';

const STATUS_TABS = [
    { key: 'ENDED', label: 'Đã diễn ra' },
    { key: 'ATTEMPTED', label: 'Đã làm' },
];

/**
 * SecondaryStatusTabs
 * Bộ lọc trạng thái cuộc thi cho danh sách phụ.
 */
const SecondaryStatusTabs = ({ onChange, disabled = false }) => {
    const [activeStatus, setActiveStatus] = useState('ENDED');

    const handleSelectStatus = (status) => {
        if (disabled) return;
        setActiveStatus(status);
        onChange?.(status);
    };

    return (
        <div className="inline-flex items-center rounded-3xl bg-[#F1F5F9] p-1">
            {STATUS_TABS.map((tab) => {
                const isActive = tab.key === activeStatus;
                return (
                    <button
                        key={tab.key}
                        type="button"
                        disabled={disabled}
                        onClick={() => handleSelectStatus(tab.key)}
                        className={`px-3 md:px-4 py-1.5 rounded-3xl text-text-5 font-semibold transition-colors ${
                            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                        } ${
                            isActive
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default memo(SecondaryStatusTabs);

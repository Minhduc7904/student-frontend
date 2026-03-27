import { memo, useMemo, useState } from 'react';
import { CustomDropdown } from '../../../shared/components';

const GRADE_OPTIONS = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

/**
 * SecondaryGradeSelect
 * Dropdown chọn khối cho danh sách cuộc thi phụ.
 */
const SecondaryGradeSelect = ({ onChange, disabled = false }) => {
    const [selectedGrade, setSelectedGrade] = useState('');

    const gradeOptions = useMemo(
        () => [
            { label: 'Tất cả', value: '' },
            ...GRADE_OPTIONS.map((grade) => ({
                label: `Khối ${grade}`,
                value: String(grade),
            })),
        ],
        []
    );

    const handleSelectGrade = (value) => {
        if (disabled) return;
        setSelectedGrade(value);
        onChange?.(value);
    };

    return (
        <CustomDropdown
            id="secondary-grade-select"
            label="Khối"
            value={selectedGrade}
            options={gradeOptions}
            onChange={handleSelectGrade}
            disabled={disabled}
        />
    );
};

export default memo(SecondaryGradeSelect);

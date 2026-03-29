export const examTypeOptions = [
    { id: 'ck1', label: 'Cuối kỳ 1', gradientFrom: '#0D41A9', gradientTo: '#428FED', darkText: false, apiTypeCodes: ['CK1'] },
    { id: 'ck2', label: 'Cuối kỳ 2', gradientFrom: '#0D41A9', gradientTo: '#428FED', darkText: false, apiTypeCodes: ['CK2'] },
    { id: 'gk1', label: 'Giữa kỳ 1', gradientFrom: '#FFC631', gradientTo: '#FDE06A', darkText: true, apiTypeCodes: ['GK1'] },
    { id: 'gk2', label: 'Giữa kỳ 2', gradientFrom: '#FFC631', gradientTo: '#FDE06A', darkText: true, apiTypeCodes: ['GK2'] },
    { id: 'tsa', label: 'Đánh giá tư duy', gradientFrom: '#D075FF', gradientTo: '#DE8EFF', darkText: false, apiTypeCodes: ['TSA'] },
    { id: 'thpt', label: 'THPT Quốc Gia', gradientFrom: '#FF5959', gradientTo: '#ED7171', darkText: false, apiTypeCodes: ['THPT'] },
    { id: 'otthpt', label: 'Ôn tập THPT', gradientFrom: '#FF5959', gradientTo: '#ED7171', darkText: false, apiTypeCodes: ['OTTHPT'] },
    { id: 'ot', label: 'Ôn tập', gradientFrom: '#00A870', gradientTo: '#36CFC9', darkText: false, apiTypeCodes: ['OT'] },
    { id: 'hsa', label: 'Đánh giá năng lực', gradientFrom: '#D075FF', gradientTo: '#DE8EFF', darkText: false, apiTypeCodes: ['HSA'] },
    { id: 'oths', label: 'Ôn tập chung', gradientFrom: '#00A870', gradientTo: '#36CFC9', darkText: false, apiTypeCodes: ['OTHS'] },
];

export const mapApiTypeCodeToExamTypeId = (typeCode) => {
    if (!typeCode) return null;

    const normalizedCode = String(typeCode).trim().toUpperCase();
    const found = examTypeOptions.find((item) =>
        Array.isArray(item.apiTypeCodes) && item.apiTypeCodes.includes(normalizedCode)
    );

    return found?.id || null;
};

export const normalizeExamType = (value) => {
    if (!value) return '';
    return String(value).trim().toLowerCase().replace(/_/g, '-');
};

export const getExamTypeLabelById = (id) => {
    const normalizedId = normalizeExamType(id);
    const found = examTypeOptions.find((item) => item.id === normalizedId);
    return found?.label || null;
};

export const getApiTypeCodeByExamTypeId = (id) => {
    const normalizedId = normalizeExamType(id);
    const found = examTypeOptions.find((item) => item.id === normalizedId);

    if (!found || !Array.isArray(found.apiTypeCodes) || found.apiTypeCodes.length === 0) {
        return null;
    }

    return found.apiTypeCodes[0];
};

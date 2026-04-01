export const examTypeOptions = [
    {
        id: 'ck1',
        label: 'Cuối kỳ 1',
        subtitle: 'Tổng kết kiến thức học kỳ 1',
        gradientFrom: '#0D41A9',
        gradientTo: '#428FED',
        darkText: false,
        apiTypeCodes: ['CK1'],
    },
    {
        id: 'ck2',
        label: 'Cuối kỳ 2',
        subtitle: 'Tổng kết toàn bộ năm học',
        gradientFrom: '#0D41A9',
        gradientTo: '#428FED',
        darkText: false,
        apiTypeCodes: ['CK2'],
    },
    {
        id: 'gk1',
        label: 'Giữa kỳ 1',
        subtitle: 'Kiểm tra giữa học kỳ 1',
        gradientFrom: '#FFC631',
        gradientTo: '#FDE06A',
        darkText: true,
        apiTypeCodes: ['GK1'],
    },
    {
        id: 'gk2',
        label: 'Giữa kỳ 2',
        subtitle: 'Kiểm tra giữa học kỳ 2',
        gradientFrom: '#FFC631',
        gradientTo: '#FDE06A',
        darkText: true,
        apiTypeCodes: ['GK2'],
    },

    {
        id: 'thpt',
        label: 'THPT Quốc Gia',
        subtitle: 'Đề thi chính thức hoặc tham khảo tốt nghiệp THPT',
        gradientFrom: '#FF5959',
        gradientTo: '#ED7171',
        darkText: false,
        apiTypeCodes: ['THPT'],
    },
    {
        id: 'otthpt',
        label: 'Ôn tập THPT',
        subtitle: 'Luyện các đề khảo sát chất lượng, thi thử chuẩn bị thi THPT',
        gradientFrom: '#FF5959',
        gradientTo: '#ED7171',
        darkText: false,
        apiTypeCodes: ['OTTHPT'],
    },
    {
        id: 'ot',
        label: 'Ôn tập',
        subtitle: 'Luyện tập củng cố kiến thức',
        gradientFrom: '#00A870',
        gradientTo: '#36CFC9',
        darkText: false,
        apiTypeCodes: ['OT'],
    },
    {
        id: 'oths',
        label: 'Ôn tập chung',
        subtitle: 'Ôn luyện tổng hợp nhiều dạng đề',
        gradientFrom: '#00A870',
        gradientTo: '#36CFC9',
        darkText: false,
        apiTypeCodes: ['OTHS'],
    },
    {
        id: 'hsa',
        label: 'Đánh giá năng lực',
        subtitle: 'Thi đánh giá năng lực đại học',
        gradientFrom: '#D075FF',
        gradientTo: '#DE8EFF',
        darkText: false,
        apiTypeCodes: ['HSA'],
    },
    {
        id: 'tsa',
        label: 'Đánh giá tư duy',
        subtitle: 'Dạng đề đánh giá logic & suy luận',
        gradientFrom: '#D075FF',
        gradientTo: '#DE8EFF',
        darkText: false,
        apiTypeCodes: ['TSA'],
    },

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

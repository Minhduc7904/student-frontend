export const DIFFICULTY_META = {
    NB: {
        code: 'NB',
        label: 'Nhận biết',
        className: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    },
    TH: {
        code: 'TH',
        label: 'Thông hiểu',
        className: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    VD: {
        code: 'VD',
        label: 'Vận dụng',
        className: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    VDC: {
        code: 'VDC',
        label: 'Vận dụng cao',
        className: 'text-red-700 bg-red-50 border-red-200',
    },
};

const LEGACY_DIFFICULTY_MAP = {
    EASY: 'NB',
    MEDIUM: 'TH',
    HARD: 'VD',
};

export const resolveDifficultyMeta = (difficulty) => {
    const normalized = String(difficulty || '').trim().toUpperCase();
    if (!normalized) return null;

    const mappedCode = LEGACY_DIFFICULTY_MAP[normalized] || normalized;
    const meta = DIFFICULTY_META[mappedCode];
    if (meta) return meta;

    return {
        code: normalized,
        label: normalized,
        className: 'text-slate-700 bg-slate-50 border-slate-200',
    };
};
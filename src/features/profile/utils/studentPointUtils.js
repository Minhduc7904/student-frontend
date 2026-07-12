export const getStudentTotalPoint = (profile) => {
    const value =
        profile?.totalPoint ??
        profile?.student?.totalPoint ??
        profile?.points ??
        profile?.student?.points ??
        0;

    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
};

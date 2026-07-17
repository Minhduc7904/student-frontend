const sortByOrder = (items = []) => [...items].sort((left, right) => (left.order ?? 0) - (right.order ?? 0));

const createQuestionItems = (questions, sectionName, groupId) => {
    const sortedQuestions = sortByOrder(questions);
    return sortedQuestions.map((question, index) => ({
        question,
        number: index + 1,
        totalInSection: sortedQuestions.length,
        sectionName,
        groupId,
    }));
};

export const getCompetitionQuestionGroups = (sections = [], unassignedQuestions = []) => {
    const groups = sortByOrder(sections)
        .filter((section) => (section.questions ?? []).length > 0)
        .map((section, index) => ({
            id: `section-${section.sectionId ?? index}`,
            title: section.title ?? section.name ?? `Phần ${index + 1}`,
            items: createQuestionItems(section.questions, section.title ?? section.name ?? `Phần ${index + 1}`, `section-${section.sectionId ?? index}`),
        }));

    if (unassignedQuestions.length > 0) {
        groups.push({
            id: 'unassigned',
            title: 'Khác',
            items: createQuestionItems(unassignedQuestions, 'Khác', 'unassigned'),
        });
    }

    return groups;
};

export const flattenCompetitionQuestions = (sections = [], unassignedQuestions = []) => (
    getCompetitionQuestionGroups(sections, unassignedQuestions).flatMap((group) => group.items)
);

export const formatCompetitionTime = (totalSeconds = 0) => {
    const seconds = Math.max(0, totalSeconds);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainder = seconds % 60;

    return hours > 0
        ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
        : `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
};

export const getQuestionSyncState = (question) => question.answerSyncStatus ?? (question.answer?.isAnswered ? 'saved' : 'idle');

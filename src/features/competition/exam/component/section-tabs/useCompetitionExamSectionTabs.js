import { useEffect, useMemo, useState } from 'react';

const getSectionIdentity = (section, fallbackIndex) => {
    if (section?.sectionId == null) return `section-${fallbackIndex + 1}`;
    return String(section.sectionId);
};

const useCompetitionExamSectionTabs = ({ sectionsWithQuestions = [], loading = false }) => {
    const sectionTabs = useMemo(() => {
        return (sectionsWithQuestions || []).map((section, index) => ({
            ...section,
            identity: getSectionIdentity(section, index),
        }));
    }, [sectionsWithQuestions]);

    const [activeSectionId, setActiveSectionId] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        if (!sectionTabs.length) {
            setActiveSectionId('');
            return;
        }

        const isCurrentTabValid = sectionTabs.some((section) => section.identity === activeSectionId);
        if (!isCurrentTabValid) {
            setActiveSectionId(sectionTabs[0].identity);
        }
    }, [sectionTabs, activeSectionId]);

    const activeSection = useMemo(() => {
        if (!sectionTabs.length) return null;
        return sectionTabs.find((section) => section.identity === activeSectionId) ?? sectionTabs[0];
    }, [sectionTabs, activeSectionId]);

    useEffect(() => {
        setIsConfirmed(false);
    }, [loading, sectionsWithQuestions]);

    return {
        sectionTabs,
        activeSection,
        isConfirmed,
        setActiveSectionId,
        confirmView: () => setIsConfirmed(true),
    };
};

export default useCompetitionExamSectionTabs;

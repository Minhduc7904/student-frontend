import { useCallback, useState, Suspense, memo, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ContentLoading } from "../../../shared/components/loading";
import { useCourseDetail } from "../hooks";
import StartList from '../../../assets/icons/StarList.svg';
import { SvgIcon } from "../../../shared/components";
/**
 * Course Detail Layout
 * - Fetch course detail và lessons
 * - Content scroll độc lập
 */
const CourseDetailLayout = () => {
    const {
        courseId,
        courseDetail,
        loading,
        error,
        lessons,
        lessonsLoading,
        lessonsError,
    } = useCourseDetail();

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            <div className="w-full bg-blue-800 h-20 flex items-center justify-end">
                <SvgIcon src={StartList} width={232} height={137} />
            </div>
            {/* Main Content Area */}
                <Suspense fallback={<ContentLoading />}>
                    <Outlet context={{ 
                        courseId,
                        courseDetail, 
                        loading, 
                        error,
                        lessons,
                        lessonsLoading,
                        lessonsError,
                    }} />
                </Suspense>
        </div>
    );
};

export default memo(CourseDetailLayout);
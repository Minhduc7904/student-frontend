

import { CourseList } from "./components";

export const EnrollmentsPage = () => {
    return (
        <div className="flex flex-col justify-between items-center w-full">
            <div className="flex flex-col justify-center items-center w-full gap-3">
                <div className="flex justify-start items-center p-2 w-full ">
                    <span className="text-h2 text-blue-800">Khóa học của tôi</span>
                </div>
                {/* Course list */}
                <CourseList />
            </div>
            <div className="flex-1">
            </div>
        </div>
    )
}

export default EnrollmentsPage;
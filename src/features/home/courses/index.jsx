

import { CourseList, HomeworkList } from "./components";
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
            <div className="flex-1 flex flex-col justify-center items-center w-full gap-[14px]">
                <div className="flex justify-start items-center p-2 w-full ">
                    <span className="text-h2 text-blue-800">Bài tập của tôi</span>
                </div>
                <HomeworkList />
            </div>
        </div>
    )
}

export default EnrollmentsPage;
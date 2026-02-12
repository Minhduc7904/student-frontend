import { HomeworkList } from "../courses/components";

export const DashboardPage = () => {
    return (
        <div className="flex flex-col justify-between items-center w-full">
            <div className="flex flex-col justify-center items-center w-full gap-3">
                <div className="flex justify-start items-center p-2 w-full ">
                    <span className="text-h2 text-blue-800">Bài tập của tôi</span>
                </div>
                <HomeworkList />
            </div>
            <div className="flex-1 flex flex-col justify-center items-center w-full gap-[14px]">

            </div>
        </div>
    )
}

export default DashboardPage;
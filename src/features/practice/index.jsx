/**
 * PracticePage
 * Trang base cho module Practice.
 */
const PracticePage = () => {
    return (
        <div className="flex flex-col justify-between items-center w-full">
            <div className="flex flex-col justify-center items-center w-full gap-3">
                <div className="flex justify-start items-center p-2 w-full ">
                    <span className="text-h2 text-blue-800">Cuộc thi đang diễn ra</span>
                </div>
            </div>
        </div>
    );
};

export default PracticePage;

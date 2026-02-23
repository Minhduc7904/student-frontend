import { Search } from "lucide-react";

const RANKING_STATS = [
    { title: 'Điểm cao nhất', value: '10', bgColor: '#9BA8F4F7', icon: 'award' },
    { title: 'Thời gian', value: '10', bgColor: '#FFB47F', icon: 'clock' },
    { title: 'Xếp hạng', value: '10', bgColor: '#F8DC89', icon: 'trophy' },
    { title: 'Số lần làm', value: '10', bgColor: '#BCFFBE', icon: 'redo' }
];

const StatCard = ({ title, value, bgColor, icon }) => (
    <div className="flex flex-col justify-center items-center w-[180px]">
        <div className="justify-start items-center w-full px-3 py-2 rounded-tl-lg rounded-tr-lg gap-1 flex flex-row" style={{ backgroundColor: bgColor }}>
            {icon === 'award' && (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.58333 18.3337C6.24422 18.3337 4.57466 18.3337 3.53733 17.1132C2.5 15.8929 2.5 13.9287 2.5 10.0003C2.5 6.07196 2.5 4.10777 3.53733 2.88738C4.57466 1.66699 6.24422 1.66699 9.58333 1.66699C12.9224 1.66699 14.592 1.66699 15.6293 2.88738C16.4643 3.86976 16.6273 5.33411 16.659 7.91699" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.66699 6.66699H12.5003M6.66699 10.8337H9.16699" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16.3413 15.0878C17.0437 14.5765 17.5003 13.7478 17.5003 12.8125C17.5003 11.2592 16.2412 10 14.6878 10H14.4795C12.9262 10 11.667 11.2592 11.667 12.8125C11.667 13.7478 12.1236 14.5765 12.826 15.0878M16.3413 15.0878C15.8772 15.4257 15.3058 15.625 14.6878 15.625H14.4795C13.8615 15.625 13.2901 15.4257 12.826 15.0878M16.3413 15.0878L16.827 16.617C17.0122 17.2002 17.1049 17.4919 17.0796 17.6735C17.0268 18.0514 16.7186 18.332 16.3547 18.3333C16.1798 18.334 15.9178 18.1965 15.3939 17.9216C15.1692 17.8037 15.0569 17.7447 14.942 17.71C14.7078 17.6394 14.4595 17.6394 14.2253 17.71C14.1104 17.7447 13.9981 17.8037 13.7734 17.9216C13.2495 18.1965 12.9875 18.334 12.8127 18.3333C12.4487 18.332 12.1405 18.0514 12.0877 17.6735C12.0624 17.4919 12.1551 17.2002 12.3403 16.617L12.826 15.0878" stroke="black" />
                </svg>
            )}
            {icon === 'clock' && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6663 7.99967C14.6663 11.6797 11.6797 14.6663 7.99967 14.6663C4.31967 14.6663 1.33301 11.6797 1.33301 7.99967C1.33301 4.31967 4.31967 1.33301 7.99967 1.33301C11.6797 1.33301 14.6663 4.31967 14.6663 7.99967Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.4729 10.1202L8.40626 8.88684C8.04626 8.6735 7.75293 8.16017 7.75293 7.74017V5.00684" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
            {icon === 'trophy' && (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0003 14.167C8.60566 14.167 7.39175 15.2212 6.76504 16.7763C6.46571 17.5191 6.89523 18.3337 7.46597 18.3337H12.5347C13.1054 18.3337 13.5349 17.5191 13.2356 16.7763C12.6089 15.2212 11.395 14.167 10.0003 14.167Z" stroke="black" strokeLinecap="round" />
                    <path d="M15.4163 4.16699H16.4182C17.4189 4.16699 17.9193 4.16699 18.1803 4.48146C18.4413 4.79593 18.3328 5.26793 18.1158 6.21195L17.7901 7.62788C17.3004 9.75749 15.5088 11.341 13.333 11.667" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.58366 4.16699H3.58182C2.58109 4.16699 2.08073 4.16699 1.81969 4.48146C1.55865 4.79593 1.66719 5.26793 1.88428 6.21195L2.20989 7.62788C2.69961 9.75749 4.49126 11.341 6.66699 11.667" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.99967 14.167C12.517 14.167 14.6372 10.2819 15.2744 4.99273C15.4507 3.52998 15.5388 2.7986 15.072 2.23279C14.6053 1.66699 13.8516 1.66699 12.3442 1.66699H7.65516C6.1478 1.66699 5.39412 1.66699 4.92732 2.23279C4.46052 2.7986 4.54863 3.52998 4.72488 4.99273C5.36217 10.2819 7.48237 14.167 9.99967 14.167Z" stroke="black" strokeLinecap="round" />
                </svg>
            )}
            {icon === 'redo' && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.1244 6.38934C12.7985 5.17292 12.0608 4.10714 11.0372 3.3736C10.0135 2.64006 8.76721 2.28416 7.51057 2.36652C6.25393 2.44889 5.06472 2.96443 4.14557 3.8253C3.22643 4.68617 2.63421 5.83912 2.46984 7.08768C2.30546 8.33625 2.57909 9.60318 3.24411 10.6726C3.90912 11.742 4.92438 12.5478 6.11688 12.9526C7.30939 13.3574 8.60536 13.3362 9.78399 12.8926C10.9626 12.449 11.951 11.6105 12.5806 10.5198" stroke="black" strokeLinejoin="round" />
                    <path d="M14.0137 3.875L13.3093 6.50392L10.6803 5.7995" stroke="black" strokeLinejoin="round" />
                </svg>
            )}
            <div className="p-0.5">
                <span className="text-black text-text-4">
                    {title}
                </span>
            </div>
        </div>
        <div className="flex w-full justify-start items-center px-3 py-4 rounded-bl-xl rounded-br-xl border border-t-0 border-[#F6F6F6]">
            <span className="text-[24px] text-gray-900 font-600">
                {value}
            </span>
        </div>
    </div>
);

export const RankingTabContent = () => (
    <div className="py-4 flex w-full flex-col gap-8 justify-center items-center rounded-4xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
        {/* Stats Grid */}
        <div className="flex w-full flex-row px-8 justify-between items-center">
            {RANKING_STATS.map((stat) => (
                <StatCard key={stat.title} {...stat} />
            ))}
        </div>

        {/* Search Bar */}
        <div className="gap-4 w-full flex flex-row justify-start items-center px-8">
            <div className="flex justify-center items-center">
                <div className="relative w-full h-10 sm:h-11 lg:h-48">
                    <Search
                        size={20}
                        className="absolute left-2 sm:left-2.5 top-1/2 -translate-y-1/2 text-gray-500 lg:w-6 lg:h-6"
                    />
                    <input
                        type="text"
                        placeholder="Tìm kiếm tên..."
                        className="
                            w-full h-full
                            pl-9 sm:pl-10 lg:pl-12 
                            pr-3 sm:pr-4 
                            py-2
                            rounded-lg
                            border border-gray-700
                            text-sm sm:text-text-4 text-gray-700
                            focus:outline-none
                            focus:ring-2 focus:ring-yellow-400
                            focus:border-yellow-400
                            transition
                        "
                    />
                </div>
            </div>
            <span className="text-text-5 text-gray-900">
                25 kết quả
            </span>
        </div>
    </div>
);

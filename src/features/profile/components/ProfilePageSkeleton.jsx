import { memo } from "react";

const SkeletonBox = ({ className = "" }) => (
    <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />
);

const ProfilePageSkeleton = () => {
    return (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="flex w-full flex-col px-4 lg:w-75 lg:min-w-75 lg:flex-none lg:px-0">
                <div className="flex flex-col gap-4">
                    <div className="flex space-x-4">
                        <SkeletonBox className="h-20 w-20 rounded-lg" />
                        <div className="flex flex-1 flex-col justify-center gap-2">
                            <SkeletonBox className="h-5 w-2/3" />
                            <SkeletonBox className="h-4 w-1/2" />
                            <SkeletonBox className="h-4 w-1/3" />
                        </div>
                    </div>
                    <SkeletonBox className="h-4 w-3/4" />
                    <SkeletonBox className="h-9 w-full" />
                </div>

                <div className="mb-4 mt-2.5 h-px w-full border-b border-gray-100" />

                <div className="flex flex-col gap-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-3 pt-1">
                            <SkeletonBox className="h-4 w-4 rounded-sm" />
                            <div className="flex flex-1 flex-col gap-1">
                                <SkeletonBox className="h-3 w-1/3" />
                                <SkeletonBox className="h-3 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mb-4 mt-2.5 h-px w-full border-b border-gray-100" />
            </div>

            <div className="flex flex-1 flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                    <SkeletonBox className="h-56 w-full" />
                    <SkeletonBox className="h-56 w-full" />
                </div>
                <SkeletonBox className="h-64 w-full" />
                <SkeletonBox className="h-72 w-full" />
            </div>
        </div>
    );
};

export default memo(ProfilePageSkeleton);
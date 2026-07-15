const getThumbnailUrl = (course, fallbackImage) => (
    course?.thumbnail?.viewUrl
    || course?.thumbnail?.url
    || course?.media?.thumbnail?.viewUrl
    || course?.media?.thumbnail?.url
    || fallbackImage
);

export const CourseThumbnail = ({ course, fallbackImage }) => (
    <div className="aspect-[4/3] overflow-hidden bg-blue-50">
        <img
            src={getThumbnailUrl(course, fallbackImage)}
            alt={course?.media?.thumbnail?.alt || course?.thumbnail?.alt || course?.title || "Ảnh đại diện khóa học"}
            className="h-full w-full object-cover"
        />
    </div>
);

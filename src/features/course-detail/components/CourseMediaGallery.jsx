import { Image as ImageIcon } from "lucide-react";
import { ImageCarousel } from "../../../shared/components/ImageCarousel";

const getMediaUrl = (media) => (typeof media === "string" ? media : media?.viewUrl || media?.url || "");

const isVideo = (media) => media?.type === "VIDEO" || media?.mimeType?.startsWith("video/");

const getCourseMedia = (course) => {
    const candidates = [
        ...(course?.media?.gallery || []),
        course?.media?.introVideo,
        ...(course?.gallery || []),
        course?.introVideo,
    ].filter(Boolean);
    const seen = new Set();
    const media = candidates.filter((item) => {
        const url = getMediaUrl(item);
        const key = item?.mediaId || url;

        if (!url || seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    return media;
};

export const CourseMediaGallery = ({ course }) => {
    const media = getCourseMedia(course);
    const imageMedia = media.filter((item) => !isVideo(item));
    const videoMedia = media.filter(isVideo);

    if (!media.length) return null;

    return (
        <section className="mb-6 border-b border-blue-100 pb-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-blue-950">
                <ImageIcon size={17} className="text-blue-800" />
                Hình ảnh và video giới thiệu
            </div>

            {imageMedia.length ? (
                <ImageCarousel
                    images={imageMedia.map((item, index) => ({
                        id: item.mediaId || index,
                        src: getMediaUrl(item),
                        alt: item.alt || item.originalName || `Hình ảnh khóa học ${index + 1}`,
                    }))}
                />
            ) : null}

            {videoMedia.length ? (
                <div className={`${imageMedia.length ? "mt-3" : ""} space-y-3`}>
                    {videoMedia.map((item, index) => (
                        <div key={item.mediaId || item.viewUrl || index} className="overflow-hidden rounded-xl bg-blue-950">
                            <video
                                controls
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                src={getMediaUrl(item)}
                                className="aspect-video w-full bg-black object-contain"
                                aria-label={item.alt || item.originalName || `Video giới thiệu ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>
            ) : null}
        </section>
    );
};

const extractYoutubeVideoId = (url) => {
    if (!url || typeof url !== 'string') return null;

    try {
        const parsed = new URL(url);
        const hostname = parsed.hostname.toLowerCase();

        if (hostname.includes('youtu.be')) {
            const id = parsed.pathname.slice(1).split('/')[0];
            return id?.length === 11 ? id : null;
        }

        const watchId = parsed.searchParams.get('v');
        if (watchId?.length === 11) return watchId;

        if (parsed.pathname.includes('/embed/')) {
            const id = parsed.pathname.split('/embed/')[1]?.split('/')[0];
            return id?.length === 11 ? id : null;
        }

        if (parsed.pathname.includes('/shorts/')) {
            const id = parsed.pathname.split('/shorts/')[1]?.split('/')[0];
            return id?.length === 11 ? id : null;
        }

        return null;
    } catch {
        return null;
    }
};

const YoutubeEmbed = ({ url, title = 'Video YouTube', className = '' }) => {
    const videoId = extractYoutubeVideoId(url);

    if (!videoId) {
        return (
            <div className={`aspect-video w-full rounded-xl border border-slate-200 bg-slate-100 ${className}`}>
                <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-600">
                    Không thể hiển thị video YouTube từ đường dẫn này.
                </div>
            </div>
        );
    }

    return (
        <div className={`aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 ${className}`}>
            <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
            />
        </div>
    );
};

export default YoutubeEmbed;
export { extractYoutubeVideoId };
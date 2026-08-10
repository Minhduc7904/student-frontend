import { useMemo, useState } from 'react';
import { FileText, Image as ImageIcon, X, ZoomIn } from 'lucide-react';
import { Image } from '../../../shared/components/images';

const getMediaUrl = (media) => (typeof media === 'string' ? media : media?.viewUrl || media?.url || '');
const getFieldName = (media) => String(media?.fieldName || '').toUpperCase();
const isImage = (media) => media?.type === 'IMAGE' || media?.mimeType?.startsWith('image/') || ['COVER', 'GALLERY', 'OG_IMAGE'].includes(getFieldName(media));
const isVideo = (media) => media?.type === 'VIDEO' || media?.mimeType?.startsWith('video/');

const getDisplayMedia = (book) => {
    const seen = new Set();
    return (book?.media || []).filter((media) => {
        const url = getMediaUrl(media);
        const key = media?.mediaId || url;
        if (!url || seen.has(key)) return false;
        seen.add(key);
        return true;
    }).sort((left, right) => Number(getFieldName(right) === 'COVER') - Number(getFieldName(left) === 'COVER'));
};

const mediaLabel = (media, index) => media?.alt || media?.originalName || (getFieldName(media) === 'COVER' ? 'Bìa sách' : `Hình ảnh sách ${index + 1}`);

const EmptyGallery = () => (
    <div className="flex h-[22rem] w-full items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-blue-50 text-blue-800 sm:h-[34rem]">
        <div className="text-center"><ImageIcon size={32} className="mx-auto" /><p className="mt-3 text-sm font-semibold">Hình ảnh sách đang cập nhật</p></div>
    </div>
);

const BookMediaGallery = ({ book }) => {
    const media = useMemo(() => getDisplayMedia(book), [book]);
    const images = media.filter(isImage);
    const videos = media.filter(isVideo);
    const files = media.filter((item) => !isImage(item) && !isVideo(item));
    const [activeImage, setActiveImage] = useState(0);
    const [previewOpen, setPreviewOpen] = useState(false);
    const active = images[activeImage] || images[0];

    return (
        <section aria-label="Thư viện hình ảnh sách">
            {images.length ? (
                <div className="grid gap-4 sm:grid-cols-[5rem_minmax(0,1fr)] sm:items-start">
                    <div className="order-2 flex gap-2 overflow-x-auto pb-1 sm:order-none sm:h-[34rem] sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden">
                        {images.map((mediaItem, index) => <button key={mediaItem.mediaId || getMediaUrl(mediaItem)} type="button" onClick={() => setActiveImage(index)} className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${activeImage === index ? 'border-blue-800 ring-2 ring-blue-100' : 'border-transparent hover:border-blue-200'}`} aria-label={`Xem ${mediaLabel(mediaItem, index)}`} aria-current={activeImage === index ? 'true' : undefined}><Image src={getMediaUrl(mediaItem)} alt="" className="h-full w-full" style={{ objectFit: 'contain' }} loading="lazy" /></button>)}
                    </div>
                    <button type="button" onClick={() => setPreviewOpen(true)} className="group relative flex h-[22rem] w-full min-w-0 items-center justify-center overflow-hidden rounded-2xl border border-blue-100 bg-white text-left shadow-sm sm:h-[34rem]"><Image src={getMediaUrl(active)} alt={mediaLabel(active, activeImage)} className="h-full w-full transition duration-300 group-hover:scale-[1.02]" style={{ objectFit: 'contain' }} /><span className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950/80 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"><ZoomIn size={19} /></span></button>
                </div>
            ) : <EmptyGallery />}

            {videos.length ? <div className="mt-5 space-y-3">{videos.map((mediaItem, index) => <div key={mediaItem.mediaId || getMediaUrl(mediaItem)} className="overflow-hidden rounded-xl bg-blue-950"><video controls playsInline preload="metadata" src={getMediaUrl(mediaItem)} className="aspect-video w-full bg-black object-contain" aria-label={mediaLabel(mediaItem, index)} /></div>)}</div> : null}
            {files.length ? <div className="mt-5 grid gap-2 sm:grid-cols-2">{files.map((mediaItem, index) => <a key={mediaItem.mediaId || getMediaUrl(mediaItem)} href={getMediaUrl(mediaItem)} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white p-3 text-sm font-bold text-blue-950 transition hover:border-blue-300 hover:bg-blue-50"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-50 text-yellow-700"><FileText size={18} /></span><span className="min-w-0 truncate">{mediaLabel(mediaItem, index)}</span></a>)}</div> : null}

            {previewOpen && active ? <div className="fixed inset-0 z-[70] flex items-center justify-center bg-blue-950/90 p-4" role="dialog" aria-modal="true" aria-label="Xem ảnh sách"><button type="button" onClick={() => setPreviewOpen(false)} className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-950" aria-label="Đóng xem ảnh"><X size={20} /></button><img src={getMediaUrl(active)} alt={mediaLabel(active, activeImage)} className="max-h-[88dvh] max-w-full rounded-xl object-contain" /></div> : null}
        </section>
    );
};

export default BookMediaGallery;

import { useEffect, useRef, useState } from 'react';
import { bookService } from '../../../core/services/modules';

const unwrap = (response) => response?.data?.data ?? response?.data ?? response ?? null;

export const useBookDetail = (slug) => {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(Boolean(slug));
    const [error, setError] = useState('');
    const trackedSlugsRef = useRef(new Set());

    useEffect(() => {
        if (!slug) {
            setBook(null);
            setError('Không tìm thấy sách.');
            setLoading(false);
            return undefined;
        }

        let active = true;
        setLoading(true);
        setError('');

        const loadBook = async () => {
            try {
                const response = await bookService.getStudentBookDetail(slug);
                const data = unwrap(response);

                if (!active) return;
                setBook(data);

                if (!trackedSlugsRef.current.has(slug)) {
                    trackedSlugsRef.current.add(slug);
                    window.requestAnimationFrame(() => {
                        bookService.trackStudentBookView(slug).catch(() => undefined);
                    });
                }
            } catch (requestError) {
                if (active) {
                    setBook(null);
                    setError(requestError?.message || 'Không thể tải thông tin sách. Vui lòng thử lại sau.');
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadBook();
        return () => {
            active = false;
        };
    }, [slug]);

    return { book, loading, error };
};

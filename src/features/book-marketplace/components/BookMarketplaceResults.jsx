import { ArrowUpRight, BookOpen, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import { ContentLoading } from '../../../shared/components';
import { Image } from '../../../shared/components/images';
import MarketplacePagination from '../../course-marketplace/components/MarketplacePagination';

const formatPrice = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value) || 0)} đ`;
const getCover = (book) => book?.media?.find((media) => media.fieldName === 'cover')?.viewUrl || book?.media?.[0]?.viewUrl || '';

const BookCard = ({ book }) => (
    <Link to={ROUTES.BOOK_PURCHASE_DETAIL(book?.slug)} className="group block overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2" aria-label={`Xem sách ${book?.title || ''}`}>
        <div className="relative aspect-square overflow-hidden bg-blue-50">
            <Image src={getCover(book)} alt={book?.title || 'Bìa sách'} className="h-full w-full !object-contain transition duration-300 group-hover:scale-[1.03]" loading="lazy" />
            {book?.isFeatured ? <span className="absolute left-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-500 text-blue-950 shadow-sm" title="Sách nổi bật"><Sparkles size={14} /></span> : null}
        </div>
        <div className="p-3 sm:p-3.5">
            <h2 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-blue-950">{book?.title || 'Sách đang cập nhật'}</h2>
            <p className="mt-1 min-h-4 truncate text-xs font-medium text-gray-600">{book?.author || 'Đang cập nhật tác giả'}</p>
            <div className="mt-3 flex items-center justify-between gap-2"><p className="text-base font-bold text-blue-800">{formatPrice(book?.priceVnd)}</p><span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-800 transition group-hover:bg-blue-800 group-hover:text-white" title="Xem thông tin sách"><ArrowUpRight size={15} /></span></div>
        </div>
    </Link>
);

const BookMarketplaceResults = ({ books, loading, error, pagination, onPageChange }) => {
    if (loading) return <ContentLoading message="Đang tìm sách phù hợp..." height="py-20" />;
    if (error) return <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-5 text-center text-sm font-medium text-red-600">{error}</div>;
    if (!books.length) return <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-white px-6 py-16 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-800"><BookOpen size={24} /></span><h2 className="mt-4 text-lg font-bold text-blue-950">Chưa tìm thấy sách phù hợp</h2><p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">Thử thay đổi từ khóa hoặc bộ lọc để xem thêm sách.</p></div>;

    return <section className="mt-5" aria-label="Danh sách sách"><div className="mb-3 flex items-center justify-between gap-4"><h2 className="text-base font-bold text-blue-950">Sách đang có</h2><p className="text-xs font-medium text-gray-600">{pagination?.total ?? books.length} đầu sách</p></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{books.map((book) => <BookCard key={book.bookId} book={book} />)}</div><MarketplacePagination pagination={pagination} onPageChange={onPageChange} /></section>;
};

export default BookMarketplaceResults;

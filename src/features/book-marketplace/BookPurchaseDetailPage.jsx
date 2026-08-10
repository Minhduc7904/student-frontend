import { ArrowLeft, BookOpen, Building2, ExternalLink, Hash, LibraryBig, MessageCircle, Phone, Tag } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../core/constants';
import { ContentLoading } from '../../shared/components';
import MarkdownRenderer from '../../shared/components/markdown/MarkdownRenderer';
import BookMediaGallery from './components/BookMediaGallery';
import { useBookDetail } from './hooks/useBookDetail';

const formatPrice = (value) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
}).format(Number(value) || 0);

const DetailRow = ({ Icon, label, value }) => value ? (
    <div className="flex items-start gap-3">
        <Icon size={17} className="mt-0.5 shrink-0 text-blue-800" />
        <div>
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="mt-0.5 text-sm font-bold text-blue-950">{value}</p>
        </div>
    </div>
) : null;

const BookPurchaseNotFound = ({ message }) => (
    <div className="flex min-h-[55dvh] flex-col items-center justify-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-800"><BookOpen size={27} /></span>
        <h1 className="mt-5 text-2xl font-bold text-blue-950">Không tìm thấy sách</h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">{message || 'Sách này không còn được hiển thị hoặc đã được cập nhật.'}</p>
        <Link to={ROUTES.BOOK_MARKETPLACE} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-800 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-900"><ArrowLeft size={17} /> Quay lại mua sách</Link>
    </div>
);

const BookIntroduction = ({ book }) => (
    <section className="min-w-0 rounded-2xl border border-blue-100 bg-white p-5 sm:p-7 lg:col-start-1">
        <div className="flex items-center gap-2 text-sm font-bold text-blue-950"><LibraryBig size={18} className="text-blue-800" /> Giới thiệu sách</div>
        {book.shortDescription ? <p className="mt-4 text-base font-semibold leading-7 text-gray-700">{book.shortDescription}</p> : null}
        {book.content ? <MarkdownRenderer content={book.content} className="mt-5 text-sm leading-7 text-gray-700" imgClassNameSize="max-w-full max-h-[520px] rounded-xl" /> : <p className="mt-4 text-sm leading-6 text-gray-600">Nội dung chi tiết của sách đang được cập nhật.</p>}
    </section>
);

const BookPurchaseSidebar = ({ book, categories, contactPhone, contactFacebook }) => (
    <aside className="h-fit min-w-0 lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2">
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap gap-2">{categories.map((category) => <span key={category.bookCategoryId || category.slug} className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800">{category.name}</span>)}</div>
            <h1 className="mt-4 text-2xl font-bold leading-8 text-blue-950 sm:text-3xl">{book.title}</h1>
            {book.author ? <p className="mt-2 text-sm font-semibold text-gray-600">Tác giả: {book.author}</p> : null}
            <div className="mt-6 border-y border-blue-100 py-5"><p className="text-xs font-medium text-gray-500">Giá sách</p><p className="mt-1 text-3xl font-bold text-blue-950">{formatPrice(book.priceVnd)}</p></div>
            <div className="mt-5 space-y-4"><DetailRow Icon={BookOpen} label="Tác giả" value={book.author} /><DetailRow Icon={Building2} label="Nhà xuất bản" value={book.publisher} /><DetailRow Icon={Hash} label="ISBN" value={book.isbn} /><DetailRow Icon={Tag} label="Mã sách" value={book.sku} /></div>
            {contactPhone || contactFacebook ? <div className="mt-6 border-t border-blue-100 pt-5"><p className="text-sm font-bold text-blue-950">Bạn muốn sở hữu cuốn sách này?</p><p className="mt-1 text-xs leading-5 text-gray-600">Liên hệ nhà sách để được tư vấn và đặt mua.</p><div className="mt-4 grid gap-2">{contactPhone ? <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 text-sm font-bold text-white transition hover:bg-blue-900"><Phone size={17} /> Gọi tư vấn</a> : null}{contactFacebook ? <a href={contactFacebook} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-white px-4 text-sm font-bold text-blue-800 transition hover:bg-blue-50"><MessageCircle size={17} /> Nhắn Facebook <ExternalLink size={14} /></a> : null}</div></div> : null}
        </div>
    </aside>
);

const BookPurchaseDetailPage = () => {
    const { bookSlug } = useParams();
    const { book, loading, error } = useBookDetail(bookSlug);

    if (loading) return <div className="flex min-h-[55dvh] items-center justify-center"><ContentLoading /></div>;
    if (error || !book) return <BookPurchaseNotFound message={error} />;

    const categories = book.categories || [];
    const contact = book.contact || {};
    const contactPhone = String(contact.phone || '').trim();
    const contactFacebook = String(contact.facebookUrl || '').trim();

    return (
        <main className="pb-8 text-blue-950">
            <Link to={ROUTES.BOOK_MARKETPLACE} className="inline-flex items-center gap-2 text-sm font-bold text-blue-800 transition hover:text-blue-950"><ArrowLeft size={17} /> Quay lại mua sách</Link>
            <div className="mt-5 grid gap-7 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-10">
                <section className="min-w-0 lg:col-start-1"><BookMediaGallery book={book} /></section>
                <BookPurchaseSidebar book={book} categories={categories} contactPhone={contactPhone} contactFacebook={contactFacebook} />
                <BookIntroduction book={book} />
            </div>
        </main>
    );
};

export default BookPurchaseDetailPage;

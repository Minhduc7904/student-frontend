import { Clock3, Menu, Settings2, Wifi, WifiOff } from 'lucide-react';

const CompetitionRoomHeader = ({ title, remainingTime, connected, theme, onOpenNavigator, onOpenSettings, onSubmit }) => {
    const isDark = theme === 'dark';
    const headerClass = isDark ? 'border-slate-700 bg-slate-950/95 text-slate-100' : 'border-blue-100 bg-white/95 text-blue-950';
    const subtleButton = isDark ? 'border-slate-700 bg-slate-900 text-blue-200 hover:bg-slate-800' : 'border-blue-100 bg-white text-blue-800 hover:bg-blue-50';
    const timerClass = isDark ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-blue-100 bg-blue-50 text-blue-950';

    return <header className={`sticky top-0 z-30 border-b backdrop-blur ${headerClass}`}>
        <div className="mx-auto flex min-h-16 max-w-[1440px] items-center gap-3 px-3 sm:px-5 lg:px-7">
            <button type="button" onClick={onOpenNavigator} className={`inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border lg:hidden ${subtleButton}`} aria-label="Mở danh sách câu hỏi"><Menu size={20} /></button>
            <div className="min-w-0 flex-1"><p className="hidden text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300 sm:block">Phòng thi trực tuyến</p><h1 className="truncate text-base font-bold sm:text-lg">{title || 'Đang tải đề thi...'}</h1></div>
            <span className={`inline-flex h-2.5 w-2.5 rounded-full sm:hidden ${connected ? 'bg-green-500' : 'bg-red-500'}`} aria-label={connected ? 'Đã kết nối' : 'Mất kết nối'} />
            <div className={`hidden items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-bold sm:inline-flex ${connected ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300' : 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300'}`}>{connected ? <Wifi size={15} /> : <WifiOff size={15} />}<span>{connected ? 'Đã kết nối' : 'Mất kết nối'}</span></div>
            <div className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3 ${timerClass}`}><Clock3 size={18} className="text-blue-700 dark:text-blue-300" /><span className="font-mono text-sm font-bold tabular-nums sm:text-base">{remainingTime}</span></div>
            <button type="button" onClick={onOpenSettings} className={`inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border ${subtleButton}`} aria-label="Cài đặt hiển thị"><Settings2 size={19} /></button>
            <button type="button" onClick={onSubmit} className="hidden h-10 cursor-pointer items-center justify-center rounded-xl bg-blue-800 px-4 text-sm font-bold text-white transition hover:bg-blue-900 sm:inline-flex">Nộp bài</button>
        </div>
    </header>;
};

export default CompetitionRoomHeader;

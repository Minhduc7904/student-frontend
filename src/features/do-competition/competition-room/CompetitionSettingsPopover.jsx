import { LayoutList, Minus, Moon, PanelsTopLeft, Plus, Sun } from 'lucide-react';

const CompetitionSettingsPopover = ({ preferences, onChange, onClose }) => {
    const isDark = preferences.theme === 'dark';
    const surface = isDark ? 'border-slate-700 bg-slate-900 text-slate-100 shadow-black/35' : 'border-blue-100 bg-white text-blue-950 shadow-blue-950/15';
    const divider = isDark ? 'border-slate-700' : 'border-blue-100';
    const inactive = isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-blue-100 text-blue-800 hover:bg-blue-50';
    const fontBox = isDark ? 'bg-slate-800' : 'bg-blue-50';
    const iconButton = isDark ? 'text-blue-200 hover:bg-slate-700' : 'text-blue-800 hover:bg-white';

    const modeButton = (active) => active ? 'border-blue-700 bg-blue-800 text-white' : inactive;

    return <div className="fixed inset-0 z-40" onClick={onClose}>
        <section className={`absolute right-3 top-16 w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl border p-4 shadow-xl sm:right-5 ${surface}`} onClick={(event) => event.stopPropagation()} aria-label="Cài đặt hiển thị">
            <h2 className="text-base font-bold">Cài đặt hiển thị</h2>
            <div className={`mt-4 border-t pt-4 ${divider}`}><p className="text-sm font-bold">Giao diện</p><div className="mt-2 grid grid-cols-2 gap-2"><button type="button" onClick={() => onChange({ theme: 'light' })} className={`inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-bold ${modeButton(preferences.theme === 'light')}`}><Sun size={16} /> Sáng</button><button type="button" onClick={() => onChange({ theme: 'dark' })} className={`inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-bold ${modeButton(preferences.theme === 'dark')}`}><Moon size={16} /> Tối</button></div></div>
            <div className={`mt-5 border-t pt-4 ${divider}`}><p className="text-sm font-bold">Cách hiển thị câu hỏi</p><div className="mt-2 grid grid-cols-2 gap-2"><button type="button" onClick={() => onChange({ viewMode: 'single' })} className={`inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border px-2 text-sm font-bold ${modeButton(preferences.viewMode === 'single')}`}><PanelsTopLeft size={16} /> Từng câu</button><button type="button" onClick={() => onChange({ viewMode: 'list' })} className={`inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border px-2 text-sm font-bold ${modeButton(preferences.viewMode === 'list')}`}><LayoutList size={16} /> Theo phần</button></div></div>
            <div className={`mt-5 border-t pt-4 ${divider}`}><p className="text-sm font-bold">Cỡ chữ</p><div className={`mt-2 flex items-center justify-between rounded-xl p-1 ${fontBox}`}><button type="button" onClick={() => onChange({ fontScale: Math.max(0.9, preferences.fontScale - 0.1) })} className={`inline-flex h-9 w-10 cursor-pointer items-center justify-center rounded-lg ${iconButton}`} aria-label="Giảm cỡ chữ"><Minus size={17} /></button><span className="text-sm font-bold">{Math.round(preferences.fontScale * 100)}%</span><button type="button" onClick={() => onChange({ fontScale: Math.min(1.25, preferences.fontScale + 0.1) })} className={`inline-flex h-9 w-10 cursor-pointer items-center justify-center rounded-lg ${iconButton}`} aria-label="Tăng cỡ chữ"><Plus size={17} /></button></div></div>
        </section>
    </div>;
};

export default CompetitionSettingsPopover;

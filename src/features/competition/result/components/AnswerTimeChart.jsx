import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Clock3, Gauge, Sigma, Timer } from 'lucide-react';

const toSeconds = (value) => {
    const seconds = Number(value);
    return Number.isFinite(seconds) && seconds >= 0 ? seconds : 0;
};

const formatDuration = (seconds) => {
    if (seconds == null) return '--';

    const totalSeconds = Math.round(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    return hours > 0
        ? `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
        : `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
};

const TimeStat = ({ icon: Icon, label, value, detail }) => (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Icon className="h-3.5 w-3.5 text-blue-700" />
            {label}
        </div>
        <p className="mt-1 text-lg font-bold tabular-nums text-blue-950">{value}</p>
        {detail && <p className="mt-0.5 text-[11px] text-slate-500">{detail}</p>}
    </div>
);

const AnswerTimeChart = ({ answers }) => {
    const data = useMemo(() => (answers ?? []).map((answer, index) => ({
        index: index + 1,
        seconds: toSeconds(answer?.timeSpentSeconds),
        hasTime: answer?.timeSpentSeconds != null,
    })), [answers]);

    const timedAnswers = data.filter((item) => item.hasTime);
    const totalSeconds = data.reduce((total, item) => total + item.seconds, 0);
    const averageSeconds = data.length > 0 ? totalSeconds / data.length : null;
    const longest = timedAnswers.length > 0
        ? timedAnswers.reduce((current, item) => item.seconds > current.seconds ? item : current)
        : null;
    const fastest = timedAnswers.length > 0
        ? timedAnswers.reduce((current, item) => item.seconds < current.seconds ? item : current)
        : null;

    const option = useMemo(() => ({
        animationDuration: 450,
        animationEasing: 'cubicOut',
        aria: {
            enabled: true,
            description: 'Biểu đồ thời gian làm từng câu hỏi theo giây.',
        },
        grid: { top: 22, right: 14, bottom: 34, left: 48 },
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#172554',
            borderWidth: 0,
            textStyle: { color: '#ffffff' },
            formatter: (params) => {
                const item = params?.[0];
                return item ? `Câu ${item.dataIndex + 1}<br/>${formatDuration(item.value)}` : '';
            },
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.map((item) => `Câu ${item.index}`),
            axisTick: { show: false },
            axisLine: { lineStyle: { color: '#bfdbfe' } },
            axisLabel: {
                color: '#475569',
                fontSize: 11,
                interval: data.length > 8 ? 'auto' : 0,
            },
        },
        yAxis: {
            type: 'value',
            min: 0,
            name: 'Thời gian',
            nameTextStyle: { color: '#64748b', fontSize: 11, padding: [0, 0, 0, -4] },
            axisLabel: { color: '#64748b', fontSize: 11, formatter: (value) => formatDuration(value) },
            splitLine: { lineStyle: { color: '#dbeafe' } },
            axisLine: { show: false },
        },
        series: [{
            type: 'line',
            smooth: true,
            data: data.map((item) => item.seconds),
            symbol: 'circle',
            symbolSize: data.length > 18 ? 5 : 7,
            lineStyle: { color: '#194DB6', width: 3 },
            itemStyle: { color: '#194DB6', borderColor: '#ffffff', borderWidth: 2 },
            areaStyle: { color: 'rgba(25, 77, 182, 0.14)' },
            emphasis: { focus: 'series', scale: true },
        }],
    }), [data]);

    if (data.length === 0) return null;

    return (
        <section className="rounded-3xl border border-blue-100 bg-white p-4 shadow-[0_12px_30px_rgba(25,77,182,0.06)] sm:p-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">Nhịp độ làm bài</p>
                    <h2 className="mt-1 text-h4 font-bold text-blue-950">Thời gian cho từng câu</h2>
                </div>
                <span className="w-fit rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
                    {data.length} câu
                </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                <TimeStat icon={Gauge} label="Trung bình / câu" value={formatDuration(averageSeconds)} />
                <TimeStat icon={Sigma} label="Tổng thời gian" value={formatDuration(totalSeconds)} />
                <TimeStat
                    icon={Timer}
                    label="Lâu nhất"
                    value={longest ? formatDuration(longest.seconds) : '--'}
                    detail={longest ? `Câu ${longest.index}` : 'Chưa có dữ liệu'}
                />
                <TimeStat
                    icon={Clock3}
                    label="Nhanh nhất"
                    value={fastest ? formatDuration(fastest.seconds) : '--'}
                    detail={fastest ? `Câu ${fastest.index}` : 'Chưa có dữ liệu'}
                />
            </div>

            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/40 px-1 pt-2 sm:px-2">
                <ReactECharts
                    option={option}
                    style={{ height: 280, width: '100%' }}
                    opts={{ renderer: 'svg' }}
                    notMerge
                    lazyUpdate
                />
            </div>
        </section>
    );
};

export default AnswerTimeChart;

import { memo, useState, useRef, useEffect } from "react";
import SessionTooltip from "./SessionTooltip";
import { COLOR_MAP } from "./Calendar";

const CalendarDay = ({ day, session, loading }) => {
    const [hovered, setHovered] = useState(false);
    const [position, setPosition] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
        if (hovered && session && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setPosition({
                left: rect.left + rect.width / 2,
                top: rect.top,
            });
        } else {
            setPosition(null);
        }
    }, [hovered, session]);

    if (!day) return <div />;

    const color = session ? COLOR_MAP[session.color] : null;

    return (
        <>
            <div
                ref={ref}
                onMouseEnter={() => session && setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={`w-6 h-6 flex items-center justify-center rounded-full cursor-pointer
                ${session ? `${color.bg} ${color.text} font-semibold` : "hover:bg-blue-100 text-blue-800"}`}
            >
                {day}
            </div>

            {hovered && session && (
                <SessionTooltip session={session} position={position} />
            )}
        </>
    );
};

export default memo(CalendarDay);

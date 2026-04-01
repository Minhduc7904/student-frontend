import { memo, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const TOOLTIP_ANIMATION_DURATION_MS = 180;
const TOOLTIP_GAP_PX = 10;
const VIEWPORT_MARGIN_PX = 8;

/**
 * CustomTooltip
 * Tooltip đơn giản hiển thị phía dưới phần tử mục tiêu khi hover.
 */
const CustomTooltip = memo(({ text, children, className = "" }) => {
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);
    const hideTimeoutRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ left: 0, top: 0 });

    const updatePosition = useCallback(() => {
        if (!triggerRef.current) {
            return;
        }

        const rect = triggerRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const tooltipWidth = tooltipRef.current?.offsetWidth || 0;
        const tooltipHeight = tooltipRef.current?.offsetHeight || 0;

        const estimatedTooltipHeight = tooltipHeight || 72;
        const canPlaceBottom =
            rect.bottom + TOOLTIP_GAP_PX + estimatedTooltipHeight + VIEWPORT_MARGIN_PX <= viewportHeight;

        const top = canPlaceBottom
            ? rect.bottom + TOOLTIP_GAP_PX
            : Math.max(
                VIEWPORT_MARGIN_PX,
                rect.top - estimatedTooltipHeight - TOOLTIP_GAP_PX
            );

        const halfTooltipWidth = tooltipWidth > 0 ? tooltipWidth / 2 : 0;
        const minCenter = VIEWPORT_MARGIN_PX + halfTooltipWidth;
        const maxCenter = viewportWidth - VIEWPORT_MARGIN_PX - halfTooltipWidth;
        const idealCenter = rect.left + rect.width / 2;
        const left =
            minCenter <= maxCenter
                ? Math.min(maxCenter, Math.max(minCenter, idealCenter))
                : idealCenter;

        setPosition({
            left,
            top,
        });
    }, []);

    const handleMouseEnter = useCallback(() => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }

        updatePosition();
        setIsOpen(true);
        requestAnimationFrame(() => {
            setIsVisible(true);
        });
    }, [updatePosition]);

    const handleMouseLeave = useCallback(() => {
        setIsVisible(false);
        hideTimeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, TOOLTIP_ANIMATION_DURATION_MS);
    }, []);

    useEffect(() => {
        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const frame = requestAnimationFrame(() => {
            updatePosition();
        });

        const handleReposition = () => updatePosition();

        window.addEventListener("scroll", handleReposition, true);
        window.addEventListener("resize", handleReposition);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", handleReposition, true);
            window.removeEventListener("resize", handleReposition);
        };
    }, [isOpen, updatePosition, text]);

    return (
        <div
            ref={triggerRef}
            className={`inline-flex ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}

            {isOpen &&
                createPortal(
                    <div
                        ref={tooltipRef}
                        className={`pointer-events-none fixed z-9999 -translate-x-1/2 transition-opacity duration-200 ease-out ${
                            isVisible ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ left: `${position.left}px`, top: `${position.top}px` }}
                    >
                        <div className="max-w-56 rounded-lg border border-gray-200 bg-white px-3 py-2 text-center text-xs font-medium text-gray-700 shadow-lg">
                            {text}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
});

CustomTooltip.displayName = "CustomTooltip";

export default CustomTooltip;

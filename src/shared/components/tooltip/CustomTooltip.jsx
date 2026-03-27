import { memo, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const TOOLTIP_ANIMATION_DURATION_MS = 180;

/**
 * CustomTooltip
 * Tooltip đơn giản hiển thị phía dưới phần tử mục tiêu khi hover.
 */
const CustomTooltip = memo(({ text, children, className = "" }) => {
    const triggerRef = useRef(null);
    const hideTimeoutRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ left: 0, top: 0 });

    const updatePosition = useCallback(() => {
        if (!triggerRef.current) {
            return;
        }

        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
            left: rect.left + rect.width / 2,
            top: rect.bottom + 10,
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

        const handleReposition = () => updatePosition();

        window.addEventListener("scroll", handleReposition, true);
        window.addEventListener("resize", handleReposition);

        return () => {
            window.removeEventListener("scroll", handleReposition, true);
            window.removeEventListener("resize", handleReposition);
        };
    }, [isOpen, updatePosition]);

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
                        className={`pointer-events-none fixed z-9999 -translate-x-1/2 transition-all duration-200 ease-out ${
                            isVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
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

import { memo } from "react";

const Card = ({ children, className = "" }) => (
    <div className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
        {children}
    </div>
);

Card.displayName = "Card";

export default memo(Card);

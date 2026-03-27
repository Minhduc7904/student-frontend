import { memo } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "../logo";
import RightHeader from "./RightHeader";

/**
 * MobileTopHeader
 * Header cho mobile với nút mở menu và cụm thông tin user.
 */
const MobileTopHeader = memo(({ profile, isMobileMenuOpen, onToggleMobileMenu }) => {
    return (
        <div className="md:hidden w-full border-b border-gray-200 bg-white">
            <header className="mx-auto w-full max-w-300 px-3 py-1.5">
                <div className="flex h-9 items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onToggleMobileMenu}
                            className="rounded-lg p-1.5"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X size={20} className="text-gray-900" />
                            ) : (
                                <Menu size={20} className="text-gray-900" />
                            )}
                        </button>
                        <Logo mode="default" className="h-7 w-auto object-contain" containerClassName="flex items-center" />
                    </div>

                    <RightHeader profile={profile} compact />
                </div>
            </header>
        </div>
    );
});

MobileTopHeader.displayName = "MobileTopHeader";

export default MobileTopHeader;

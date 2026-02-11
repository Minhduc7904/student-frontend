import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, Header } from "./components";
import { getItem, setItem } from "../../../shared/utils/storage";
import { STORAGE_KEYS } from "../../../core/constants/storageKeys";

export const HomeLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const saved = getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
        return saved !== null ? saved : false;
    });

    const handleToggleSidebar = () => {
        const newValue = !isSidebarCollapsed;
        setIsSidebarCollapsed(newValue);
        setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, newValue);
    };

    return (
        <div className="min-h-screen flex bg-gray-50">

            {/* Sidebar */}
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                onToggleCollapse={handleToggleSidebar}
            />

            {/* Right Side */}
            <div className="flex-1 flex flex-col">

                {/* Header */}
                <Header />

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default HomeLayout;

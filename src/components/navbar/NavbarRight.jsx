import React from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Search, ShoppingCart } from "lucide-react";
import NotificationDropdown from "../../components/notification/NotificationDropdown";
import ProfileDropdown from "../../components/user/ProfileDropdown";

const NavbarRight = ({
    user,
    searchKeyword,
    setSearchKeyword,
    handleSearchKey,
    currentTheme,
    toggleDarkMode,
    handleLogout,
    dropdownOpen,
    setDropdownOpen,
    notifications,
    loadingNotifications,
    showNotifications,
    setShowNotif,
    setShowMobileSearch,
}) => (
    <>
        {/* desktop */}
        <div className="hidden md:flex items-center gap-4">
            {/* search */}
            <div className="relative">
                <input
                    type="text"
                    value={searchKeyword}
                    onChange={e => setSearchKeyword(e.target.value)}
                    onKeyDown={handleSearchKey}
                    placeholder="Search your project name"
                    className="rounded-full px-4 py-2 pl-10 w-[280px] text-sm focus:outline-none border shadow-sm"
                    style={{
                        backgroundColor: "var(--bg-color)",
                        color: "var(--text-secondary)",
                        borderColor: "var(--border-color)",
                    }}
                />
                <Search size={16}
                    className="absolute left-3 top-2.5 pointer-events-none"
                    style={{ color: "var(--text-secondary)" }} />
            </div>

            {/* theme */}
            <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md border hover:shadow-sm transition"
                style={{
                    backgroundColor: "var(--bg-color)",
                    color: "var(--text-secondary)",
                    borderColor: "var(--border-color)",
                }}
                aria-label="Toggle theme"
            >
                {currentTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* cart */}
            {user && (
                <Link
                    to="/my-orders"
                    className="transition hover:text-blue-600"
                    style={{ color: "var(--text-secondary)" }}
                    aria-label="My orders"
                ><ShoppingCart size={18} /></Link>
            )}

            {/* notifications */}
            {user && (
                <NotificationDropdown
                    notifications={notifications}
                    setNotifications={() => { }}
                    unreadCount={notifications.filter(n => !n.read).length}
                    loadingNotifications={loadingNotifications}
                    showNotifications={showNotifications}
                    setShowNotifications={setShowNotif}
                />
            )}

            {/* profile / login */}
            {user ? (
                <ProfileDropdown
                    user={user}
                    dropdownOpen={dropdownOpen}
                    setDropdownOpen={setDropdownOpen}
                    handleLogout={handleLogout}
                />
            ) : (
                <button
                    onClick={() => window.location.href = "/login"}
                    className="font-medium rounded px-6 py-2 hover:shadow transition"
                    style={{
                        backgroundColor: "var(--button-primary,#2563eb)",
                        color: "#fff",
                    }}>Login</button>
            )}
        </div>

        {/* mobile small icons */}
        <div className="flex md:hidden items-center gap-4">
            {user && (
                <NotificationDropdown
                    notifications={notifications}
                    setNotifications={() => { }}
                    unreadCount={notifications.filter(n => !n.read).length}
                    loadingNotifications={loadingNotifications}
                    showNotifications={showNotifications}
                    setShowNotifications={setShowNotif}
                />
            )}
            <button
                id="mobile-search-toggle"
                onClick={() => setShowMobileSearch(s => !s)}
                style={{ color: "var(--text-color)" }}
                aria-label="Search"
            ><Search size={20} /></button>
        </div>
    </>
);

export default NavbarRight;

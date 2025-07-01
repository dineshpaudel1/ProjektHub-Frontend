import React from "react";
import { Search } from "lucide-react";

const MobileSearch = ({
    searchKeyword,
    setSearchKeyword,
    handleSearchKey,
    mobileSearchRef,
}) => (
    <div id="mobile-search-bar"
        className="md:hidden px-4 py-3 border-b"
        style={{
            backgroundColor: "var(--bg-color)",
            borderColor: "var(--border-color)",
        }}>
        <div className="relative">
            <input
                ref={mobileSearchRef}
                type="text"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                onKeyDown={handleSearchKey}
                placeholder="Search projects..."
                className="rounded-full px-4 py-2 pl-10 w-full text-sm focus:outline-none border shadow-sm"
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
    </div>
);

export default MobileSearch;

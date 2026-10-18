"use client";

import { useState, useEffect, useRef } from "react";
import { DropDownMenu } from "./DropDownMenu";
import { UserMenu } from "./UserMenu";
import { SideBarMenu } from "./SideBarMenu";

export function AuthOrMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (window.innerWidth >= 768) {
      setIsDropdownOpen((prev) => !prev);
    } else {
      setIsSidebarOpen(true);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const updateViewport = () => setIsDesktop(window.innerWidth >= 768);

    updateViewport();
    window.addEventListener("resize", updateViewport);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", updateViewport);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <UserMenu toggleMenu={toggleDropdown} toggleSidebar={toggleSidebar} />

      <SideBarMenu isOpen={isSidebarOpen} onClose={toggleSidebar} />

      {isDropdownOpen && isDesktop && (
        <DropDownMenu onClose={toggleDropdown} />
      )}
    </div>
  );
}

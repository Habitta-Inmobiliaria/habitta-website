"use client";

import { Logo } from "@/src/components/auth";
import { NavBar } from "./NavBar";
import { AuthOrMenu } from "./AuthOrMenu";

export function Header() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full h-12">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-2 lg:px-4 py-4">
        <div className="flex-shrink-0">
          <Logo variant="wordmark" />
        </div>

        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
          <NavBar />
        </div>

        <div className="flex-shrink-0">
          <AuthOrMenu />
        </div>
      </div>
    </header>
  );
}

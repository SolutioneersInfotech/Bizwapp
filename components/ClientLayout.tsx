"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get current route
  const showSidebar = pathname !== "/"; // Hide sidebar on home page

  return (
    <div className="flex min-h-screen">
      {showSidebar && (
        <div className="w-72 h-screen text-white">
          <AppSidebar />
        </div>
      )}
      <div className={`flex-1 overflow-auto ${showSidebar ? "" : "w-full"}`}>
        {children}
      </div>
    </div>
  );
}

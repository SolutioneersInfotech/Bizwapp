// components/SidebarToggle.tsx
"use client";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "./app-sidebar";
import { Button } from "@/components/ui/button";

export function SidebarToggle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-[280px] ">
        <AppSidebar />
      </div>

      {/* Mobile Sidebar Sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="m-2">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4">
            <div className="text-black">Test Sidebar Content</div>
            <AppSidebar/>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

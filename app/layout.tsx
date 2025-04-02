import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { MessageProvider } from "@/contexts/MessageContext";
import { TemplateProvider } from "@/contexts/TemplateContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "../app/providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WhatsApp Business Messaging",
  description: "Engage with your customers efficiently",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <MessageProvider>
              <TemplateProvider>
                <AnalyticsProvider>
                  <Providers>
                    <TooltipProvider>
                      <SidebarProvider>
                        <div className="flex min-h-screen">
                          <div className="w-72 h-screen text-white ">
                            {" "}
                            <AppSidebar />
                          </div>
                          <main className="flex-1  overflow-auto">
                            {" "}
                            {/* Content takes remaining space */}
                            {children}
                          </main>
                        </div>
                      </SidebarProvider>
                    </TooltipProvider>
                    <ToastContainer />
                  </Providers>
                  <Toaster />
                </AnalyticsProvider>
              </TemplateProvider>
            </MessageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";

import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "./SidebarContext";
import { TooltipProvider } from "@/components/ui/tooltip";

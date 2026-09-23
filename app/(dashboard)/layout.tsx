import { DemoProvider, DemoBoundary } from '@/components/demo/demo-context';
import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoProvider><div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground">
      {/* Fixed Sticky Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          <DemoBoundary>{children}</DemoBoundary>
        </main>
      </div>
    </div></DemoProvider>
  );
}

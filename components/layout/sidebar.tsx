"use client";

import { useDemo } from '@/components/demo/demo-context';
import { canOpenRoute } from '@/lib/demo-scope';
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Network,
  Database,
  Sparkles,
  ShoppingCart,
  Layers,
  Truck,
  PackageCheck,
  Boxes,
  Cpu,
  Scissors,
  CheckCircle2,
  Send,
  Receipt,
  BarChart3,
  PlugZap,
  ShieldCheck,
  Building,
  Users,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  golden?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const {persona} = useDemo();

  const navSections: NavSection[] = [
    {
      title: "Core & Overview",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Module Dependency Map",
          href: "/modules",
          icon: Network,
          badge: "16 Modules",
          golden: true,
        },
      ],
    },
    {
      title: "Product & Commercial",
      items: [
        {
          title: "Master Data",
          href: "/masters",
          icon: Database,
        },
        {
          title: "Master PLM",
          href: "/plm/designs",
          icon: Sparkles,
          badge: "Looker",
        },
        {
          title: "Client PLM",
          href: "/plm/clients",
          icon: Sparkles,
        },
        {
          title: "R&D Workspace",
          href: "/plm/rd",
          icon: Sparkles,
          badge: "Develop",
        },
        {
          title: "CRM Client History",
          href: "/crm/clients",
          icon: Users,
        },
        {
          title: "Sales Enquiries",
          href: "/sales/enquiries",
          icon: ShoppingCart,
        },
        {
          title: "Sales Orders",
          href: "/sales/orders/a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
          icon: ShoppingCart,
          badge: "SO-APX",
          golden: true,
        },
      ],
    },
    {
      title: "Materials & Inventory",
      items: [
        {
          title: "BOM Tree & Revisions",
          href: "/manufacturing/boms/54be27f4-de88-561c-e6e8-abaf1d22885a",
          icon: Layers,
          badge: "v2 Active",
        },
        {
          title: "MRP Workbench",
          href: "/manufacturing/plans",
          icon: Layers,
          badge: "MRP",
        },
        {
          title: "Procurement (PO/RFQ)",
          href: "/procurement/requisitions",
          icon: Truck,
        },
        {
          title: "Inward Gate & GRN",
          href: "/procurement/receipts/grn-apex-01",
          icon: PackageCheck,
          badge: "QC Split",
        },
        {
          title: "Fabric Roll Genealogy",
          href: "/inventory/stock",
          icon: Boxes,
          badge: "Traceable",
        },
      ],
    },
    {
      title: "Manufacturing & QA",
      items: [
        {
          title: "Production Orders (WIP)",
          href: "/manufacturing/orders/d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
          icon: Cpu,
          badge: "7 Stages",
          golden: true,
        },
        {
          title: "Job Work / Subcontract",
          href: "/job-work/orders/jw-emb-01",
          icon: Scissors,
        },
        {
          title: "Quality Inspections",
          href: "/quality/inspections/qi-fabric-01",
          icon: CheckCircle2,
          badge: "Pass/Hold",
        },
      ],
    },
    {
      title: "Delivery & Finance",
      items: [
        {
          title: "Dispatch & POD",
          href: "/dispatch/plans/dp-apex-01",
          icon: Send,
          badge: "Partial",
        },
        {
          title: "Finance & Cost Waterfall",
          href: "/finance/profitability",
          icon: Receipt,
          badge: "9 Costs",
          golden: true,
        },
        {
          title: "Reports Catalogue",
          href: "/reports",
          icon: BarChart3,
          badge: "CSV",
        },
      ],
    },
    {
      title: "Governance & Systems",
      items: [
        {
          title: "Integrations Hub",
          href: "/integrations",
          icon: PlugZap,
          badge: "15 Mock",
        },
        {
          title: "Approval Queue",
          href: "/admin/approvals",
          icon: ShieldCheck,
          badge: "Maker-Checker",
        },
        {
          title: "Audit Trail",
          href: "/admin/audit",
          icon: Building,
        },
        {
          title: "User Directory & Scopes",
          href: "/admin/users",
          icon: Building,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 text-slate-200 flex flex-col h-screen shrink-0 sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white text-base shadow-md">
            IX
          </div>
          <div>
            <div className="font-bold text-sm text-white tracking-wider flex items-center gap-1.5">
              INNOTEX
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1 py-0.2 rounded border border-blue-500/30">
                ERP
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Textile & Garment System</div>
          </div>
        </Link>
      </div>

      {/* Navigation Links with Scroll */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {section.title}
            </h4>
            <div className="space-y-0.5">
              {section.items.filter(item=>canOpenRoute(persona.role,item.href)).map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
                      isActive
                        ? "bg-blue-600 text-white shadow-sm font-semibold"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60",
                      item.golden && !isActive && "border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10"
                    )}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-slate-400")} />
                      <span className="truncate">{item.title}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0",
                          isActive
                            ? "bg-white/20 text-white"
                            : item.golden
                            ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                            : "bg-slate-800 text-slate-400"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-slate-300 font-medium">Scoped demo</span>
        </div>
        <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-700 py-0">
          Demo Mode
        </Badge>
      </div>
    </aside>
  );
}

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatQuantity } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  Receipt,
  Boxes,
  Send,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "golden">("overview");

  const kpis = [
    {
      title: "Commercial Order Book",
      value: "₹30,24,000",
      change: "+18.4% vs last month",
      isPositive: true,
      icon: ShoppingCart,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300",
    },
    {
      title: "Shopfloor WIP Output",
      value: "1,095 pcs",
      change: "Apex Jacket run completed",
      isPositive: true,
      icon: Cpu,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300",
    },
    {
      title: "Attention Queue",
      value: "3 Alerts",
      change: "1 PO approval, 1 QC hold, 1 MRP",
      isPositive: false,
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300",
    },
    {
      title: "Gross Margin (Golden Order)",
      value: "28.4%",
      change: "₹8,58,800 net margin",
      isPositive: true,
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300",
    },
  ];

  const goldenStages = [
    { step: 1, name: "PLM Spec & Sample", status: "APPROVED", date: "10 Feb", doc: "SMP-APX-001 Rev 2" },
    { step: 2, name: "Sales Order", status: "POSTED", date: "12 Feb", doc: "SO-APX-2026-001" },
    { step: 3, name: "BOM & MRP Plan", status: "POSTED", date: "14 Feb", doc: "MRP-SO-APX-001" },
    { step: 4, name: "Procurement PO", status: "APPROVED", date: "15 Feb", doc: "PO-2026-042" },
    { step: 5, name: "Inward & QC Split", status: "POSTED", date: "18 Feb", doc: "GRN-2026-088" },
    { step: 6, name: "Roll Traceability", status: "POSTED", date: "19 Feb", doc: "R-POLY-001" },
    { step: 7, name: "Production (7 Stages)", status: "POSTED", date: "22 Feb", doc: "PRD-2026-101" },
    { step: 8, name: "Final Quality Release", status: "APPROVED", date: "24 Feb", doc: "QC-FG-2026-012" },
    { step: 9, name: "Partial Dispatch 1 & 2", status: "POSTED", date: "26 Feb", doc: "DC-APX-01 & 02" },
    { step: 10, name: "Tax Invoice & Margin", status: "POSTED", date: "28 Feb", doc: "INV-APX-01" },
  ];

  const attentionItems = [
    {
      id: "att-1",
      title: "Purchase Order Threshold Approval Required",
      docNumber: "PO-2026-042",
      amount: "₹1,84,800",
      description: "Zipper order exceeds ₹1,00,000 maker threshold; awaiting Management checker sign-off.",
      actionLabel: "Review Approval",
      href: "/admin/approvals",
      type: "APPROVAL",
      severity: "high",
    },
    {
      id: "att-2",
      title: "Quarantine Hold on Inward Fabric Roll",
      docNumber: "R-POLY-003",
      amount: "200 meters",
      description: "Incoming fabric roll quarantined for Delta-E shade variation; cannot reserve for cutting.",
      actionLabel: "Inspect Disposition",
      href: "/procurement/receipts/grn-apex-01",
      type: "QUALITY",
      severity: "medium",
    },
    {
      id: "att-3",
      title: "MRP Shortage Flagged for Trims",
      docNumber: "MRP-SO-APX-001",
      amount: "1,155 zippers",
      description: "Explosion calculated net shortage of coil zippers against SO-APX-2026-001.",
      actionLabel: "Open MRP Plan",
      href: "/manufacturing/plans",
      type: "MRP",
      severity: "medium",
    },
  ];

  const wipStages = [
    { name: "1. Cutting", planned: 1100, good: 1096, scrap: 4, rework: 0, status: "COMPLETED" },
    { name: "2. Stitching", planned: 1096, good: 1095, scrap: 0, rework: 1, status: "COMPLETED" },
    { name: "3. Printing", planned: 1095, good: 1095, scrap: 0, rework: 0, status: "COMPLETED" },
    { name: "4. Finishing", planned: 1095, good: 1095, scrap: 0, rework: 0, status: "COMPLETED" },
    { name: "5. Inspection", planned: 1095, good: 1095, scrap: 0, rework: 0, status: "COMPLETED" },
    { name: "6. Packing", planned: 1095, good: 1095, scrap: 0, rework: 0, status: "COMPLETED" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Management & Operations Dashboard
            </h1>
            <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700">
              INNOTEX • Coimbatore & Tirupur
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time manufacturing KPIs, attention queue, and end-to-end golden order progression.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/modules?workflow=golden-path">
            <Button size="sm" className="gap-1.5 text-xs bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold border border-amber-400 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              Play Golden Path Walkthrough
            </Button>
          </Link>
          <Link href="/reports">
            <Button size="sm" variant="outline" className="text-xs gap-1.5">
              Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} className="border-border shadow-xs hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground font-medium">{kpi.title}</span>
                  <div className="text-2xl font-bold text-foreground tracking-tight">{kpi.value}</div>
                  <span className={`text-[11px] font-medium ${kpi.isPositive ? "text-emerald-600" : "text-amber-600"}`}>
                    {kpi.change}
                  </span>
                </div>
                <div className={`p-2.5 rounded-xl ${kpi.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Golden Scenario Progress Tracker */}
      <Card className="border-amber-500/40 bg-gradient-to-br from-amber-500/5 via-background to-blue-500/5 shadow-sm">
        <CardHeader className="pb-3 border-b border-amber-500/20 flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
              <CardTitle className="text-base font-bold text-foreground">
                Golden Path Lifecycle: Custom Training Jacket (SO-APX-2026-001)
              </CardTitle>
              <Badge variant="golden" className="text-[10px]">
                Apex Endurance Sports Pvt Ltd
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Traceable 10-stage chain from PLM atelier sampling to finished delivery challan and invoice margin.
            </CardDescription>
          </div>

          <Link href="/sales/orders/a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 border-amber-400 bg-background text-foreground hover:bg-amber-50 dark:hover:bg-amber-950/40">
              Open Order Workbench
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-4">
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center min-w-[850px] justify-between relative">
              {/* Horizontal Connecting Line */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />

              {goldenStages.map((st, i) => (
                <div key={i} className="flex flex-col items-center text-center relative z-10 w-20">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center ring-4 ring-background shadow-xs">
                    {st.step}
                  </div>
                  <span className="font-bold text-[11px] text-foreground mt-2 leading-tight">
                    {st.name}
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground mt-0.5">
                    {st.doc}
                  </span>
                  <span className="text-[9px] text-emerald-600 font-semibold mt-0.5">
                    {st.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Attention Queue (Left 6 cols) + Shopfloor WIP Overview (Right 6 cols) */}
      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Attention Queue */}
        <div id="attention-queue" className="md:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              Attention Queue & Approvals
            </h3>
            <span className="text-xs text-muted-foreground">{attentionItems.length} items require review</span>
          </div>

          <div className="space-y-2.5">
            {attentionItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-lg border bg-card hover:border-slate-400 transition-colors shadow-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-xs text-foreground flex items-center gap-2">
                      <span>{item.title}</span>
                      <Badge variant="outline" className="font-mono text-[9px]">
                        {item.docNumber}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                  <Badge variant={item.severity === "high" ? "destructive" : "warning"} className="text-[10px] shrink-0">
                    {item.amount}
                  </Badge>
                </div>

                <div className="flex items-center justify-end pt-1">
                  <Link href={item.href}>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-blue-600 font-medium">
                      {item.actionLabel} <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shopfloor WIP Stage Card Tracker */}
        <div className="md:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-600" />
              Stage-Wise WIP Reconciliation (Apex Run)
            </h3>
            <Link href="/manufacturing/orders/d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a" className="text-xs text-blue-600 hover:underline">
              View Stage Cards
            </Link>
          </div>

          <Card className="border-border">
            <CardContent className="p-0 divide-y text-xs">
              {wipStages.map((stage, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground">{stage.name}</span>
                    <div className="text-[11px] text-muted-foreground">
                      Input: {stage.planned} • Output: <span className="font-medium text-foreground">{stage.good} pcs</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {stage.scrap > 0 && (
                      <Badge variant="destructive" className="text-[9px]">
                        Scrap: {stage.scrap}
                      </Badge>
                    )}
                    {stage.rework > 0 && (
                      <Badge variant="purple" className="text-[9px]">
                        Rework: {stage.rework}
                      </Badge>
                    )}
                    <Badge variant="success" className="text-[9px]">
                      {stage.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

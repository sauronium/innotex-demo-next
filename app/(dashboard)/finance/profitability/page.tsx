"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  Receipt,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Download,
  Info,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProfitabilityWorkbenchPage() {
  const [selectedScenario, setSelectedScenario] = useState("golden");

  // 9-Part Cost Component Waterfall from Section 14 & 15 of spec
  const costComponents = [
    {
      name: "1. Raw Material Cost",
      description: "Recycled Moisture Knit fabric (1,045m) + reflective tapes + woven brand labels",
      amount: 412500,
      share: "19.0%",
      color: "bg-blue-500",
    },
    {
      name: "2. Processing & Washing Cost",
      description: "Bio-wash, moisture surfactant treatment, and heat-set stabilization",
      amount: 148500,
      share: "6.8%",
      color: "bg-indigo-500",
    },
    {
      name: "3. Direct Labour Cost",
      description: "Cutting operators, 4-needle overlock stitching crew, iron & finishing operators",
      amount: 585000,
      share: "27.0%",
      color: "bg-emerald-500",
    },
    {
      name: "4. Machine & Power Cost",
      description: "Gerber auto-cutter run-time, Juki sewing electricity, steam generator",
      amount: 198000,
      share: "9.1%",
      color: "bg-teal-500",
    },
    {
      name: "5. Subcontracted Job Work",
      description: "Specialized multi-color chest & arm embroidery by Tirupur subcontractor",
      amount: 71500,
      share: "3.3%",
      color: "bg-amber-500",
    },
    {
      name: "6. Packaging Materials",
      description: "Individual recycled polybags, branded hangtags, 44 master corrugated shipping cartons",
      amount: 88000,
      share: "4.1%",
      color: "bg-cyan-500",
    },
    {
      name: "7. Transport & Freight Cost",
      description: "SpotOn dedicated logistics trucks from Tirupur Garment Unit to Bangalore Hub",
      amount: 54000,
      share: "2.5%",
      color: "bg-orange-500",
    },
    {
      name: "8. Factory Overhead Allocation",
      description: "Facility lease, supervisor salaries, atelier sampling amortisation",
      amount: 554200,
      share: "25.6%",
      color: "bg-slate-500",
    },
    {
      name: "9. Process Wastage & Cutting Scrap",
      description: "5% planned cutting loss + 4 pcs damaged panels during auto-cut",
      amount: 53500,
      share: "2.6%",
      color: "bg-rose-500",
    },
  ];

  const totalCost = costComponents.reduce((acc, c) => acc + c.amount, 0); // ₹21,65,200
  const grossRevenue = 3024000; // Tax-inclusive order total
  const netRevenue = 2640000; // Ex-tax revenue
  const grossMarginAmount = netRevenue - totalCost; // ₹4,74,800 or ₹8,58,800 depending on tax basis
  const grossMarginPercent = (grossMarginAmount / netRevenue) * 100; // ~18.0% or 28.4%

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
              Order Profitability & 9-Component Cost Waterfall
            </h1>
            <Badge variant="golden" className="text-xs">
              Apex Endurance Order (SO-APX-2026-001)
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Granular cost build-up across raw materials, labour, machines, job work, packaging, freight, overhead, and wastage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => toast.success("Profitability matrix exported to CSV")}
            variant="outline"
            className="gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Export Profitability CSV
          </Button>
          <Link href="/finance/invoices/inv-apex-01">
            <Button size="sm" className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold">
              <Receipt className="h-3.5 w-3.5" />
              Tax Invoice (INV-APX-01)
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Ex-Tax Net Revenue</span>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(netRevenue)}</div>
            <span className="text-[11px] text-muted-foreground">1,100 jackets @ ₹2,400 / pc</span>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Total Manufacturing Cost (9 Components)</span>
            <div className="text-2xl font-bold text-rose-600">{formatCurrency(totalCost)}</div>
            <span className="text-[11px] text-muted-foreground">Cost per unit: ₹{(totalCost / 1100).toFixed(2)}</span>
          </CardContent>
        </Card>

        <Card className="border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Net Order Gross Margin</span>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(grossMarginAmount)}</div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
              Gross Margin: {grossMarginPercent.toFixed(1)}%
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Visual Waterfall Strip */}
      <Card className="border-border shadow-xs">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold">Cost Component Waterfall Distribution</CardTitle>
            <Badge variant="outline" className="text-xs font-mono">
              Total Build-Up: 100%
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Normalized cost breakdown per commercial garment manufactured at Tirupur Unit
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Stacked Percentage Bar */}
          <div className="h-6 w-full rounded-md overflow-hidden flex shadow-xs">
            {costComponents.map((c, i) => (
              <div
                key={i}
                style={{ width: c.share }}
                className={`${c.color} h-full transition-all duration-300 hover:opacity-90 cursor-pointer`}
                title={`${c.name}: ${formatCurrency(c.amount)} (${c.share})`}
              />
            ))}
          </div>

          {/* Granular Cost Breakdown Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cost Element</TableHead>
                <TableHead>Component Scope & Incurred Activities</TableHead>
                <TableHead className="text-right">Total Incurred</TableHead>
                <TableHead className="text-right">Unit Cost (1,100 pcs)</TableHead>
                <TableHead className="text-right">Share of Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costComponents.map((c, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-semibold text-xs text-foreground flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${c.color} shrink-0`} />
                    {c.name}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.description}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-xs text-foreground">
                    {formatCurrency(c.amount)}
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono text-muted-foreground">
                    ₹{(c.amount / 1100).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-xs">
                    {c.share}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { FixedExample } from '@/components/demo/demo-context';
import { PLMProductionHandover } from '@/components/modules/plm-production-handover';
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatQuantity } from "@/lib/utils";
import {
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Truck,
  ArrowRight,
  ShieldCheck,
  Building2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function MaterialPlanningWorkbenchPage() {
  const [mrpStatus, setMrpStatus] = useState("APPROVED");
  const [prCreated, setPrCreated] = useState(true);

  const mrpHeader = {
    planNumber: "MRP-SO-APX-2026-001",
    salesOrderNumber: "SO-APX-2026-001",
    customer: "Apex Endurance Sports Pvt Ltd",
    product: "Custom Performance Training Jacket (SP-JKT-APX-01)",
    plannedQuantity: 1100,
    uom: "pcs",
    bomRevision: "BOM-APX-001 (Rev 2 - Released for Bulk)",
    status: mrpStatus,
    calculationDate: "2026-02-14",
  };

  const mrpLines = [
    {
      itemCode: "FAB-RM-POLY-01",
      itemName: "Recycled Moisture-Wicking Knit Fabric",
      category: "FABRIC",
      bomQtyPerUnit: 0.95,
      wastagePercent: 5.0, // 5% cutting wastage
      grossDemand: 1097.25, // 1100 * 0.95 * 1.05
      uom: "meters",
      availableStock: 1000.0,
      reservedStock: 0.0,
      netShortage: 97.25, // covered by planned PO
      suggestedAction: "PURCHASE",
      actionStatus: "PO Issued (PO-2026-042)",
    },
    {
      itemCode: "TRM-ZIP-65",
      itemName: "Recycled Coil Zipper 65cm",
      category: "TRIM",
      bomQtyPerUnit: 1.0,
      wastagePercent: 5.0,
      grossDemand: 1155.0,
      uom: "pcs",
      availableStock: 0.0,
      reservedStock: 0.0,
      netShortage: 1155.0, // Critical shortage
      suggestedAction: "PURCHASE",
      actionStatus: prCreated ? "PR-2026-001 Created" : "Requires PR",
    },
    {
      itemCode: "TRM-REF-01",
      itemName: "Reflective Performance Tape 25mm",
      category: "TRIM",
      bomQtyPerUnit: 0.5,
      wastagePercent: 3.0,
      grossDemand: 566.5,
      uom: "meters",
      availableStock: 1200.0,
      reservedStock: 0.0,
      netShortage: 0.0,
      suggestedAction: "STOCK_TRANSFER",
      actionStatus: "In Stock - Reserved",
    },
    {
      itemCode: "TRM-LBL-APX",
      itemName: "Apex Custom Woven Brand Label",
      category: "TRIM",
      bomQtyPerUnit: 1.0,
      wastagePercent: 2.0,
      grossDemand: 1122.0,
      uom: "pcs",
      availableStock: 2500.0,
      reservedStock: 0.0,
      netShortage: 0.0,
      suggestedAction: "STOCK_TRANSFER",
      actionStatus: "In Stock - Reserved",
    },
    {
      itemCode: "PKG-REC-01",
      itemName: "Recycled Garment Polybag",
      category: "PACKAGING",
      bomQtyPerUnit: 1.0,
      wastagePercent: 1.0,
      grossDemand: 1111.0,
      uom: "pcs",
      availableStock: 3000.0,
      reservedStock: 0.0,
      netShortage: 0.0,
      suggestedAction: "STOCK_TRANSFER",
      actionStatus: "In Stock - Reserved",
    },
  ];

  const handleCreatePR = () => {
    setPrCreated(true);
    toast.success("Purchase Requisition PR-2026-001 generated for 1,155 Coil Zippers!");
  };

  return (
    <div className="space-y-6">
      <PLMProductionHandover/><FixedExample>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="h-6 w-6 text-blue-600" />
              Material Requirements Planning (MRP)
            </h1>
            <StatusBadge status={mrpHeader.status} />
            <Badge variant="golden" className="text-xs">
              Explosion Workbench
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Order Demand: {mrpHeader.salesOrderNumber} • {mrpHeader.customer} • {mrpHeader.plannedQuantity} {mrpHeader.uom}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => toast.success("MRP calculation re-evaluated against active stock ledgers")}
            variant="outline"
            className="gap-1.5 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Recalculate MRP
          </Button>

          <Button
            size="sm"
            onClick={handleCreatePR}
            className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold"
          >
            <Truck className="h-3.5 w-3.5" />
            Generate Shortage PRs
          </Button>
        </div>
      </div>

      {/* Grid: MRP Context Card (4 cols) + Exploded Lines (8 cols) */}
      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Left Column: MRP Context & Formula */}
        <div className="md:col-span-4 space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/40">
              <CardTitle className="text-sm font-bold">MRP Calculation Engine</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground text-[11px]">Bound Commercial Order:</span>
                <div className="font-semibold text-foreground">{mrpHeader.salesOrderNumber}</div>
                <div className="text-[10px] text-muted-foreground">Volume: {mrpHeader.plannedQuantity} jackets</div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">BOM Revision Applied:</span>
                <div className="font-mono font-medium text-foreground mt-0.5">{mrpHeader.bomRevision}</div>
                <div className="text-[10px] text-muted-foreground">Includes cutting wastage % per component</div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">Explosion Formula:</span>
                <div className="p-2 rounded bg-slate-100 dark:bg-slate-900 font-mono text-[10px] text-slate-700 dark:text-slate-300 mt-1">
                  Demand = (OrderQty × BOMQty) × (1 + Wastage%)
                  <br />
                  Net Shortage = Demand - (Available - Reserved)
                </div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">Shortage Disposition:</span>
                <div className="flex items-center gap-1.5 text-rose-600 font-semibold mt-0.5">
                  <AlertTriangle className="h-4 w-4" />
                  <span>1 Shortage Identified (Zipper)</span>
                </div>
                <div className="text-[10px] text-muted-foreground">Triggered PR-2026-001 to Purchasing</div>
              </div>
            </CardContent>
          </Card>

          {/* Substitute Material Guidance */}
          <Card className="border-amber-400/40 bg-amber-50/20 dark:bg-amber-950/20">
            <CardContent className="p-3.5 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                Approved Substitute Available
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                If primary zipper <span className="font-mono text-foreground font-semibold">TRM-ZIP-65</span> has lead time delay, approved alternative <span className="font-mono text-foreground font-semibold">TRM-ZIP-65-ALT</span> has priority 1 substitute clearance in BOM v2.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Exploded MRP Line Items */}
        <div className="md:col-span-8 space-y-5">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Exploded Component Net Demand</CardTitle>
                <CardDescription className="text-xs">
                  Net requirement breakdown with ledger stock verification
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {mrpLines.length} Components
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component / Code</TableHead>
                    <TableHead className="text-right">Gross Demand</TableHead>
                    <TableHead className="text-right">Ledger Stock</TableHead>
                    <TableHead className="text-right">Net Shortage</TableHead>
                    <TableHead>Suggested Action</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mrpLines.map((line, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-xs">
                        <div className="font-semibold text-foreground">{line.itemName}</div>
                        <div className="font-mono text-[10px] text-muted-foreground">
                          {line.itemCode} • {line.wastagePercent}% waste
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-xs font-medium">
                        {line.grossDemand.toFixed(1)} {line.uom}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {line.availableStock.toFixed(1)} {line.uom}
                      </TableCell>
                      <TableCell className="text-right text-xs font-bold">
                        {line.netShortage > 0 ? (
                          <span className="text-rose-600 font-bold">{line.netShortage.toFixed(1)} {line.uom}</span>
                        ) : (
                          <span className="text-emerald-600">0.0 {line.uom}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={line.suggestedAction === "PURCHASE" ? "destructive" : "secondary"}
                          className="text-[10px]"
                        >
                          {line.suggestedAction}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs font-medium text-foreground">
                        {line.actionStatus}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="p-4 rounded-lg border bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Shortage PR converted to PO-2026-042 for zipper procurement.
            </span>
            <Link href="/procurement/requisitions">
              <Button size="sm" variant="outline" className="text-xs gap-1">
                View Purchase Orders <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </FixedExample>
    </div>
  );
}

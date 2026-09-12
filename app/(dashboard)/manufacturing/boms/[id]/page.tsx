"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { DocumentConnections } from "@/components/shared/document-connections";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  PackageCheck,
  Shuffle,
  FileText,
  DollarSign,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface BOMLineItem {
  id: string;
  itemCode: string;
  itemName: string;
  componentType: "FABRIC" | "TRIM" | "PACKAGING";
  quantity: number;
  uom: string;
  wastagePercent: number;
  unitCost: number;
  totalCost: number;
  substituteItem?: {
    code: string;
    name: string;
    conversionFactor: number;
    priority: number;
  };
}

interface BOMRevision {
  revisionNumber: number;
  status: "APPROVED" | "REJECTED" | "DRAFT";
  isReleasedForBulk: boolean;
  notes: string;
  approvedBy: string;
  approvedAt: string;
  lines: BOMLineItem[];
}

const REVISION_1_DATA: BOMRevision = {
  revisionNumber: 1,
  status: "REJECTED",
  isReleasedForBulk: false,
  notes: "Prototype 1 rejected in Tirupur Atelier stretch test. Zipper seam puckering observed; lacked stabilizing stay-tape.",
  approvedBy: "Rejected by Quality & Client Atelier",
  approvedAt: "2026-01-22",
  lines: [
    {
      id: "rev1-line-1",
      itemCode: "FAB-RM-POLY-01",
      itemName: "Recycled Moisture-Wicking Knit Fabric",
      componentType: "FABRIC",
      quantity: 0.60,
      uom: "MTR",
      wastagePercent: 7.0,
      unitCost: 336.0,
      totalCost: 201.6,
    },
    {
      id: "rev1-line-2",
      itemCode: "TRM-ZIP-65",
      itemName: "Recycled coil zipper 65cm",
      componentType: "TRIM",
      quantity: 1.0,
      uom: "PCS",
      wastagePercent: 0.0,
      unitCost: 90.0,
      totalCost: 90.0,
    },
    {
      id: "rev1-line-3",
      itemCode: "TRM-REF-01",
      itemName: "Reflective tape 25mm",
      componentType: "TRIM",
      quantity: 0.8,
      uom: "MTR",
      wastagePercent: 5.0,
      unitCost: 25.0,
      totalCost: 20.0,
    },
  ],
};

const REVISION_2_DATA: BOMRevision = {
  revisionNumber: 2,
  status: "APPROVED",
  isReleasedForBulk: true,
  notes: "Approved for bulk production. Added stabilizing seam tape and authorized approved alternative zipper TRM-ZIP-65-ALT.",
  approvedBy: "Dr. Meenakshi Iyer (Quality) & Vikram Rathore (Management)",
  approvedAt: "2026-02-09",
  lines: [
    {
      id: "b75db108-f896-1f38-a8ef-a36884c3de9d",
      itemCode: "FAB-RM-POLY-01",
      itemName: "Recycled Moisture-Wicking Knit Fabric",
      componentType: "FABRIC",
      quantity: 0.60,
      uom: "MTR",
      wastagePercent: 5.0,
      unitCost: 336.0,
      totalCost: 201.6,
    },
    {
      id: "f1bfb1ae-2b02-5b97-7fbf-286740b78461",
      itemCode: "TRM-ZIP-65",
      itemName: "Recycled coil zipper 65cm",
      componentType: "TRIM",
      quantity: 1.0,
      uom: "PCS",
      wastagePercent: 0.0,
      unitCost: 90.0,
      totalCost: 90.0,
      substituteItem: {
        code: "TRM-ZIP-65-ALT",
        name: "Approved alternative 65 cm coil zipper",
        conversionFactor: 1.0,
        priority: 1,
      },
    },
    {
      id: "84e502da-0d43-698f-d778-d05bf1968c0e",
      itemCode: "TRM-REF-01",
      itemName: "Reflective tape 25mm",
      componentType: "TRIM",
      quantity: 0.8,
      uom: "MTR",
      wastagePercent: 3.0,
      unitCost: 25.0,
      totalCost: 20.0,
    },
    {
      id: "667706ad-8e17-8657-6673-09c73414ed9a",
      itemCode: "TRM-LBL-APX",
      itemName: "Apex woven high-definition label",
      componentType: "TRIM",
      quantity: 1.0,
      uom: "PCS",
      wastagePercent: 0.0,
      unitCost: 8.0,
      totalCost: 8.0,
    },
    {
      id: "4bdc04df-6c77-45e7-1299-043b42bdfae6",
      itemCode: "PKG-REC-01",
      itemName: "Recycled garment polybag (biodegradable)",
      componentType: "PACKAGING",
      quantity: 1.0,
      uom: "PCS",
      wastagePercent: 0.0,
      unitCost: 12.0,
      totalCost: 12.0,
    },
  ],
};

export default function BOMDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [activeRevisionNum, setActiveRevisionNum] = useState<number>(2);
  const [bomInfo] = useState({
    id: "54be27f4-de88-561c-e6e8-abaf1d22885a",
    bomNumber: "BOM-APX-001",
    name: "Apex customer-specific jacket",
    productCode: "SP-JKT-APX-01",
    productName: "Apex Custom Performance Training Jacket",
    customer: "Apex Endurance Sports Pvt Ltd",
    orderBatch: 1100,
  });

  const currentRev = activeRevisionNum === 2 ? REVISION_2_DATA : REVISION_1_DATA;

  const totalCostPerUnit = currentRev.lines.reduce((acc, l) => acc + l.totalCost, 0);
  const totalCostBatch = totalCostPerUnit * bomInfo.orderBatch;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="h-6 w-6 text-indigo-500" />
              Bill of Materials: {bomInfo.bomNumber}
            </h1>
            <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 font-mono text-xs">
              Module 9: Engineering & BOM
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Multi-level component structure, technical wastage percentages, substitute items, and bulk release gate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/manufacturing/plans"
            className="inline-flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md font-medium shadow-xs"
          >
            <Cpu className="h-3.5 w-3.5" />
            Explode in MRP Workbench
          </Link>
        </div>
      </div>

      {/* BOM Overview Header Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Product Reference</span>
            <div className="font-bold text-sm text-foreground mt-0.5">{bomInfo.productName}</div>
            <div className="font-mono text-muted-foreground text-[11px]">{bomInfo.productCode}</div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Customer Specification</span>
            <div className="font-semibold text-foreground mt-0.5">{bomInfo.customer}</div>
            <div className="text-[11px] text-muted-foreground">Contract # APX-2026-MTO</div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Active Revision</span>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge className="bg-blue-600 font-mono">Revision {currentRev.revisionNumber}</Badge>
              <StatusBadge status={currentRev.status} />
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">{currentRev.approvedBy}</div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Component Cost / Unit</span>
            <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
              {formatCurrency(totalCostPerUnit)}
            </div>
            <div className="text-[10px] text-muted-foreground">
              Batch (1,100 pcs): {formatCurrency(totalCostBatch)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revision Switcher & Bulk Release Gate Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground">Revision Switcher:</span>
          <div className="inline-flex rounded-lg border p-1 bg-muted/40 text-xs">
            <button
              onClick={() => setActiveRevisionNum(1)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeRevisionNum === 1
                  ? "bg-destructive text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Revision 1 (Rejected)
            </button>
            <button
              onClick={() => setActiveRevisionNum(2)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeRevisionNum === 2
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Revision 2 (Approved & Bulk-Released)
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 flex items-center justify-end">
          {currentRev.isReleasedForBulk ? (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs text-emerald-400">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span><strong>Gate 1 Passed:</strong> Released for Commercial Bulk Production</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 px-3 py-1.5 rounded-lg text-xs text-destructive">
              <XCircle className="h-4 w-4 shrink-0" />
              <span><strong>Bulk Release Locked:</strong> Cannot generate bulk production orders</span>
            </div>
          )}
        </div>
      </div>

      {/* Revision Context Note */}
      <div className="bg-muted/30 border rounded-lg p-3 text-xs flex items-start gap-2.5">
        <FileText className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-foreground">
            Revision {currentRev.revisionNumber} Engineering Notes:
          </span>
          <p className="text-muted-foreground leading-relaxed">
            {currentRev.notes}
          </p>
        </div>
      </div>

      {/* Multi-Level Components Table */}
      <Card className="border-border shadow-xs">
        <CardHeader className="p-4 border-b bg-muted/20 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-foreground">
              BOM Component Breakdown (Per Unit Finished Garment)
            </CardTitle>
            <CardDescription className="text-xs">
              Includes technical consumption, planned shrinkage/wastage %, and calculated gross demand.
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {currentRev.lines.length} Line Items
          </Badge>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 text-[10px] uppercase font-bold text-muted-foreground border-b">
              <tr>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Item Code & Name</th>
                <th className="p-3 text-right">Net Qty / Unit</th>
                <th className="p-3 text-center">UOM</th>
                <th className="p-3 text-right">Wastage %</th>
                <th className="p-3 text-right">Gross Qty (1,100 pcs)</th>
                <th className="p-3 text-right">Unit Rate</th>
                <th className="p-3 text-right">Line Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentRev.lines.map((line) => {
                const grossPerUnit = line.quantity * (1 + line.wastagePercent / 100);
                const grossBatch = grossPerUnit * bomInfo.orderBatch;

                return (
                  <tr key={line.id} className="hover:bg-muted/10">
                    <td className="p-3">
                      <Badge
                        variant="secondary"
                        className={`text-[9px] font-mono ${
                          line.componentType === "FABRIC"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : line.componentType === "TRIM"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {line.componentType}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-foreground font-mono">{line.itemCode}</div>
                      <div className="text-[11px] text-muted-foreground">{line.itemName}</div>
                      {line.substituteItem && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 w-fit">
                          <Shuffle className="h-2.5 w-2.5" />
                          <span>Approved Alt: <strong>{line.substituteItem.code}</strong> (Factor: {line.substituteItem.conversionFactor})</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono font-medium">{line.quantity.toFixed(2)}</td>
                    <td className="p-3 text-center font-mono text-muted-foreground">{line.uom}</td>
                    <td className="p-3 text-right font-mono">
                      {line.wastagePercent > 0 ? (
                        <span className="text-amber-400 font-semibold">+{line.wastagePercent.toFixed(1)}%</span>
                      ) : (
                        <span className="text-muted-foreground">0.0%</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-foreground">
                      {grossBatch.toFixed(2)} {line.uom}
                    </td>
                    <td className="p-3 text-right font-mono text-muted-foreground">
                      {formatCurrency(line.unitCost)}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-foreground">
                      {formatCurrency(line.totalCost)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-muted/40 font-bold border-t text-xs">
              <tr>
                <td colSpan={6} className="p-3 text-right uppercase tracking-wider text-muted-foreground">
                  Total Component Cost Per Garment:
                </td>
                <td colSpan={2} className="p-3 text-right font-mono text-emerald-400 text-sm">
                  {formatCurrency(totalCostPerUnit)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Substitute Materials Callout Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="p-4 border-b bg-muted/20">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Shuffle className="h-4 w-4 text-emerald-500" />
            Approved Material Substitutions (Interchangeability Matrix)
          </CardTitle>
          <CardDescription className="text-xs">
            Configured in <code className="font-mono text-foreground text-[11px]">bom_substitutes</code> for automated MRP allocation during supplier lead time constraints.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/20 p-3 rounded-lg border space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Primary Component</span>
              <div className="font-semibold text-foreground font-mono">TRM-ZIP-65</div>
              <div className="text-muted-foreground">Recycled coil zipper 65cm (Black runner, standard pull)</div>
              <div className="text-[10px] text-emerald-400 font-medium mt-2">Default Bill of Materials BOM-APX-001 Line 2</div>
            </div>

            <div className="bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/20 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Approved Substitute Material</span>
              <div className="font-semibold text-foreground font-mono">TRM-ZIP-65-ALT</div>
              <div className="text-muted-foreground">Approved alternative 65 cm coil zipper (YKK equivalent spec)</div>
              <div className="text-[10px] text-foreground font-medium mt-2 flex items-center gap-2">
                <span>Conversion: 1:1</span>
                <span>•</span>
                <span>Priority: 1 (Primary Alternate)</span>
                <span>•</span>
                <span className="text-emerald-400">Pre-inspected by Tirupur QC</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Connections Lineage */}
      <DocumentConnections
        documentType="BOM_REVISION"
        documentId={currentRev.lines[0]?.id || bomInfo.id}
      />
    </div>
  );
}

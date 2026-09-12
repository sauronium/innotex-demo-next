"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { DocumentConnections } from "@/components/shared/document-connections";
import { formatCurrency, formatQuantity } from "@/lib/utils";
import {
  Cpu,
  Scissors,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Boxes,
  Send,
  ArrowRight,
  ShieldCheck,
  Building,
  Sparkles,
  Barcode,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProductionOrderDetailPage() {
  const params = useParams();
  const orderId = (params?.id as string) || "d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a";

  const [stages, setStages] = useState([
    {
      step: 1,
      name: "Cutting",
      facility: "Tirupur Garment Unit",
      machine: "Gerber Auto-Cutter GT-01",
      planned: 1100,
      input: 1100,
      good: 1096,
      scrap: 4,
      rework: 0,
      status: "CLOSED",
      operator: "Selvam P (Operator)",
      notes: "Fabric issued from Roll R-POLY-001; 4 pcs edge fray scrap logged",
    },
    {
      step: 2,
      name: "Stitching",
      facility: "Tirupur Garment Unit",
      machine: "Juki 4-Needle Overlock Line #3",
      planned: 1096,
      input: 1096,
      good: 1095,
      scrap: 0,
      rework: 1,
      status: "CLOSED",
      operator: "Muthu & Team",
      notes: "1 pc collar seam tension error rerouted to Rework Order RW-2026-004",
    },
    {
      step: 3,
      name: "Printing & Branding",
      facility: "Tirupur Garment Unit",
      machine: "M&R Automatic Screen Print Carousel",
      planned: 1095,
      input: 1095,
      good: 1095,
      scrap: 0,
      rework: 0,
      status: "CLOSED",
      operator: "Ramesh Printing",
      notes: "High-density chest print and reflective arm branding applied cleanly",
    },
    {
      step: 4,
      name: "Washing & Treatment",
      facility: "Tirupur Garment Unit",
      machine: "Tonello Industrial Soft Wash Drum",
      planned: 1095,
      input: 1095,
      good: 1095,
      scrap: 0,
      rework: 0,
      status: "CLOSED",
      operator: "Kumar Wash",
      notes: "Bio-wash & moisture-wicking surfactant finish passed touch audit",
    },
    {
      step: 5,
      name: "Finishing & Thread Trimming",
      facility: "Tirupur Garment Unit",
      machine: "Steam Ironing & Vacuum Tables",
      planned: 1095,
      input: 1095,
      good: 1095,
      scrap: 0,
      rework: 0,
      status: "CLOSED",
      operator: "Finishing Team",
      notes: "Loose thread suction and dimensional measurements passed",
    },
    {
      step: 6,
      name: "Pre-Packing Quality Inspection",
      facility: "Tirupur Garment Unit",
      machine: "Light Box & Measurement Rig",
      planned: 1095,
      input: 1095,
      good: 1095,
      scrap: 0,
      rework: 0,
      status: "CLOSED",
      operator: "Dr. Meenakshi Iyer (Quality)",
      notes: "QC-FG-2026-012 passed; approved for finished goods release",
    },
    {
      step: 7,
      name: "Polybagging & Master Packing",
      facility: "Tirupur Garment Unit",
      machine: "Barcode Labeller & Carton Sealer",
      planned: 1095,
      input: 1095,
      good: 1095,
      scrap: 0,
      rework: 0,
      status: "CLOSED",
      operator: "Packing Team",
      notes: "Packed 44 master cartons (25 pcs/carton). Generated FGR-2026-033",
    },
  ]);

  const prodHeader = {
    prodNumber: "PRD-2026-101",
    salesOrderNumber: "SO-APX-2026-001",
    customer: "Apex Endurance Sports Pvt Ltd",
    product: "Custom Performance Training Jacket (SP-JKT-APX-01)",
    plannedQuantity: 1100,
    completedQuantity: 1095,
    scrappedQuantity: 4,
    reworkQuantity: 1,
    status: "POSTED",
    bomRevision: "BOM-APX-001 (Rev 2)",
    startDate: "2026-02-19",
    completionDate: "2026-02-23",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Cpu className="h-6 w-6 text-blue-600" />
              Production Order: {prodHeader.prodNumber}
            </h1>
            <StatusBadge status={prodHeader.status} />
            <Badge variant="golden" className="text-xs">
              7 Shopfloor Stages
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Order: {prodHeader.salesOrderNumber} • {prodHeader.customer} • {prodHeader.product}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dispatch/plans/dp-apex-01">
            <Button size="sm" className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
              <Send className="h-3.5 w-3.5" />
              Release to Dispatch
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid: Production Overview (4 cols) + 7 Stage Cards (8 cols) */}
      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Left Col: Order Context & Reconciliation Card */}
        <div className="md:col-span-4 space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/40">
              <CardTitle className="text-sm font-bold">Production Order Scope</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground text-[11px]">Sales Order Reference:</span>
                <div className="font-semibold text-foreground">{prodHeader.salesOrderNumber}</div>
                <div className="text-[10px] text-muted-foreground">{prodHeader.customer}</div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">BOM Tree Used:</span>
                <div className="font-mono font-medium text-foreground mt-0.5">{prodHeader.bomRevision}</div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">Production Dates:</span>
                <div className="font-medium text-foreground">{prodHeader.startDate} → {prodHeader.completionDate}</div>
              </div>

              {/* Quantitative Balance Box */}
              <div className="border-t pt-3 p-3 rounded-lg border bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
                <span className="font-bold text-[11px] uppercase text-muted-foreground block">
                  Reconciliation Summary:
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground">Planned</span>
                    <div className="font-bold text-foreground">{prodHeader.plannedQuantity}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-600">Good Output</span>
                    <div className="font-bold text-emerald-600">{prodHeader.completedQuantity}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-600">Scrap / Loss</span>
                    <div className="font-bold text-rose-600">{prodHeader.scrappedQuantity}</div>
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground text-center pt-1 border-t">
                  Output (1,095) + Scrap (4) + Rework (1) = Planned Input (1,100) ✓
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Finished Goods Receipt Card */}
          <Card className="border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20">
            <CardContent className="p-3.5 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Boxes className="h-3.5 w-3.5 text-emerald-600" />
                  Finished Goods Receipt
                </span>
                <Badge variant="success" className="text-[9px]">FGR-2026-033</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                1,095 garments deposited into Coimbatore Central Warehouse. 600 pcs dispatched in Shipment 1; 495 pcs available for Shipment 2.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: 7 Stage Execution Cards */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Scissors className="h-4 w-4 text-blue-600" />
              Stage Execution Cards (Shopfloor Routing)
            </h3>
            <span className="text-xs text-muted-foreground">All 7 operations completed</span>
          </div>

          <div className="space-y-3">
            {stages.map((stage) => (
              <Card key={stage.step} className="border-border shadow-xs">
                <CardContent className="p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                        {stage.step}
                      </span>
                      <span className="font-bold text-sm text-foreground">{stage.name}</span>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {stage.machine}
                      </Badge>
                    </div>
                    <Badge variant="success" className="text-[10px]">
                      {stage.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border">
                      <span className="text-[10px] text-muted-foreground">Stage Input</span>
                      <div className="font-semibold text-foreground">{stage.input} pcs</div>
                    </div>
                    <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                      <span className="text-[10px] text-emerald-800 dark:text-emerald-300">Good Output</span>
                      <div className="font-bold text-emerald-700 dark:text-emerald-300">{stage.good} pcs</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border">
                      <span className="text-[10px] text-muted-foreground">Scrap Logged</span>
                      <div className="font-semibold text-rose-600">{stage.scrap} pcs</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border">
                      <span className="text-[10px] text-muted-foreground">Rework Sent</span>
                      <div className="font-semibold text-purple-600">{stage.rework} pcs</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
                    <span>Operator: <strong className="text-foreground">{stage.operator}</strong></span>
                    <span className="italic max-w-[300px] truncate" title={stage.notes}>{stage.notes}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Shared Document Connections Panel */}
          <DocumentConnections
            documentType="PRODUCTION_ORDER"
            documentId={orderId}
            documentNumber={prodHeader.prodNumber}
          />
        </div>
      </div>
    </div>
  );
}

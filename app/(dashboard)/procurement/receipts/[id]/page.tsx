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
  PackageCheck,
  Truck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Boxes,
  ArrowRight,
  ShieldCheck,
  Building2,
  Barcode,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function GRNReceiptDetailPage() {
  const params = useParams();
  const grnId = (params?.id as string) || "grn-apex-01";

  const [grnStatus, setGrnStatus] = useState("POSTED");

  const grnHeader = {
    grnNumber: "GRN-2026-088",
    gateEntryNumber: "GE-2026-114",
    poNumber: "PO-2026-042",
    supplier: "Coimbatore Polyfabrics Ltd",
    supplierDcNumber: "DC-CPF-8842",
    vehicleNumber: "TN 38 BX 4412",
    transporter: "SpotOn Logistics Pvt Ltd",
    receivedDate: "2026-02-18",
    warehouse: "Coimbatore Central Warehouse",
    status: grnStatus,
  };

  const fabricLots = [
    {
      rollNumber: "R-POLY-001",
      supplierLot: "LOT-TEX-88-A",
      shade: "NAVY-A (Standard)",
      receivedQty: 400,
      disposition: "ACCEPTED",
      qcNotes: "Delta-E 0.4 within tolerance; tensile strength 480N passes spec",
      warehouseBin: "BIN-RAW-F01",
      actionStatus: "In Stock - Reserved for Cutting",
      href: "/inventory/rolls/80000000-0000-0000-0000-000000000001",
    },
    {
      rollNumber: "R-POLY-002",
      supplierLot: "LOT-TEX-88-A",
      shade: "NAVY-A (Standard)",
      receivedQty: 400,
      disposition: "ACCEPTED",
      qcNotes: "Delta-E 0.5; colorfastness to washing 4-5 passed",
      warehouseBin: "BIN-RAW-F02",
      actionStatus: "In Stock - Reserved for Cutting",
      href: "/inventory/rolls/80000000-0000-0000-0000-000000000001",
    },
    {
      rollNumber: "R-POLY-003",
      supplierLot: "LOT-TEX-88-B",
      shade: "NAVY-B (Variance)",
      receivedQty: 200,
      disposition: "HOLD",
      qcNotes: "Delta-E 1.8 exceeds allowable 0.8 tolerance; quarantined on HOLD pending customer shade approval",
      warehouseBin: "BIN-QC-HOLD-01",
      actionStatus: "Quarantined - Unavailable for Reservation",
      href: "/inventory/rolls/80000000-0000-0000-0000-000000000001",
    },
  ];

  const totalReceived = fabricLots.reduce((a, b) => a + b.receivedQty, 0);
  const totalAccepted = fabricLots.filter((l) => l.disposition === "ACCEPTED").reduce((a, b) => a + b.receivedQty, 0);
  const totalHold = fabricLots.filter((l) => l.disposition === "HOLD").reduce((a, b) => a + b.receivedQty, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <PackageCheck className="h-6 w-6 text-blue-600" />
              Goods Receipt Note: {grnHeader.grnNumber}
            </h1>
            <StatusBadge status={grnHeader.status} />
            <Badge variant="golden" className="text-xs">
              Incoming Fabric QC Split
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Material Inward & Lot Verification • Supplier: {grnHeader.supplier} • Gate Entry: {grnHeader.gateEntryNumber}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/inventory/stock">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Boxes className="h-3.5 w-3.5" />
              View Stock Ledger
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid: GRN Header Details (4 cols) + Fabric Roll Inspection Split (8 cols) */}
      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Metadata */}
        <div className="md:col-span-4 space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold">Inward & Transporter Verification</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground text-[11px]">Supplier & DC:</span>
                <div className="font-semibold text-foreground">{grnHeader.supplier}</div>
                <div className="font-mono text-[10px] text-muted-foreground">Supplier Challan: {grnHeader.supplierDcNumber}</div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">PO Reference:</span>
                <div className="font-mono font-medium text-foreground mt-0.5">{grnHeader.poNumber}</div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">Logistics & Vehicle:</span>
                <div className="font-medium text-foreground">{grnHeader.transporter}</div>
                <div className="font-mono text-[10px] text-muted-foreground">Vehicle: {grnHeader.vehicleNumber}</div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">Receiving Warehouse:</span>
                <div className="font-medium text-foreground">{grnHeader.warehouse}</div>
                <div className="text-[10px] text-muted-foreground">Inward Date: {grnHeader.receivedDate}</div>
              </div>

              {/* Disposition Summary Pill Box */}
              <div className="border-t pt-3 space-y-2">
                <span className="font-bold text-[11px] uppercase text-muted-foreground block">
                  QC Disposition Summary:
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded bg-slate-100 dark:bg-slate-900 border">
                    <div className="text-[10px] text-muted-foreground">Received</div>
                    <div className="font-bold text-xs">{totalReceived}m</div>
                  </div>
                  <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                    <div className="text-[10px]">Accepted</div>
                    <div className="font-bold text-xs">{totalAccepted}m</div>
                  </div>
                  <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
                    <div className="text-[10px]">On Hold</div>
                    <div className="font-bold text-xs">{totalHold}m</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Rolls Disposition Split Table */}
        <div className="md:col-span-8 space-y-5">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">
                  Roll-Level QC Inspection Split
                </CardTitle>
                <CardDescription className="text-xs">
                  Recycled Moisture-Wicking Knit Fabric (FAB-RM-POLY-01)
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {fabricLots.length} Rolls Verified
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll # / Supplier Lot</TableHead>
                    <TableHead>Shade</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Disposition</TableHead>
                    <TableHead>Storage Bin</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fabricLots.map((roll, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-xs">
                        <div className="font-mono font-bold text-foreground flex items-center gap-1.5">
                          <Barcode className="h-3.5 w-3.5 text-blue-600" />
                          {roll.rollNumber}
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground">
                          Lot: {roll.supplierLot}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground">
                        {roll.shade}
                      </TableCell>
                      <TableCell className="text-right text-xs font-bold">
                        {roll.receivedQty} meters
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={roll.disposition === "ACCEPTED" ? "success" : "warning"}
                          className="text-[10px]"
                        >
                          {roll.disposition === "ACCEPTED" ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {roll.disposition}
                        </Badge>
                        <div className="text-[10px] text-muted-foreground mt-0.5 max-w-[200px] line-clamp-1" title={roll.qcNotes}>
                          {roll.qcNotes}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {roll.warehouseBin}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={roll.href}>
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600 gap-1">
                            Genealogy <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Shared Document Connections Panel */}
          <DocumentConnections
            documentType="GRN"
            documentId="grn-apex-01"
            documentNumber={grnHeader.grnNumber}
          />
        </div>
      </div>
    </div>
  );
}

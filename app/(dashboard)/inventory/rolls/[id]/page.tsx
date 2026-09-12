"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { DocumentConnections } from "@/components/shared/document-connections";
import {
  Boxes,
  Barcode,
  Truck,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Scissors,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function FabricRollGenealogyPage() {
  const params = useParams();
  const rollId = (params?.id as string) || "80000000-0000-0000-0000-000000000001";

  const roll = {
    id: rollId,
    rollNumber: "R-POLY-001",
    fabricCode: "FAB-RM-POLY-01",
    fabricName: "Recycled Moisture-Wicking Knit Fabric",
    supplier: "Coimbatore Polyfabrics Ltd",
    supplierLot: "LOT-TEX-88-A",
    supplierRollNumber: "CPF-R-9921",
    batch: "B-2026-02",
    shade: "NAVY-A (Standard Production Shade)",
    receivedQuantity: 400,
    remainingQuantity: 400,
    uom: "meters",
    warehouse: "Coimbatore Central Warehouse",
    binLocation: "BIN-RAW-F01",
    status: "AVAILABLE",
    reservationStatus: "Reserved for Production Order PRD-2026-101",
    inwardDate: "2026-02-18",
    grnNumber: "GRN-2026-088",
  };

  const movements = [
    {
      date: "2026-02-18 11:20 AM",
      transaction: "Material Inward GRN",
      reference: "GRN-2026-088",
      delta: "+400.00 meters",
      balance: "400.00 meters",
      actor: "Muthu Vel (Store)",
      notes: "Received and passed incoming fabric QC; placed in BIN-RAW-F01",
    },
    {
      date: "2026-02-19 09:45 AM",
      transaction: "Production Reservation",
      reference: "RES-SO-APX-001",
      delta: "Reserved 400.00 meters",
      balance: "400.00 meters (0 avail / 400 res)",
      actor: "Karthik Sundaram (Production)",
      notes: "Hard allocated for Cutting floor against SO-APX-2026-001",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Barcode className="h-6 w-6 text-blue-600" />
              Fabric Roll Genealogy: {roll.rollNumber}
            </h1>
            <Badge variant="success" className="text-xs gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {roll.status}
            </Badge>
            <Badge variant="golden" className="text-xs">
              Full Textile Traceability
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {roll.fabricName} ({roll.fabricCode}) • Supplier Lot: {roll.supplierLot} • Shade: {roll.shade}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/procurement/receipts/grn-apex-01">
            <Button size="sm" variant="outline" className="text-xs gap-1.5">
              Open Inward GRN ({roll.grnNumber})
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid: Roll Spec & Traceability Attributes (4 cols) + Movement Ledger (8 cols) */}
      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Left Col: Roll Properties Card */}
        <div className="md:col-span-4 space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/40">
              <CardTitle className="text-sm font-bold">Textile Genealogy Metadata</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground text-[11px]">Roll Identifiers:</span>
                <div className="font-mono font-bold text-sm text-foreground mt-0.5">{roll.rollNumber}</div>
                <div className="text-[10px] text-muted-foreground font-mono">Supplier Roll #: {roll.supplierRollNumber}</div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">Supplier Lot & Batch:</span>
                <div className="font-semibold text-foreground">{roll.supplierLot}</div>
                <div className="text-[10px] text-muted-foreground">Production Batch: {roll.batch}</div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">Shade Formulation:</span>
                <div className="font-semibold text-blue-600">{roll.shade}</div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">Vendor / Mill:</span>
                <div className="font-medium text-foreground">{roll.supplier}</div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">Warehouse Storage:</span>
                <div className="font-medium text-foreground">{roll.warehouse}</div>
                <div className="font-mono text-[10px] text-muted-foreground">Rack/Bin: {roll.binLocation}</div>
              </div>

              <div className="border-t pt-3 p-2.5 rounded-md bg-blue-50/40 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                <span className="text-muted-foreground text-[10px] uppercase font-bold block">Current Allocation:</span>
                <span className="text-xs font-semibold text-foreground block mt-0.5">{roll.reservationStatus}</span>
              </div>
            </CardContent>
          </Card>

          {/* Balance Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border bg-card text-center">
              <div className="text-[10px] text-muted-foreground">Received Qty</div>
              <div className="text-lg font-bold text-foreground mt-0.5">{roll.receivedQuantity}m</div>
            </div>
            <div className="p-3 rounded-lg border bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-center">
              <div className="text-[10px] text-emerald-800 dark:text-emerald-300">Remaining Qty</div>
              <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">{roll.remainingQuantity}m</div>
            </div>
          </div>
        </div>

        {/* Right Col: Append-Only Stock Movement Ledger */}
        <div className="md:col-span-8 space-y-5">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Append-Only Stock Ledger Movements</CardTitle>
                <CardDescription className="text-xs">
                  Immutable transaction history deriving remaining roll balance
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {movements.length} Ledger Entries
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Transaction Type</TableHead>
                    <TableHead>Document Ref</TableHead>
                    <TableHead className="text-right">Quantity Delta</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((entry, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-xs text-muted-foreground">
                        {entry.date}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-foreground">
                        {entry.transaction}
                        <span className="block text-[10px] text-muted-foreground font-normal">
                          {entry.notes}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-blue-600">
                        {entry.reference}
                      </TableCell>
                      <TableCell className="text-right font-bold text-xs text-emerald-600">
                        {entry.delta}
                      </TableCell>
                      <TableCell className="text-right font-bold text-xs">
                        {entry.balance}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Shared Document Connections Panel */}
          <DocumentConnections
            documentType="FABRIC_ROLL"
            documentId={rollId}
            documentNumber={roll.rollNumber}
          />
        </div>
      </div>
    </div>
  );
}

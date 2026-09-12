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
  Scissors,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileCheck,
  Receipt,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function JobWorkOrderDetailPage() {
  const params = useParams();
  const jwId = (params?.id as string) || "jw-emb-01";

  const jwOrder = {
    orderNumber: "JWO-2026-009",
    subcontractor: "Tirupur Precision Embroidery Works",
    gstin: "33AABCT9981K1Z2",
    processName: "Specialized Multi-Color Chest & Arm Embroidery",
    itemDescription: "Cut front panels for Performance Training Jackets",
    challanNumber: "JWC-2026-015",
    issuedQuantity: 500,
    receivedQuantity: 498,
    scrapQuantity: 2,
    uom: "panels",
    agreedRate: 65, // ₹65 per panel
    totalServiceValue: 32370, // 498 * 65
    status: "CLOSED",
    issueDate: "2026-02-20",
    receiptDate: "2026-02-22",
    reconciliationStatus: "Reconciled & Value Matched",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Scissors className="h-6 w-6 text-blue-600" />
              Job Work Order: {jwOrder.orderNumber}
            </h1>
            <StatusBadge status={jwOrder.status} />
            <Badge variant="outline" className="text-xs">
              Subcontracting Workbench
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            External Process: {jwOrder.processName} • Subcontractor: {jwOrder.subcontractor}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => toast.success("Subcontractor service invoice verified and matched against accepted panels")}
            variant="outline"
            className="text-xs gap-1.5"
          >
            <Receipt className="h-3.5 w-3.5" />
            Match Subcontractor Bill
          </Button>
        </div>
      </div>

      {/* Grid: Worker Stock Context (4 cols) + Material & Value Reconciliation (8 cols) */}
      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Left Col: Contract & Subcontractor Details */}
        <div className="md:col-span-4 space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/40">
              <CardTitle className="text-sm font-bold">Subcontractor Contract</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground text-[11px]">Subcontractor:</span>
                <div className="font-semibold text-foreground">{jwOrder.subcontractor}</div>
                <div className="font-mono text-[10px] text-muted-foreground">GSTIN: {jwOrder.gstin}</div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">Outward Job-Work Challan:</span>
                <div className="font-mono font-medium text-foreground mt-0.5">{jwOrder.challanNumber}</div>
                <div className="text-[10px] text-muted-foreground">Issued on: {jwOrder.issueDate}</div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">Agreed Service Rate:</span>
                <div className="font-bold text-foreground mt-0.5">{formatCurrency(jwOrder.agreedRate)} / panel</div>
              </div>

              {/* Ownership Banner */}
              <div className="border-t pt-3 p-3 rounded-lg border bg-blue-50/40 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 space-y-1">
                <span className="text-blue-700 dark:text-blue-300 font-bold text-[10px] uppercase block">
                  Legal Ownership Principle:
                </span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Material issued under Challan JWC-2026-015 remains legal property of <strong className="text-foreground">INNOTEX</strong> while physically situated at subcontractor floor.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Reconciliation Tables */}
        <div className="md:col-span-8 space-y-5">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold">Material & Value Reconciliation</CardTitle>
              <CardDescription className="text-xs">
                Verification of panels issued, received good, process scrap, and invoice payable amount
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-900">
                  <span className="text-[10px] text-muted-foreground">Panels Issued</span>
                  <div className="font-bold text-base text-foreground mt-0.5">{jwOrder.issuedQuantity}</div>
                </div>
                <div className="p-3 rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                  <span className="text-[10px]">Good Received</span>
                  <div className="font-bold text-base mt-0.5">{jwOrder.receivedQuantity}</div>
                </div>
                <div className="p-3 rounded-lg border bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300">
                  <span className="text-[10px]">Process Loss / Scrap</span>
                  <div className="font-bold text-base mt-0.5">{jwOrder.scrapQuantity}</div>
                </div>
                <div className="p-3 rounded-lg border bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-300">
                  <span className="text-[10px]">Total Payable (excl GST)</span>
                  <div className="font-bold text-base mt-0.5">{formatCurrency(jwOrder.totalServiceValue)}</div>
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-slate-50/60 dark:bg-slate-900/40 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-muted-foreground">
                    Job-work inspection passed 100% thread tension and logo positioning tests.
                  </span>
                </div>
                <Badge variant="success" className="text-[10px]">
                  {jwOrder.reconciliationStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Shared Document Connections Panel */}
          <DocumentConnections
            documentType="JOB_WORK_ORDER"
            documentId={jwId}
            documentNumber={jwOrder.orderNumber}
          />
        </div>
      </div>
    </div>
  );
}

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
  Send,
  Truck,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  Receipt,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function DispatchPlanDetailPage() {
  const params = useParams();
  const planId = (params?.id as string) || "dp-apex-01";

  const dispatchPlan = {
    planNumber: "DP-2026-041",
    salesOrderNumber: "SO-APX-2026-001",
    customer: "Apex Endurance Sports Pvt Ltd",
    shippingAddress: "Apex Regional Distribution Hub, Whitefield, Bangalore - 560066",
    totalOrderQuantity: 1100,
    totalDispatchedQuantity: 600,
    remainingQuantity: 500,
    status: "PARTIALLY_CLOSED",
  };

  const shipments = [
    {
      shipmentNumber: "SHP-2026-001",
      challanNumber: "DC-APX-01",
      transporter: "SpotOn Logistics Pvt Ltd",
      vehicleNumber: "TN 38 BX 4412",
      lrNumber: "LR-SP-991288",
      quantity: 600,
      cartons: 24, // 24 master cartons * 25 pcs
      dispatchDate: "2026-02-26",
      status: "DELIVERED",
      podAttached: true,
      podReceiver: "K. Ramanathan (Apex Warehouse Supervisor)",
      invoiceNumber: "INV-APX-01",
    },
    {
      shipmentNumber: "SHP-2026-002",
      challanNumber: "DC-APX-02 (Scheduled)",
      transporter: "SpotOn Logistics Pvt Ltd",
      vehicleNumber: "To be assigned",
      lrNumber: "Pending dispatch",
      quantity: 500,
      cartons: 20,
      dispatchDate: "2026-03-02",
      status: "SCHEDULED",
      podAttached: false,
      podReceiver: "-",
      invoiceNumber: "Pending Delivery",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Send className="h-6 w-6 text-blue-600" />
              Dispatch Plan: {dispatchPlan.planNumber}
            </h1>
            <StatusBadge status={dispatchPlan.status} />
            <Badge variant="golden" className="text-xs">
              Partial Fulfilment Demonstrated
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Order: {dispatchPlan.salesOrderNumber} • {dispatchPlan.customer} • Progress: {dispatchPlan.totalDispatchedQuantity} / {dispatchPlan.totalOrderQuantity} pcs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/finance/invoices/inv-apex-01">
            <Button size="sm" className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold">
              <Receipt className="h-3.5 w-3.5" />
              View Commercial Invoice (INV-APX-01)
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid: Dispatch Overview (4 cols) + Partial Shipments & POD (8 cols) */}
      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Metadata */}
        <div className="md:col-span-4 space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/40">
              <CardTitle className="text-sm font-bold">Consignment Allocation</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground text-[11px]">Consignee & Destination:</span>
                <div className="font-semibold text-foreground">{dispatchPlan.customer}</div>
                <div className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                  {dispatchPlan.shippingAddress}
                </div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">Fulfilment Policy:</span>
                <div className="font-medium text-foreground">Split Partial Delivery Permitted</div>
                <div className="text-[10px] text-muted-foreground">Order remains open until remaining 500 pcs dispatched</div>
              </div>

              {/* Progress split */}
              <div className="border-t pt-3 space-y-2">
                <span className="font-bold text-[10px] uppercase text-muted-foreground block">
                  Delivery Progress Breakdown:
                </span>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <span className="text-[10px] text-emerald-800 dark:text-emerald-300">Shipment 1 (Dispatched)</span>
                    <div className="font-bold text-sm text-emerald-700 dark:text-emerald-300">600 pcs</div>
                  </div>
                  <div className="p-2.5 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                    <span className="text-[10px] text-blue-800 dark:text-blue-300">Shipment 2 (Remaining)</span>
                    <div className="font-bold text-sm text-blue-700 dark:text-blue-300">500 pcs</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proof of Delivery Card */}
          <Card className="border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20">
            <CardContent className="p-3.5 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Signed POD Captured
                </span>
                <Badge variant="success" className="text-[9px]">VERIFIED</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Signed consignment receipt uploaded to <code className="font-mono text-primary">erp-documents</code> bucket for Shipment 1. Receiver: K. Ramanathan (Apex Hub).
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Partial Shipments Table */}
        <div className="md:col-span-8 space-y-5">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Consignment & Challan Records</CardTitle>
                <CardDescription className="text-xs">
                  Challans, vehicle identifiers, LR tracking, and Proof of Delivery
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {shipments.length} Consignments
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Challan / Ref</TableHead>
                    <TableHead>Transporter & Vehicle</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>LR Number</TableHead>
                    <TableHead>Proof of Delivery</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((shp, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-xs font-mono font-bold text-foreground">
                        {shp.challanNumber}
                        <span className="block text-[10px] text-muted-foreground font-normal">
                          {shp.shipmentNumber}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="font-medium text-foreground">{shp.transporter}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">{shp.vehicleNumber}</div>
                      </TableCell>
                      <TableCell className="text-right text-xs font-bold">
                        {shp.quantity} pcs
                        <span className="block text-[10px] text-muted-foreground font-normal">
                          {shp.cartons} Cartons
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-blue-600">
                        {shp.lrNumber}
                      </TableCell>
                      <TableCell className="text-xs">
                        {shp.podAttached ? (
                          <div className="flex items-center gap-1 text-emerald-600 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Signed POD</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-[11px] italic">Pending Delivery</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <StatusBadge status={shp.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Shared Document Connections Panel */}
          <DocumentConnections
            documentType="DISPATCH_PLAN"
            documentId={planId}
            documentNumber={dispatchPlan.planNumber}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatQuantity } from "@/lib/utils";
import {
  Truck,
  Plus,
  ArrowRight,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProcurementPage() {
  const purchaseOrders = [
    {
      id: "po-42",
      poNumber: "PO-2026-042",
      supplier: "Coimbatore Polyfabrics Ltd",
      itemsSummary: "Recycled Moisture-Wicking Knit Fabric (1,000m)",
      totalAmount: 320000,
      orderDate: "2026-02-15",
      deliveryDate: "2026-02-18",
      status: "APPROVED",
      maker: "Rajesh Kulkarni (Purchase)",
      checker: "Vikram Rathore (Management)",
      thresholdMet: true,
    },
    {
      id: "po-43",
      poNumber: "PO-2026-043",
      supplier: "Tirupur Fasteners & Trims",
      itemsSummary: "Recycled Coil Zipper 65cm (1,155 pcs)",
      totalAmount: 51975,
      orderDate: "2026-02-16",
      deliveryDate: "2026-02-19",
      status: "APPROVED",
      maker: "Rajesh Kulkarni (Purchase)",
      checker: "Direct Approval (< ₹1,00,000)",
      thresholdMet: false,
    },
  ];

  const requisitions = [
    {
      id: "pr-01",
      prNumber: "PR-2026-001",
      source: "MRP-SO-APX-2026-001",
      itemCode: "TRM-ZIP-65",
      itemName: "Recycled Coil Zipper 65cm",
      requiredQty: 1155,
      uom: "pcs",
      requiredDate: "2026-02-18",
      status: "CONVERTED_TO_PO",
      poNumber: "PO-2026-043",
    },
    {
      id: "pr-02",
      prNumber: "PR-2026-002",
      source: "Manual Safety Stock Reorder",
      itemCode: "PKG-REC-01",
      itemName: "Recycled Garment Polybag",
      requiredQty: 2500,
      uom: "pcs",
      requiredDate: "2026-02-25",
      status: "PENDING_RFQ",
      poNumber: null,
    },
  ];

  const rfqComparisons = [
    {
      rfqNumber: "RFQ-2026-018",
      item: "Recycled Coil Zipper 65cm (1,155 pcs)",
      vendorA: { name: "Tirupur Fasteners & Trims", rate: "₹45.00", leadTime: "3 Days", paymentTerms: "30 Days", selected: true },
      vendorB: { name: "Coimbatore Trims Corp", rate: "₹48.50", leadTime: "5 Days", paymentTerms: "Advance", selected: false },
      decision: "Selected Tirupur Fasteners based on lower rate & faster lead time",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Truck className="h-6 w-6 text-blue-600" />
              Procurement & Sourcing Workbench
            </h1>
            <Badge variant="outline" className="text-xs">
              Module 6
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            MRP shortage-driven requisitions, multi-vendor quote comparison, and maker-checker threshold POs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => toast.info("Create Purchase Requisition modal")}
            className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            Raise Requisition
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pos" className="text-xs gap-1.5">
            Purchase Orders ({purchaseOrders.length})
          </TabsTrigger>
          <TabsTrigger value="prs" className="text-xs gap-1.5">
            Requisitions ({requisitions.length})
          </TabsTrigger>
          <TabsTrigger value="rfqs" className="text-xs gap-1.5">
            RFQ Comparison Matrix ({rfqComparisons.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Purchase Orders */}
        <TabsContent value="pos" className="space-y-3">
          <Card className="border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Line Summary</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Maker-Checker Governance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-mono text-xs font-bold text-foreground">
                      {po.poNumber}
                    </TableCell>
                    <TableCell className="font-medium text-xs text-foreground">
                      {po.supplier}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {po.itemsSummary}
                    </TableCell>
                    <TableCell className="text-right font-bold text-xs">
                      {formatCurrency(po.totalAmount)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {po.deliveryDate}
                    </TableCell>
                    <TableCell className="text-[11px]">
                      <div className="flex items-center gap-1 text-foreground font-medium">
                        <ShieldCheck className="h-3 w-3 text-emerald-600" />
                        <span>{po.checker}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">Maker: {po.maker}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={po.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href="/procurement/receipts/grn-apex-01">
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600 gap-1">
                          Inward GRN <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Tab 2: Requisitions */}
        <TabsContent value="prs" className="space-y-3">
          <Card className="border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PR Number</TableHead>
                  <TableHead>Source MRP Plan</TableHead>
                  <TableHead>Item Code & Name</TableHead>
                  <TableHead className="text-right">Required Quantity</TableHead>
                  <TableHead>Required By</TableHead>
                  <TableHead>Status / Linked PO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requisitions.map((pr) => (
                  <TableRow key={pr.id}>
                    <TableCell className="font-mono text-xs font-bold">{pr.prNumber}</TableCell>
                    <TableCell className="text-xs font-mono text-blue-600">{pr.source}</TableCell>
                    <TableCell className="text-xs">
                      <span className="font-mono font-semibold text-foreground">{pr.itemCode}</span>
                      <span className="block text-[11px] text-muted-foreground">{pr.itemName}</span>
                    </TableCell>
                    <TableCell className="text-right text-xs font-bold">
                      {pr.requiredQty} {pr.uom}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{pr.requiredDate}</TableCell>
                    <TableCell>
                      {pr.poNumber ? (
                        <Badge variant="success" className="text-[10px] font-mono">
                          PO: {pr.poNumber}
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="text-[10px]">
                          Pending RFQ Float
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Tab 3: RFQs */}
        <TabsContent value="rfqs" className="space-y-3">
          {rfqComparisons.map((rfq, idx) => (
            <Card key={idx} className="border-border">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">
                    {rfq.rfqNumber} • {rfq.item}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    Comparison Completed
                  </Badge>
                </div>
                <CardDescription className="text-xs">{rfq.decision}</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Vendor A */}
                  <div className="p-3.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground">{rfq.vendorA.name}</span>
                      <Badge variant="success" className="text-[9px]">SELECTED VENDOR</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-muted-foreground text-[10px]">Rate / pc:</span>
                        <div className="font-bold text-foreground">{rfq.vendorA.rate}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[10px]">Lead Time:</span>
                        <div className="font-semibold text-foreground">{rfq.vendorA.leadTime}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[10px]">Terms:</span>
                        <div className="font-semibold text-foreground">{rfq.vendorA.paymentTerms}</div>
                      </div>
                    </div>
                  </div>

                  {/* Vendor B */}
                  <div className="p-3.5 rounded-lg border bg-slate-50/50 dark:bg-slate-900/30 space-y-2 opacity-80">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-foreground">{rfq.vendorB.name}</span>
                      <Badge variant="outline" className="text-[9px]">HIGHER RATE</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-muted-foreground text-[10px]">Rate / pc:</span>
                        <div className="font-medium text-foreground">{rfq.vendorB.rate}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[10px]">Lead Time:</span>
                        <div className="font-medium text-foreground">{rfq.vendorB.leadTime}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[10px]">Terms:</span>
                        <div className="font-medium text-foreground">{rfq.vendorB.paymentTerms}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

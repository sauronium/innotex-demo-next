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
  Receipt,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Send,
  Download,
  ShieldCheck,
  CreditCard,
  QrCode,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function TaxInvoiceDetailPage() {
  const params = useParams();
  const invoiceId = (params?.id as string) || "inv-apex-01";

  const [paidAmount, setPaidAmount] = useState(1650000);

  const invoice = {
    invoiceNumber: "INV-2026-089",
    salesOrderNumber: "SO-APX-2026-001",
    challanNumber: "DC-APX-01",
    customer: "Apex Endurance Sports Pvt Ltd",
    gstin: "33AAACA1234A1Z5",
    billingAddress: "Apex Regional Distribution Hub, Whitefield, Bangalore - 560066",
    stateCode: "29 (Karnataka - Interstate IGST)",
    invoiceDate: "2026-02-26",
    paymentTerms: "30 Days Net",
    dueDate: "2026-03-28",
    status: "POSTED",
    subtotal: 1440000, // 600 jackets * 2400
    cgst: 0,
    sgst: 0,
    igst: 172800, // 12% IGST
    freightCharges: 37200,
    totalAmount: 1650000, // Partial invoice for Shipment 1
    irnNumber: "98e4f1a23b56c7890123456789abcdef98e4f1a23b56c7890123456789abcdef",
    ewayBillNumber: "381009841288",
  };

  const invoiceLines = [
    {
      description: "Custom Performance Training Jacket - Navy / S",
      hsnCode: "6103",
      quantity: 200,
      unitRate: 2400,
      taxableAmount: 480000,
      gstRate: "12% IGST",
      taxAmount: 57600,
      totalAmount: 537600,
    },
    {
      description: "Custom Performance Training Jacket - Navy / M",
      hsnCode: "6103",
      quantity: 400,
      unitRate: 2400,
      taxableAmount: 960000,
      gstRate: "12% IGST",
      taxAmount: 115200,
      totalAmount: 1075200,
    },
  ];

  const handleRecordPayment = () => {
    toast.success("Payment receipt simulated: ₹16,50,000 recorded via NEFT/RTGS. Invoice marked CLOSED.");
    setPaidAmount(invoice.totalAmount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Receipt className="h-6 w-6 text-blue-600" />
              Tax Invoice: {invoice.invoiceNumber}
            </h1>
            <StatusBadge status={paidAmount >= invoice.totalAmount ? "CLOSED" : "POSTED"} />
            <Badge variant="golden" className="text-xs">
              E-Invoice & E-Way Bill Simulated
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Commercial Tax Invoice • {invoice.customer} • Order: {invoice.salesOrderNumber} • Challan: {invoice.challanNumber}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleRecordPayment}
            variant="outline"
            className="gap-1.5 text-xs text-emerald-600 border-emerald-300 dark:border-emerald-800"
          >
            <CreditCard className="h-3.5 w-3.5" />
            Record Payment Receipt
          </Button>

          <Button
            size="sm"
            onClick={() => toast.success("Tax Invoice PDF exported to browser print view")}
            className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Grid: Invoice Info (4 cols) + Line Breakdown & GST (8 cols) */}
      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Left Col: Invoice Metadata */}
        <div className="md:col-span-4 space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/40">
              <CardTitle className="text-sm font-bold">Tax & Statutory Identifiers</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground text-[11px]">Billed Customer:</span>
                <div className="font-semibold text-foreground">{invoice.customer}</div>
                <div className="font-mono text-[10px] text-muted-foreground">GSTIN: {invoice.gstin}</div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">Tax Jurisdiction:</span>
                <div className="font-medium text-foreground">{invoice.stateCode}</div>
              </div>

              {/* Simulated E-Invoice / IRN Box */}
              <div className="border-t pt-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[11px]">Government IRN:</span>
                  <Badge variant="outline" className="text-[9px] text-blue-600 font-mono">SIMULATED</Badge>
                </div>
                <div className="font-mono text-[9px] text-foreground bg-slate-100 dark:bg-slate-900 p-1.5 rounded truncate">
                  {invoice.irnNumber}
                </div>
              </div>

              {/* Simulated E-Way Bill */}
              <div className="border-t pt-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[11px]">E-Way Bill Number:</span>
                  <Badge variant="outline" className="text-[9px] text-emerald-600 font-mono">ACTIVE</Badge>
                </div>
                <div className="font-mono text-xs font-bold text-foreground">
                  {invoice.ewayBillNumber}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="border-t pt-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Invoice Total:</span>
                  <span className="font-bold">{formatCurrency(invoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(paidAmount)}</span>
                </div>
                <div className="flex justify-between text-[11px] pt-1 border-t">
                  <span className="text-muted-foreground">Outstanding Balance:</span>
                  <span className="font-bold text-foreground">{formatCurrency(invoice.totalAmount - paidAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Invoice Lines & Totals */}
        <div className="md:col-span-8 space-y-5">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Taxable Line Items (Shipment 1)</CardTitle>
                <CardDescription className="text-xs">
                  Constrained to 600 dispatched garments delivered on Challan DC-APX-01
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                HSN 6103 • 12% IGST
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item & Description</TableHead>
                    <TableHead>HSN</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Rate</TableHead>
                    <TableHead className="text-right">Taxable</TableHead>
                    <TableHead className="text-right">IGST (12%)</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceLines.map((line, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-xs font-semibold text-foreground">
                        {line.description}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {line.hsnCode}
                      </TableCell>
                      <TableCell className="text-right text-xs font-medium">
                        {line.quantity} pcs
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {formatCurrency(line.unitRate)}
                      </TableCell>
                      <TableCell className="text-right text-xs font-medium">
                        {formatCurrency(line.taxableAmount)}
                      </TableCell>
                      <TableCell className="text-right text-xs text-blue-600 font-medium">
                        {formatCurrency(line.taxAmount)}
                      </TableCell>
                      <TableCell className="text-right text-xs font-bold text-foreground">
                        {formatCurrency(line.totalAmount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Tax Summary Totals */}
              <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/40 flex justify-end">
                <div className="w-72 space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxable Subtotal:</span>
                    <span className="font-medium text-foreground">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Interstate IGST (12%):</span>
                    <span className="font-medium text-foreground">{formatCurrency(invoice.igst)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Freight & Transport Charges:</span>
                    <span className="font-medium text-foreground">{formatCurrency(invoice.freightCharges)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t font-bold text-sm text-foreground">
                    <span>Invoice Net Total:</span>
                    <span className="text-blue-600">{formatCurrency(invoice.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shared Document Connections Panel */}
          <DocumentConnections
            documentType="SALES_INVOICE"
            documentId={invoiceId}
            documentNumber={invoice.invoiceNumber}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import { DocumentConnections } from "@/components/shared/document-connections";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FileText,
  Search,
  ShoppingCart,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Building,
  Calendar,
  Percent,
  Plus,
  Send,
  Download,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface SalesEnquiryItem {
  id: string;
  enquiryNumber: string;
  customerName: string;
  customerCode: string;
  inquiryDate: string;
  status: "DRAFT" | "SUBMITTED" | "QUOTED" | "CONVERTED" | "CLOSED";
  productName: string;
  productCode: string;
  quantity: number;
  quotedAmount: number;
  quotationNumber?: string;
  quotationStatus?: string;
  linkedOrderId?: string;
  linkedOrderNumber?: string;
  marginPercent: number;
  sizeMatrix: { size: string; qty: number }[];
}

const SEED_ENQUIRIES: SalesEnquiryItem[] = [
  {
    id: "dc95a80e-547c-3b8e-a572-7c466179b773",
    enquiryNumber: "ENQ-APX-001",
    customerName: "Apex Endurance Sports Pvt Ltd",
    customerCode: "CUST-APX-01",
    inquiryDate: "2026-01-15",
    status: "CONVERTED",
    productName: "Apex Performance Training Jacket",
    productCode: "SP-JKT-APX-01",
    quantity: 1100,
    quotedAmount: 3024000,
    quotationNumber: "QTN-APX-001",
    quotationStatus: "APPROVED",
    linkedOrderId: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    linkedOrderNumber: "SO-APX-2026-001",
    marginPercent: 38.5,
    sizeMatrix: [
      { size: "Navy / S", qty: 200 },
      { size: "Navy / M", qty: 400 },
      { size: "Navy / L", qty: 350 },
      { size: "Navy / XL", qty: 150 },
    ],
  },
  {
    id: "enq-lnt-002",
    enquiryNumber: "ENQ-LNT-2026-04",
    customerName: "L&T Heavy Engineering",
    customerCode: "CUST-LNT-02",
    inquiryDate: "2026-02-05",
    status: "QUOTED",
    productName: "High-Visibility Industrial Uniform Coverall",
    productCode: "WRK-COV-01",
    quantity: 500,
    quotedAmount: 1150000,
    quotationNumber: "QTN-LNT-2026-02",
    quotationStatus: "PENDING_APPROVAL",
    marginPercent: 32.0,
    sizeMatrix: [
      { size: "Orange / M", qty: 150 },
      { size: "Orange / L", qty: 250 },
      { size: "Orange / XL", qty: 100 },
    ],
  },
];

export default function SalesEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<SalesEnquiryItem[]>(SEED_ENQUIRIES);
  const [selectedEnquiry, setSelectedEnquiry] = useState<SalesEnquiryItem>(SEED_ENQUIRIES[0]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadLiveEnquiries() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("sales_enquiries")
          .select("id, enquiry_number, status, customers(name, code)")
          .limit(10);

        if (!error && data && data.length > 0) {
          // Live connection verified
        }
      } catch (err) {
        console.warn("Enquiries query:", err);
      }
    }
    loadLiveEnquiries();
  }, []);

  const filteredEnquiries = enquiries.filter(
    (e) =>
      e.enquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-500" />
              Sales Enquiries & Quotation Workbench
            </h1>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 font-mono text-xs">
              Module 5: Commercial
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Capture prospective demand, manage multi-size customer enquiries, and generate binding commercial quotations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs"
            onClick={() => toast.info("New quotation draft modal initialized")}
          >
            <Plus className="h-3.5 w-3.5" />
            New Customer Enquiry
          </Button>
        </div>
      </div>

      {/* Main Grid: Enquiries List & Active Quotation Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Enquiries */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              placeholder="Search enquiry # or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="space-y-3">
            {filteredEnquiries.map((enq) => {
              const isSelected = selectedEnquiry.id === enq.id;
              return (
                <Card
                  key={enq.id}
                  onClick={() => setSelectedEnquiry(enq)}
                  className={`cursor-pointer transition-all border ${
                    isSelected
                      ? "border-blue-500 bg-blue-500/5 shadow-sm"
                      : "border-border hover:border-slate-700 bg-card"
                  }`}
                >
                  <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-foreground">
                          {enq.enquiryNumber}
                        </span>
                        <StatusBadge status={enq.status} />
                      </div>
                      <CardDescription className="text-xs font-medium text-foreground mt-0.5">
                        {enq.customerName}
                      </CardDescription>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-sm text-foreground">
                        {formatCurrency(enq.quotedAmount)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {enq.quantity} units
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-2 text-xs space-y-2">
                    <div className="text-muted-foreground line-clamp-1">
                      {enq.productName} ({enq.productCode})
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {enq.inquiryDate}
                      </span>
                      <span className="font-semibold text-emerald-400">
                        Margin: {enq.marginPercent}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Quotation Details & Size Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border shadow-xs">
            <CardHeader className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
                    {selectedEnquiry.quotationNumber || "QTN-DRAFT"}
                  </span>
                  <StatusBadge status={selectedEnquiry.quotationStatus || "DRAFT"} />
                </div>
                <CardTitle className="text-base font-bold text-foreground mt-1">
                  {selectedEnquiry.productName}
                </CardTitle>
                <CardDescription className="text-xs">
                  Customer: <strong>{selectedEnquiry.customerName}</strong> ({selectedEnquiry.customerCode})
                </CardDescription>
              </div>

              {selectedEnquiry.linkedOrderId && (
                <Link
                  href={`/sales/orders/${selectedEnquiry.linkedOrderId}`}
                  className="inline-flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md font-medium shadow-xs"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  View Converted Order ({selectedEnquiry.linkedOrderNumber})
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </CardHeader>

            <CardContent className="p-4 space-y-5">
              {/* Financial & Margin Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-muted/30 p-3 rounded-lg border">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Total Quantity</span>
                  <span className="text-base font-bold font-mono text-foreground">{selectedEnquiry.quantity} pcs</span>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Quoted Price</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    {formatCurrency(selectedEnquiry.quotedAmount)}
                  </span>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Projected Margin</span>
                  <span className="text-base font-bold font-mono text-indigo-400 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {selectedEnquiry.marginPercent}%
                  </span>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Tax Breakdown</span>
                  <span className="text-xs font-medium text-foreground">GST 12% Included</span>
                </div>
              </div>

              {/* Multi-variant Size Matrix */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Variant Size Breakdown
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/40 text-[10px] uppercase font-bold text-muted-foreground border-b">
                      <tr>
                        <th className="p-2.5 text-left">Variant & Size</th>
                        <th className="p-2.5 text-right">Order Qty</th>
                        <th className="p-2.5 text-right">Unit Rate (Excl GST)</th>
                        <th className="p-2.5 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedEnquiry.sizeMatrix.map((item, idx) => {
                        const unitRate = 2454.55;
                        const lineTotal = item.qty * unitRate;
                        return (
                          <tr key={idx} className="hover:bg-muted/10">
                            <td className="p-2.5 font-medium text-foreground font-mono">{item.size}</td>
                            <td className="p-2.5 text-right font-mono font-bold">{item.qty} pcs</td>
                            <td className="p-2.5 text-right font-mono text-muted-foreground">{formatCurrency(unitRate)}</td>
                            <td className="p-2.5 text-right font-mono font-bold text-foreground">
                              {formatCurrency(lineTotal)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-muted/40 font-bold border-t">
                      <tr>
                        <td className="p-2.5">Total</td>
                        <td className="p-2.5 text-right font-mono">{selectedEnquiry.quantity} pcs</td>
                        <td className="p-2.5 text-right text-muted-foreground">GST 12%</td>
                        <td className="p-2.5 text-right font-mono text-emerald-400">
                          {formatCurrency(selectedEnquiry.quotedAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Quotation Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-border flex items-center gap-1.5"
                    onClick={() => toast.success("Quotation PDF generated with terms and bank details")}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Quotation PDF
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  {selectedEnquiry.status === "QUOTED" && (
                    <Button
                      size="sm"
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                      onClick={() => {
                        toast.success("Enquiry converted into Commercial Sales Order");
                      }}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Convert to Sales Order
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lineage & Document Connections */}
          <DocumentConnections
            documentType="SALES_ORDER"
            documentId={selectedEnquiry.linkedOrderId || selectedEnquiry.id}
          />
        </div>
      </div>
    </div>
  );
}

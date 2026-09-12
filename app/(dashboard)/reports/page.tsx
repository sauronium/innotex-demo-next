"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatQuantity } from "@/lib/utils";
import {
  BarChart3,
  Download,
  Search,
  ShoppingCart,
  Truck,
  Boxes,
  Cpu,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export default function ReportsCataloguePage() {
  const salesRegister = [
    { invoice: "INV-2026-089", date: "2026-02-26", customer: "Apex Endurance Sports Pvt Ltd", orderNo: "SO-APX-2026-001", taxable: 1440000, igst: 172800, total: 1650000, status: "PAID" },
    { invoice: "INV-2026-074", date: "2026-02-12", customer: "L&T Heavy Engineering", orderNo: "SO-LT-2026-008", taxable: 850000, igst: 102000, total: 952000, status: "PAID" },
    { invoice: "INV-2026-061", date: "2026-01-29", customer: "Decathlon India Sourcing", orderNo: "SO-DEC-2026-003", taxable: 1820000, igst: 218400, total: 2038400, status: "PAID" },
  ];

  const stockAgeing = [
    { itemCode: "FAB-RM-POLY-01", name: "Recycled Moisture Knit", warehouse: "Central Warehouse", qty: "1,000 m", days0_30: "800 m", days31_60: "200 m (Hold)", days61_90: "0 m", status: "Healthy" },
    { itemCode: "TRM-ZIP-65", name: "Recycled Coil Zipper", warehouse: "Tirupur Garment Unit", qty: "1,155 pcs", days0_30: "1,155 pcs", days31_60: "0", days61_90: "0", status: "Fresh" },
    { itemCode: "PKG-REC-01", name: "Recycled Polybag", warehouse: "Central Warehouse", qty: "3,000 pcs", days0_30: "2,000 pcs", days31_60: "1,000 pcs", days61_90: "0", status: "Healthy" },
  ];

  const exportCSV = (reportName: string) => {
    toast.success(`${reportName} exported to CSV`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              Management Reports & Registers
            </h1>
            <Badge variant="outline" className="text-xs">
              Module 15 • Exportable
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Tabular operational registers and statutory tax summaries with instant CSV download.
          </p>
        </div>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="sales" className="text-xs gap-1.5">
            <ShoppingCart className="h-3.5 w-3.5" /> Sales Register
          </TabsTrigger>
          <TabsTrigger value="ageing" className="text-xs gap-1.5">
            <Boxes className="h-3.5 w-3.5" /> Stock Ageing
          </TabsTrigger>
        </TabsList>

        {/* Sales Register Tab */}
        <TabsContent value="sales" className="space-y-3">
          <Card className="border-border">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold">Commercial Sales Register</CardTitle>
                <CardDescription className="text-xs">
                  Itemized invoice values, GST tax allocations, and payment states
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => exportCSV("Sales_Register")} className="text-xs gap-1.5 h-8">
                <Download className="h-3.5 w-3.5" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Order #</TableHead>
                    <TableHead className="text-right">Taxable Value</TableHead>
                    <TableHead className="text-right">IGST</TableHead>
                    <TableHead className="text-right">Invoice Total</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesRegister.map((s, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs font-bold text-blue-600">{s.invoice}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{s.date}</TableCell>
                      <TableCell className="text-xs font-semibold text-foreground">{s.customer}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{s.orderNo}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatCurrency(s.taxable)}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-blue-600">{formatCurrency(s.igst)}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-xs">{formatCurrency(s.total)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="success" className="text-[10px]">{s.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Ageing Tab */}
        <TabsContent value="ageing" className="space-y-3">
          <Card className="border-border">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold">Inventory Ageing Breakdown</CardTitle>
                <CardDescription className="text-xs">
                  Tracking shelf-life and holding periods across warehouse facilities
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => exportCSV("Stock_Ageing")} className="text-xs gap-1.5 h-8">
                <Download className="h-3.5 w-3.5" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead className="text-right">Total Balance</TableHead>
                    <TableHead className="text-right">0 - 30 Days</TableHead>
                    <TableHead className="text-right">31 - 60 Days</TableHead>
                    <TableHead className="text-right">Health</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockAgeing.map((a, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs font-bold text-foreground">{a.itemCode}</TableCell>
                      <TableCell className="text-xs font-semibold text-foreground">{a.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.warehouse}</TableCell>
                      <TableCell className="text-right font-bold text-xs">{a.qty}</TableCell>
                      <TableCell className="text-right font-medium text-xs text-emerald-600">{a.days0_30}</TableCell>
                      <TableCell className="text-right font-medium text-xs text-amber-600">{a.days31_60}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-[10px]">{a.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

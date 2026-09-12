"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Boxes,
  Search,
  ArrowRight,
  Filter,
  Barcode,
  Layers,
  Building2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function InventoryStockPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const stockItems = [
    {
      itemCode: "FAB-RM-POLY-01",
      itemName: "Recycled Moisture-Wicking Knit Fabric",
      category: "RAW_MATERIAL",
      totalQty: 1000,
      availableQty: 400,
      reservedQty: 400,
      holdQty: 200,
      uom: "meters",
      warehouse: "Coimbatore Central Warehouse",
      hasRolls: true,
      rollLink: "/inventory/rolls/80000000-0000-0000-0000-000000000001",
    },
    {
      itemCode: "TRM-ZIP-65",
      itemName: "Recycled Coil Zipper 65cm",
      category: "TRIM",
      totalQty: 1155,
      availableQty: 0,
      reservedQty: 1155,
      holdQty: 0,
      uom: "pcs",
      warehouse: "Tirupur Garment Unit",
      hasRolls: false,
    },
    {
      itemCode: "TRM-REF-01",
      itemName: "Reflective Performance Tape 25mm",
      category: "TRIM",
      totalQty: 1200,
      availableQty: 650,
      reservedQty: 550,
      holdQty: 0,
      uom: "meters",
      warehouse: "Tirupur Garment Unit",
      hasRolls: false,
    },
    {
      itemCode: "TRM-LBL-APX",
      itemName: "Apex Custom Woven Brand Label",
      category: "TRIM",
      totalQty: 2500,
      availableQty: 1400,
      reservedQty: 1100,
      holdQty: 0,
      uom: "pcs",
      warehouse: "Tirupur Garment Unit",
      hasRolls: false,
    },
    {
      itemCode: "PKG-REC-01",
      itemName: "Recycled Garment Polybag",
      category: "PACKAGING",
      totalQty: 3000,
      availableQty: 1900,
      reservedQty: 1100,
      holdQty: 0,
      uom: "pcs",
      warehouse: "Coimbatore Central Warehouse",
      hasRolls: false,
    },
    {
      itemCode: "SP-JKT-APX-01",
      itemName: "Custom Performance Training Jacket (Finished Goods)",
      category: "FINISHED_GOOD",
      totalQty: 1095,
      availableQty: 495,
      reservedQty: 0,
      holdQty: 0,
      uom: "pcs",
      warehouse: "Coimbatore Central Warehouse",
      hasRolls: false,
      dispatchedQty: 600,
    },
  ];

  const filteredStock = stockItems.filter(
    (s) =>
      s.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.itemCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Boxes className="h-6 w-6 text-blue-600" />
              Inventory & Warehouse Ledgers
            </h1>
            <Badge variant="outline" className="text-xs">
              Module 8 • Multi-Status Stock
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time multi-warehouse balances split by Available, Reserved, Quarantined Hold, and Dispatched quantities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/inventory/rolls/80000000-0000-0000-0000-000000000001">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Barcode className="h-3.5 w-3.5" />
              Roll Genealogy (R-POLY-001)
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg border bg-card text-center">
          <span className="text-[11px] text-muted-foreground font-medium">Total Tracked Items</span>
          <div className="text-xl font-bold text-foreground mt-0.5">{stockItems.length} SKUs</div>
        </div>
        <div className="p-3.5 rounded-lg border bg-card text-center">
          <span className="text-[11px] text-muted-foreground font-medium">Active Warehouses</span>
          <div className="text-xl font-bold text-foreground mt-0.5">2 Facilities</div>
        </div>
        <div className="p-3.5 rounded-lg border bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 text-center">
          <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">Quarantined on Hold</span>
          <div className="text-xl font-bold text-amber-700 dark:text-amber-300 mt-0.5">200 meters</div>
        </div>
        <div className="p-3.5 rounded-lg border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-center">
          <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">FG Inventory Ready</span>
          <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">495 pcs</div>
        </div>
      </div>

      {/* Search & Stock Table */}
      <Card className="border-border shadow-xs">
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search stock by item code or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs h-8"
            />
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            Append-Only Stock Ledger Guard
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code & Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Reserved</TableHead>
                <TableHead className="text-right">On Hold</TableHead>
                <TableHead className="text-right">Total Balance</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStock.map((stock, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-xs">
                    <div className="font-mono font-bold text-foreground">{stock.itemCode}</div>
                    <div className="text-muted-foreground text-[11px]">{stock.itemName}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {stock.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {stock.warehouse}
                  </TableCell>
                  <TableCell className="text-right text-xs font-bold text-emerald-600">
                    {stock.availableQty} {stock.uom}
                  </TableCell>
                  <TableCell className="text-right text-xs font-medium text-blue-600">
                    {stock.reservedQty} {stock.uom}
                  </TableCell>
                  <TableCell className="text-right text-xs font-medium">
                    {stock.holdQty > 0 ? (
                      <span className="text-amber-600 font-bold">{stock.holdQty} {stock.uom}</span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-xs font-bold text-foreground">
                    {stock.totalQty} {stock.uom}
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.hasRolls ? (
                      <Link href={stock.rollLink!}>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600 gap-1">
                          Rolls <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

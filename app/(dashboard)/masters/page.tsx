"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Database,
  Plus,
  Search,
  Building2,
  Users,
  Truck,
  Layers,
  Sparkles,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export default function MasterDataPage() {
  const [items, setItems] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadMasters() {
      setLoading(true);
      try {
        const supabase = createClient();
        const [itemsRes, custRes, suppRes, locRes] = await Promise.all([
          supabase.from("items").select("*").limit(20),
          supabase.from("customers").select("*").limit(20),
          supabase.from("suppliers").select("*").limit(20),
          supabase.from("locations").select("*").limit(20),
        ]);

        if (itemsRes.data && itemsRes.data.length > 0) {
          setItems(itemsRes.data);
        } else {
          // Fallback seeded items
          setItems([
            { id: "1", code: "SP-JKT-APX-01", name: "Custom Performance Training Jacket", item_type: "FINISHED_GOOD", category: "Sportswear", uom: "pcs", standard_cost: 1850 },
            { id: "2", code: "FAB-RM-POLY-01", name: "Recycled Moisture-Wicking Knit Fabric", item_type: "FABRIC", category: "Raw Materials", uom: "meters", standard_cost: 320 },
            { id: "3", code: "TRM-ZIP-65", name: "Recycled Coil Zipper 65cm", item_type: "TRIM", category: "Trims", uom: "pcs", standard_cost: 45 },
            { id: "4", code: "TRM-REF-01", name: "Reflective Performance Tape 25mm", item_type: "TRIM", category: "Trims", uom: "meters", standard_cost: 18 },
            { id: "5", code: "PKG-REC-01", name: "Recycled Garment Polybag", item_type: "PACKAGING", category: "Packaging", uom: "pcs", standard_cost: 6 },
          ]);
        }

        if (custRes.data && custRes.data.length > 0) {
          setCustomers(custRes.data);
        } else {
          setCustomers([
            { id: "c1", code: "CUST-APX-01", name: "Apex Endurance Sports Pvt Ltd", gstin: "33AAACA1234A1Z5", state: "Tamil Nadu", payment_terms_days: 30, credit_limit: 5000000 },
          ]);
        }

        if (suppRes.data && suppRes.data.length > 0) {
          setSuppliers(suppRes.data);
        } else {
          setSuppliers([
            { id: "s1", code: "SUPP-COIM-01", name: "Coimbatore Polyfabrics Ltd", gstin: "33AABCP9876Q1ZM", state: "Tamil Nadu", payment_terms_days: 45 },
            { id: "s2", code: "SUPP-TRP-02", name: "Tirupur Fasteners & Trims", gstin: "33AABCT5544R1ZY", state: "Tamil Nadu", payment_terms_days: 30 },
          ]);
        }

        if (locRes.data && locRes.data.length > 0) {
          setLocations(locRes.data);
        } else {
          setLocations([
            { id: "l1", code: "LOC-CBE-HO", name: "Coimbatore Head Office", location_type: "HEAD_OFFICE" },
            { id: "l2", code: "LOC-TRP-ATL", name: "Tirupur Atelier", location_type: "ATELIER" },
            { id: "l3", code: "LOC-TRP-GRM", name: "Tirupur Garment Unit", location_type: "FACTORY" },
            { id: "l4", code: "LOC-KNT-CMP", name: "Kinathukidavu Composites Centre", location_type: "FACTORY" },
          ]);
        }
      } catch (err) {
        console.warn("Failed to load master tables:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMasters();
  }, []);

  const filteredItems = items.filter(
    (i) =>
      i.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Database className="h-6 w-6 text-blue-600" />
              Master Data Workbench
            </h1>
            <Badge variant="outline" className="text-xs">
              Tenant: INNOTEX
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Centrally governed registers of items, fabric profiles, customers, suppliers, and operating facilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => toast.info("New Item creation dialog: Auto/Manual code generation active")}
            className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Master Record
          </Button>
        </div>
      </div>

      {/* Tabs for Master Entities */}
      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full md:w-auto md:inline-flex mb-4">
          <TabsTrigger value="items" className="text-xs gap-1.5">
            <Layers className="h-3.5 w-3.5" /> Items & Variants ({items.length})
          </TabsTrigger>
          <TabsTrigger value="customers" className="text-xs gap-1.5">
            <Users className="h-3.5 w-3.5" /> Customers ({customers.length})
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="text-xs gap-1.5">
            <Truck className="h-3.5 w-3.5" /> Suppliers ({suppliers.length})
          </TabsTrigger>
          <TabsTrigger value="locations" className="text-xs gap-1.5">
            <Building2 className="h-3.5 w-3.5" /> Facilities ({locations.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Items */}
        <TabsContent value="items" className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search items, fabrics, trims..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-8"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Showing {filteredItems.length} items with customer item code aliasing
            </div>
          </div>

          <Card className="border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-36">Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Customer Alias</TableHead>
                  <TableHead className="text-right">Standard Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs font-bold text-foreground">
                      {item.code}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-xs text-foreground">{item.name}</div>
                      {item.item_type === "FABRIC" && (
                        <span className="text-[10px] text-muted-foreground">
                          Knit • 210 GSM • 150cm width • Lot & Shade Tracked
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.item_type === "FINISHED_GOOD"
                            ? "golden"
                            : item.item_type === "FABRIC"
                            ? "info"
                            : "outline"
                        }
                        className="text-[10px]"
                      >
                        {item.item_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {item.code === "SP-JKT-APX-01" ? (
                        <span className="text-blue-600 font-semibold">APX-TRJ-NVY</span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right text-xs font-medium">
                      {formatCurrency(item.standard_cost || 1850)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs text-blue-600"
                        onClick={() => toast.info(`Viewing spec for ${item.code}`)}
                      >
                        View Spec
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Tab 2: Customers */}
        <TabsContent value="customers" className="space-y-3">
          <Card className="border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Code</TableHead>
                  <TableHead>Legal Entity Name</TableHead>
                  <TableHead>GSTIN</TableHead>
                  <TableHead>Payment Terms</TableHead>
                  <TableHead className="text-right">Credit Limit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((cust) => (
                  <TableRow key={cust.id}>
                    <TableCell className="font-mono text-xs font-bold">{cust.code}</TableCell>
                    <TableCell className="font-semibold text-xs text-foreground">
                      {cust.name}
                      <span className="block text-[10px] text-muted-foreground font-normal">
                        Primary Delivery: Coimbatore Warehouse • State Code: 33
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {cust.gstin || "33AAACA1234A1Z5"}
                    </TableCell>
                    <TableCell className="text-xs">{cust.payment_terms_days || 30} Days Net</TableCell>
                    <TableCell className="text-right text-xs font-medium">
                      {formatCurrency(cust.credit_limit || 5000000)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Tab 3: Suppliers */}
        <TabsContent value="suppliers" className="space-y-3">
          <Card className="border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier Code</TableHead>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>GSTIN</TableHead>
                  <TableHead>Terms</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supp) => (
                  <TableRow key={supp.id}>
                    <TableCell className="font-mono text-xs font-bold">{supp.code}</TableCell>
                    <TableCell className="font-semibold text-xs text-foreground">
                      {supp.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {supp.gstin || "33AABCP9876Q1ZM"}
                    </TableCell>
                    <TableCell className="text-xs">{supp.payment_terms_days || 45} Days</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="success" className="text-[10px]">
                        Active Supplier
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Tab 4: Facilities & Locations */}
        <TabsContent value="locations" className="space-y-3">
          <Card className="border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location Code</TableHead>
                  <TableHead>Facility Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Role & Operation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((loc) => (
                  <TableRow key={loc.id}>
                    <TableCell className="font-mono text-xs font-bold">{loc.code}</TableCell>
                    <TableCell className="font-semibold text-xs text-foreground">
                      {loc.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {loc.location_type || "UNIT"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {loc.code.includes("ATL")
                        ? "Design, Patterning & Sampling"
                        : loc.code.includes("GRM")
                        ? "Bulk Cutting, Stitching & Finishing"
                        : loc.code.includes("CMP")
                        ? "Composites & Ballistics"
                        : "Central Logistics & Admin"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

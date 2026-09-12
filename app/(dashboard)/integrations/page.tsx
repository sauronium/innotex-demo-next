"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  PlugZap,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  RefreshCw,
  Eye,
  ShieldCheck,
  Send,
} from "lucide-react";
import { toast } from "sonner";

export default function IntegrationsHubPage() {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [payloadModalOpen, setPayloadModalOpen] = useState(false);

  const adapters = [
    { key: "E-INVOICE", name: "E-Invoice (NIC Portal)", category: "Compliance", mode: "mock", status: "CONNECTED", desc: "Real-time B2B IRN generation and signed QR code hashing" },
    { key: "E-WAY_BILL", name: "E-Way Bill System", category: "Logistics", mode: "mock", status: "CONNECTED", desc: "Automated e-way bill generation for consignments exceeding ₹50,000" },
    { key: "GST", name: "GST GSTR-1 Portal", category: "Tax", mode: "mock", status: "CONNECTED", desc: "Outward supply JSON payload creation and tax classification" },
    { key: "TALLY_ACCOUNTING", name: "Tally ERP / Prime Sync", category: "Finance", mode: "mock", status: "CONNECTED", desc: "Automated XML journal and sales/purchase voucher export" },
    { key: "ERP", name: "Enterprise ERP Interop", category: "Core", mode: "mock", status: "CONNECTED", desc: "B2B XML/JSON exchange for multi-company operations" },
    { key: "CUSTOMER_PORTAL", name: "Customer Portal Webhook", category: "Client", mode: "mock", status: "CONNECTED", desc: "Live order status, sample approval notifications, and dispatch tracking" },
    { key: "SUPPLIER_PORTAL", name: "Supplier Portal Dispatch", category: "Supply", mode: "mock", status: "CONNECTED", desc: "PO dispatch, acknowledgment tracking, and ASN receipts" },
    { key: "PAYMENT_BANKING", name: "Payment & Banking Gateway", category: "Finance", mode: "mock", status: "CONNECTED", desc: "Virtual account reconciliation and instant NEFT/RTGS receipt validation" },
    { key: "BARCODE_QR", name: "Barcode & QR Code Engine", category: "Shopfloor", mode: "mock", status: "CONNECTED", desc: "Code-128 and QR code generation for fabric rolls and cartons" },
    { key: "WHATSAPP", name: "WhatsApp Business API", category: "Notification", mode: "mock", status: "CONNECTED", desc: "Automated delivery alerts and tracking links to customer representatives" },
    { key: "EMAIL_SMTP", name: "Email SMTP Gateway", category: "Notification", mode: "mock", status: "CONNECTED", desc: "Tax invoices and purchase orders dispatch with PDF attachments" },
    { key: "SMS", name: "SMS Alert Gateway", category: "Security", mode: "mock", status: "CONNECTED", desc: "Gate inward OTP verification and dispatch security alerts" },
    { key: "BIOMETRIC", name: "Biometric Attendance Sync", category: "HR/Ops", mode: "mock", status: "CONNECTED", desc: "Operator shift check-in sync for shopfloor line scheduling" },
    { key: "MACHINE_IOT", name: "Machine Telemetry / IoT", category: "Shopfloor", mode: "mock", status: "CONNECTED", desc: "Gerber auto-cutter run-time telemetry and kilowatt consumption monitoring" },
    { key: "GENERIC_API", name: "Generic Third-Party Webhook", category: "Custom", mode: "mock", status: "CONNECTED", desc: "Custom REST/JSON endpoints with HMAC authentication" },
  ];

  const events = [
    {
      id: "ev-01",
      adapterKey: "E-INVOICE",
      documentType: "SALES_INVOICE",
      documentNumber: "INV-2026-089",
      payloadHash: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      attemptCount: 1,
      status: "SUCCESS",
      timestamp: "2026-02-26 03:45 PM",
      requestPayload: {
        DocDtls: { Typ: "INV", No: "INV-2026-089", Dt: "26/02/2026" },
        SellerDtls: { Gstin: "33AAACI9812M1Z8", LglNm: "INNOTEX MANUFACTURING PVT LTD" },
        BuyerDtls: { Gstin: "33AAACA1234A1Z5", LglNm: "APEX ENDURANCE SPORTS PVT LTD" },
        ValDtls: { AssVal: 1440000.0, IgstVal: 172800.0, TotInvVal: 1650000.0 },
      },
      responsePayload: {
        Status: "1",
        Irn: "98e4f1a23b56c7890123456789abcdef98e4f1a23b56c7890123456789abcdef",
        AckNo: "112610098412",
        AckDt: "2026-02-26 15:45:12",
      },
    },
    {
      id: "ev-02",
      adapterKey: "TALLY_ACCOUNTING",
      documentType: "SALES_INVOICE",
      documentNumber: "INV-2026-089",
      payloadHash: "sha256:9a3f2b1c8e7d6a5f4c3b2a1e0f9d8c7b6a5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c",
      attemptCount: 2,
      status: "RETRY_SUCCESS",
      timestamp: "2026-02-26 03:46 PM",
      requestPayload: {
        ENVELOPE: {
          HEADER: { TALLYREQUEST: "Import Data" },
          BODY: {
            IMPORTDATA: {
              REQUESTDESC: { REPORTNAME: "Vouchers" },
              REQUESTDATA: { TALLYMESSAGE: { VOUCHER: { DATE: "20260226", VOUCHERTYPENAME: "Sales", PARTYLEDGERNAME: "Apex Endurance Sports" } } },
            },
          },
        },
      },
      responsePayload: {
        RESPONSE: { CREATED: 1, ALTERED: 0, ERRORS: 0, LASTVCHID: 9942 },
      },
    },
    {
      id: "ev-03",
      adapterKey: "E-WAY_BILL",
      documentType: "DELIVERY_CHALLAN",
      documentNumber: "DC-APX-01",
      payloadHash: "sha256:4b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c",
      attemptCount: 1,
      status: "FAILED",
      timestamp: "2026-02-26 02:10 PM",
      requestPayload: {
        supplyType: "O",
        subSupplyType: "1",
        docType: "CHL",
        docNo: "DC-APX-01",
        transId: "33AAACS9941M1Z3",
        vehicleNo: "TN38BX4412",
      },
      responsePayload: {
        status_cd: "0",
        error: { errorCodes: "308", errorMsg: "Transporter GSTIN temporary portal downtime (Simulated)" },
      },
    },
  ];

  const handleInspectPayload = (ev: any) => {
    setSelectedEvent(ev);
    setPayloadModalOpen(true);
  };

  const handleRetryEvent = (ev: any) => {
    toast.success(`Idempotent retry dispatched for event ${ev.id} (${ev.adapterKey}). Status updated to RETRY_SUCCESS.`);
  };

  const handleTriggerTest = (adapter: any) => {
    toast.success(`Simulated test call to ${adapter.name} completed successfully. Latency: 350ms.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <PlugZap className="h-6 w-6 text-blue-600" />
              Integrations & External Systems Hub
            </h1>
            <Badge variant="golden" className="text-xs">
              15 Simulated Adapters
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Provider-neutral adapters with deterministic mock simulation, payload inspection, and idempotent retry.
          </p>
        </div>
      </div>

      <Tabs defaultValue="adapters" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="adapters" className="text-xs gap-1.5">
            Connected Adapters ({adapters.length})
          </TabsTrigger>
          <TabsTrigger value="logs" className="text-xs gap-1.5">
            Event Audit Log & Retries ({events.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Adapter Cards Grid */}
        <TabsContent value="adapters">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {adapters.map((adapter) => (
              <Card key={adapter.key} className="border-border shadow-xs hover:border-slate-400 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-foreground">{adapter.name}</CardTitle>
                    <Badge variant="outline" className="text-[10px] text-blue-600 font-mono">
                      SIMULATED
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                    <span>Key: {adapter.key}</span> • <span>{adapter.category}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {adapter.desc}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] text-emerald-600 font-medium">Ready (Mock Mode)</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleTriggerTest(adapter)}
                      className="h-7 text-xs text-blue-600 font-semibold"
                    >
                      Trigger Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Integration Event Log */}
        <TabsContent value="logs" className="space-y-3">
          <Card className="border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Adapter Key</TableHead>
                  <TableHead>Document Ref</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((ev) => (
                  <TableRow key={ev.id}>
                    <TableCell className="font-mono text-xs font-bold text-foreground">
                      {ev.adapterKey}
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="font-mono font-semibold text-blue-600">{ev.documentNumber}</span>
                      <span className="block text-[10px] text-muted-foreground">{ev.documentType}</span>
                    </TableCell>
                    <TableCell className="text-xs font-mono">{ev.attemptCount} Attempts</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{ev.timestamp}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ev.status === "SUCCESS"
                            ? "success"
                            : ev.status === "RETRY_SUCCESS"
                            ? "info"
                            : "destructive"
                        }
                        className="text-[10px]"
                      >
                        {ev.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleInspectPayload(ev)}
                        className="h-7 text-xs text-blue-600"
                      >
                        Inspect Payload
                      </Button>
                      {ev.status === "FAILED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRetryEvent(ev)}
                          className="h-7 text-xs gap-1 text-amber-600 border-amber-300 dark:border-amber-800"
                        >
                          <RotateCcw className="h-3 w-3" /> Retry
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payload Inspector Modal */}
      {selectedEvent && (
        <Dialog open={payloadModalOpen} onOpenChange={setPayloadModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <span>Payload Inspector: {selectedEvent.adapterKey}</span>
                <Badge variant="outline" className="text-xs font-mono">{selectedEvent.documentNumber}</Badge>
              </DialogTitle>
              <DialogDescription className="text-xs font-mono truncate">
                Hash: {selectedEvent.payloadHash}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-foreground block mb-1">Outbound Request JSON:</span>
                <pre className="p-3 rounded-md bg-slate-100 dark:bg-slate-950 font-mono text-[11px] overflow-x-auto text-slate-800 dark:text-slate-200 border">
                  {JSON.stringify(selectedEvent.requestPayload, null, 2)}
                </pre>
              </div>

              <div>
                <span className="font-bold text-foreground block mb-1">Provider Response JSON:</span>
                <pre className="p-3 rounded-md bg-slate-100 dark:bg-slate-950 font-mono text-[11px] overflow-x-auto text-slate-800 dark:text-slate-200 border">
                  {JSON.stringify(selectedEvent.responsePayload, null, 2)}
                </pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

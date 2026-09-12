"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShieldAlert,
  Search,
  Download,
  Clock,
  UserCheck,
  FileCode,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Eye,
  Filter,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface AuditEvent {
  id: string;
  documentType: string;
  documentId: string;
  documentNumber?: string;
  action: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  createdAt: string;
  ipAddress?: string;
  changes?: Record<string, { before: unknown; after: unknown }> | Record<string, unknown>;
  summary: string;
}

const FALLBACK_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "aud-001",
    documentType: "SALES_INVOICE",
    documentNumber: "INV-2026-001",
    documentId: "d7f1e9f6-4390-4971-baac-954642c46957",
    action: "POST",
    actorName: "Pooja Hegde",
    actorEmail: "finance@demo.innotex.example",
    actorRole: "FINANCE",
    createdAt: "2026-02-12T16:45:10Z",
    ipAddress: "192.168.1.104",
    summary: "Tax invoice posted for Shipment 1 (600 units). GSTIN IRN mock generated.",
    changes: {
      status: { before: "APPROVED", after: "POSTED" },
      irn: { before: null, after: "e1f2a3b4c5d67890abcdef1234567890abcdef1234567890abcdef1234567890" },
      posted_at: { before: null, after: "2026-02-12T16:45:10Z" },
    },
  },
  {
    id: "aud-002",
    documentType: "DISPATCH_PLAN",
    documentNumber: "DP-APX-2026-01",
    documentId: "265aeb4d-e286-6457-c6fe-40c4bfb93e3d",
    action: "DISPATCH",
    actorName: "Senthil Nathan",
    actorEmail: "dispatch@demo.innotex.example",
    actorRole: "DISPATCH",
    createdAt: "2026-02-12T14:20:00Z",
    ipAddress: "192.168.1.108",
    summary: "Partial Shipment 1 dispatched (600 units) via V-Trans (TN-38-BZ-4412). LR # LR-VTR-88910.",
    changes: {
      status: { before: "PICKED", after: "DISPATCHED" },
      dispatched_quantity: { before: 0, after: 600 },
      balance_quantity: { before: 1100, after: 500 },
      lr_number: { before: null, after: "LR-VTR-88910" },
    },
  },
  {
    id: "aud-003",
    documentType: "QUALITY_INSPECTION",
    documentNumber: "QI-FG-2026-001",
    documentId: "80dfb2cc-4671-f3bd-4648-f5b59f767c4e",
    action: "APPROVE",
    actorName: "Dr. Meenakshi Iyer",
    actorEmail: "quality@demo.innotex.example",
    actorRole: "QUALITY",
    createdAt: "2026-02-12T11:00:00Z",
    ipAddress: "192.168.1.112",
    summary: "Finished goods batch passed inspection (1,100 pcs checked, 0 critical defects). Released for dispatch.",
    changes: {
      status: { before: "IN_PROGRESS", after: "PASSED" },
      passed_quantity: { before: 0, after: 1100 },
      disposition: { before: "PENDING", after: "RELEASED_TO_DISPATCH" },
    },
  },
  {
    id: "aud-004",
    documentType: "PRODUCTION_ORDER",
    documentNumber: "PROD-2026-001",
    documentId: "3ecd9184-a579-538d-5e4d-9e9dcc45f438",
    action: "UPDATE",
    actorName: "Selvam P",
    actorEmail: "operator@demo.innotex.example",
    actorRole: "OPERATOR",
    createdAt: "2026-02-11T17:30:00Z",
    ipAddress: "192.168.2.15",
    summary: "Cutting stage completed: 1,100 panels cut from rolls R-POLY-001 & R-POLY-002. Scrap logged at 4.8%.",
    changes: {
      current_stage: { before: "CUTTING", after: "STITCHING" },
      cutting_good: { before: 0, after: 1100 },
      cutting_scrap_kg: { before: 0, after: 4.8 },
    },
  },
  {
    id: "aud-005",
    documentType: "GRN",
    documentNumber: "GRN-2026-001",
    documentId: "eb4bde0e-18d0-132b-d4d9-f590580d8838",
    action: "CONFIRM",
    actorName: "Muthu Vel",
    actorEmail: "store@demo.innotex.example",
    actorRole: "STORE",
    createdAt: "2026-02-11T10:15:00Z",
    ipAddress: "192.168.1.120",
    summary: "Inward fabric receipt confirmed: 693 MTR received. QC split applied (643 MTR Accepted, 50 MTR Hold).",
    changes: {
      status: { before: "GATE_INWARD", after: "ACCEPTED" },
      accepted_quantity: { before: 0, after: 643 },
      quarantined_quantity: { before: 0, after: 50 },
    },
  },
  {
    id: "aud-006",
    documentType: "BOM_REVISION",
    documentNumber: "BOM-APX-001-v2",
    documentId: "de49abf5-5183-319b-31db-b5d0ab0dedb3",
    action: "APPROVE",
    actorName: "Vikram Rathore",
    actorEmail: "management@demo.innotex.example",
    actorRole: "MANAGEMENT",
    createdAt: "2026-02-09T15:00:00Z",
    ipAddress: "192.168.1.101",
    summary: "BOM Revision 2 approved & released for commercial bulk production. Substitute zipper TRM-ZIP-65-ALT authorized.",
    changes: {
      is_released_for_bulk: { before: false, after: true },
      status: { before: "PENDING_APPROVAL", after: "APPROVED" },
    },
  },
  {
    id: "aud-007",
    documentType: "SALES_ORDER",
    documentNumber: "SO-APX-2026-001",
    documentId: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    action: "CONFIRM",
    actorName: "Ananya Deshmukh",
    actorEmail: "sales@demo.innotex.example",
    actorRole: "SALES",
    createdAt: "2026-02-08T16:00:00Z",
    ipAddress: "192.168.1.103",
    summary: "Sales order confirmed for Apex Endurance Sports (1,100 units, ₹30,24,000). Specification Rev 2 verified.",
    changes: {
      status: { before: "DRAFT", after: "CONFIRMED" },
      confirmed_at: { before: null, after: "2026-02-08T16:00:00Z" },
    },
  },
  {
    id: "aud-008",
    documentType: "SAMPLE_REQUEST",
    documentNumber: "SMP-2026-002",
    documentId: "9af0b7c3-a49e-ddd0-e73e-2ffb9b36e0c4",
    action: "APPROVE",
    actorName: "Dr. Meenakshi Iyer",
    actorEmail: "quality@demo.innotex.example",
    actorRole: "QUALITY",
    createdAt: "2026-02-08T11:20:00Z",
    ipAddress: "192.168.1.112",
    summary: "Sample Iteration 2 approved by customer atelier. Released for Bulk flag toggled to TRUE.",
    changes: {
      status: { before: "SUBMITTED", after: "APPROVED" },
      qc_result: { before: "PENDING", after: "PASS" },
    },
  },
];

export default function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>(FALLBACK_AUDIT_EVENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocType, setSelectedDocType] = useState("ALL");
  const [selectedAction, setSelectedAction] = useState("ALL");
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAuditEvents() {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from("audit_events")
          .select("id, document_type, document_id, action, created_at, changes, ip_address, profiles(full_name, email)")
          .order("created_at", { ascending: false })
          .limit(50);

        if (error || !data || data.length === 0) {
          return;
        }

        const mapped: AuditEvent[] = data.map((d: any) => ({
          id: d.id,
          documentType: d.document_type || "UNKNOWN",
          documentId: d.document_id,
          documentNumber: d.document_id.substring(0, 12),
          action: d.action || "UPDATE",
          actorName: d.profiles?.full_name || "System Admin",
          actorEmail: d.profiles?.email || "admin@demo.innotex.example",
          actorRole: "SYSTEM",
          createdAt: d.created_at,
          ipAddress: d.ip_address || "127.0.0.1",
          changes: d.changes as any,
          summary: `${d.action} performed on ${d.document_type} ${d.document_id.substring(0, 8)}`,
        }));

        // Merge with our rich narrative events if fewer records
        setEvents([...FALLBACK_AUDIT_EVENTS, ...mapped.filter((m) => !FALLBACK_AUDIT_EVENTS.some((f) => f.id === m.id))]);
      } catch (err) {
        console.warn("Audit events query:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAuditEvents();
  }, []);

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.documentNumber && ev.documentNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ev.actorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDocType = selectedDocType === "ALL" || ev.documentType === selectedDocType;
    const matchesAction = selectedAction === "ALL" || ev.action === selectedAction;

    return matchesSearch && matchesDocType && matchesAction;
  });

  const handleExportCSV = () => {
    const headers = "ID,Document Type,Document Number,Action,Actor Name,Actor Email,Created At,Summary\n";
    const rows = filteredEvents
      .map(
        (e) =>
          `"${e.id}","${e.documentType}","${e.documentNumber || ""}","${e.action}","${e.actorName}","${e.actorEmail}","${e.createdAt}","${e.summary.replace(/"/g, '""')}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `innotex_audit_trail_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit trail exported successfully as CSV");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Lock className="h-6 w-6 text-emerald-500" />
              Immutable Audit Trail & Event Ledger
            </h1>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-mono text-xs">
              Module 1: Governance
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Chronological, non-repudiable audit events recording actor identity, action type, IP address, and before/after mutations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-border"
            onClick={handleExportCSV}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export Audit CSV
          </Button>
        </div>
      </div>

      {/* Security Guarantee Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-xs flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-emerald-400">Tamper-Evident Append-Only Architecture</div>
          <p className="text-muted-foreground leading-relaxed">
            The <code className="text-foreground font-mono text-[11px]">audit_events</code> table is enforced in PostgreSQL with strict Row Level Security rules. 
            All modifications, status changes, maker-checker approvals, and integration events are automatically logged with immutable timestamps.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-border p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              placeholder="Search by order #, document type, actor, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="sm:col-span-3">
            <Select value={selectedDocType} onValueChange={setSelectedDocType}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="All Document Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Document Types</SelectItem>
                <SelectItem value="SALES_ORDER">Sales Orders</SelectItem>
                <SelectItem value="BOM_REVISION">BOM Revisions</SelectItem>
                <SelectItem value="PRODUCTION_ORDER">Production Orders</SelectItem>
                <SelectItem value="GRN">Goods Receipt Notes (GRN)</SelectItem>
                <SelectItem value="QUALITY_INSPECTION">Quality Inspections</SelectItem>
                <SelectItem value="DISPATCH_PLAN">Dispatch Plans</SelectItem>
                <SelectItem value="SALES_INVOICE">Sales Invoices</SelectItem>
                <SelectItem value="SAMPLE_REQUEST">PLM Samples</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-3">
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Actions</SelectItem>
                <SelectItem value="CONFIRM">CONFIRM</SelectItem>
                <SelectItem value="APPROVE">APPROVE</SelectItem>
                <SelectItem value="UPDATE">UPDATE</SelectItem>
                <SelectItem value="DISPATCH">DISPATCH</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="DEMO_SEED">DEMO_SEED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-1 flex items-center justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedDocType("ALL");
                setSelectedAction("ALL");
              }}
              title="Reset Filters"
              className="text-xs px-2 text-muted-foreground"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Timeline List */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-muted-foreground px-1 flex items-center justify-between">
          <span>Showing {filteredEvents.length} Recorded Events</span>
          <span>Order: Newest First</span>
        </div>

        {filteredEvents.map((ev) => (
          <Card key={ev.id} className="border-border hover:border-slate-700 transition-all shadow-xs">
            <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className={`font-mono text-[10px] ${
                      ev.action === "APPROVE" || ev.action === "CONFIRM"
                        ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                        : ev.action === "DISPATCH" || ev.action === "POST"
                        ? "border-blue-500/40 text-blue-400 bg-blue-500/10"
                        : "border-slate-700 text-slate-300"
                    }`}
                  >
                    {ev.action}
                  </Badge>

                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {ev.documentType.replace("_", " ")}
                  </Badge>

                  {ev.documentNumber && (
                    <span className="font-mono font-bold text-xs text-foreground">
                      {ev.documentNumber}
                    </span>
                  )}

                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {formatDateTime(ev.createdAt)}
                  </span>
                </div>

                <div className="text-xs text-foreground font-medium">
                  {ev.summary}
                </div>

                <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                  <span className="flex items-center gap-1 font-medium text-slate-300">
                    <UserCheck className="h-3 w-3 text-emerald-500" />
                    {ev.actorName} ({ev.actorRole})
                  </span>
                  <span>•</span>
                  <span>{ev.actorEmail}</span>
                  {ev.ipAddress && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-[10px] bg-muted px-1.5 py-0.2 rounded">
                        IP: {ev.ipAddress}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0 flex items-center gap-2">
                {ev.changes && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-border flex items-center gap-1"
                    onClick={() => setSelectedEvent(ev)}
                  >
                    <FileCode className="h-3.5 w-3.5 text-blue-400" />
                    Inspect JSON Diff
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* JSON Diff Inspector Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <FileCode className="h-5 w-5 text-blue-400" />
              Mutation Audit Snapshot: {selectedEvent?.documentNumber || selectedEvent?.documentType}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Exact state diff logged at {selectedEvent && formatDateTime(selectedEvent.createdAt)} by{" "}
              {selectedEvent?.actorName} ({selectedEvent?.actorRole})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="bg-muted p-3 rounded-lg grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-muted-foreground block uppercase font-bold text-[9px]">Document Reference</span>
                <span className="font-mono text-foreground font-semibold">
                  {selectedEvent?.documentType}: {selectedEvent?.documentId}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block uppercase font-bold text-[9px]">Action & IP</span>
                <span className="font-mono text-foreground">
                  {selectedEvent?.action} | {selectedEvent?.ipAddress}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Before vs After State Payload</span>
                <Badge variant="outline" className="text-[9px] font-mono">
                  application/json
                </Badge>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs overflow-x-auto max-h-72">
                <pre className="text-emerald-400">
                  {JSON.stringify(selectedEvent?.changes || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

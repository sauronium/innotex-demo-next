"use client";

import {useDemo} from '@/components/demo/demo-context';
import {inScope,approvalScope,canDecideApproval} from '@/lib/demo-scope';
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Eye,
  UserCheck,
  Ban,
  FileText,
  DollarSign,
  Layers,
  Sparkles,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface ApprovalItem {
  decisionNote?: string;
  decidedBy?: string;
  decidedAt?: string;
  id: string;
  documentType: "PURCHASE_ORDER" | "BOM_REVISION" | "STOCK_ADJUSTMENT" | "BULK_RELEASE";
  documentNumber: string;
  documentId: string;
  title: string;
  amount?: number;
  quantity?: string;
  makerRole: string;
  makerName: string;
  makerEmail: string;
  policyName: string;
  policyThreshold: string;
  currentStep: number;
  totalSteps: number;
  stepName: string;
  requiredRole: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  details: {
    vendorOrCustomer?: string;
    product?: string;
    reason: string;
    specStatus?: string;
  };
}

const INITIAL_APPROVAL_REQUESTS: ApprovalItem[] = [
  {
    id: "apr-po-001",
    documentType: "PURCHASE_ORDER",
    documentNumber: "PO-2026-004",
    documentId: "po-rec-poly-01",
    title: "Bulk Raw Material Purchase: Recycled Poly Knit Fabric (693 MTR)",
    amount: 1568000,
    makerRole: "PURCHASE",
    makerName: "Rajesh Kulkarni",
    makerEmail: "purchase@demo.innotex.example",
    policyName: "High-Value Procurement Policy",
    policyThreshold: "PO > ₹5,00,000 requires Tier-2 Management Approval",
    currentStep: 2,
    totalSteps: 2,
    stepName: "Management Financial Checker",
    requiredRole: "MANAGEMENT",
    status: "PENDING",
    createdAt: "2026-02-10T10:30:00Z",
    details: {
      vendorOrCustomer: "EcoKnit Textiles Tirupur (GSTIN: 33AAAAE1234F1Z5)",
      product: "FAB-RM-POLY-01 Recycled Moisture-Wicking Knit Fabric",
      reason: "MRP explosion shortage for confirmed Sales Order SO-APX-2026-001",
    },
  },
  {
    id: "apr-bom-002",
    documentType: "BOM_REVISION",
    documentNumber: "BOM-APX-001-v2",
    documentId: "54be27f4-de88-561c-e6e8-abaf1d22885a",
    title: "BOM Revision 2 Bulk Production Release",
    quantity: "1,100 Jackets",
    makerRole: "PRODUCTION",
    makerName: "Karthik Sundaram",
    makerEmail: "production@demo.innotex.example",
    policyName: "Technical Release & QA Gate",
    policyThreshold: "All bulk production BOM releases require Quality / Management Sign-off",
    currentStep: 2,
    totalSteps: 2,
    stepName: "Executive & QA Bulk Sign-off",
    requiredRole: "MANAGEMENT",
    status: "PENDING",
    createdAt: "2026-02-09T14:15:00Z",
    details: {
      vendorOrCustomer: "Apex Endurance Sports Pvt Ltd",
      product: "SP-JKT-APX-01 Apex Performance Training Jacket",
      reason: "Revision 1 rejected due to seam puckering; Rev 2 incorporates stabilizing tape and approved substitute zipper TRM-ZIP-65-ALT",
      specStatus: "Specification Rev 2 approved by Atelier QC",
    },
  },
  {
    id: "apr-stk-003",
    documentType: "STOCK_ADJUSTMENT",
    documentNumber: "ADJ-STK-009",
    documentId: "adj-roll-hold-01",
    title: "Quarantined Fabric Roll Release: R-POLY-003 (50 MTR)",
    quantity: "50 MTR",
    amount: 16800,
    makerRole: "STORE",
    makerName: "Muthu Vel",
    makerEmail: "store@demo.innotex.example",
    policyName: "Inventory Quality Clearance",
    policyThreshold: "Quarantine hold releases require Quality Assurance inspection confirmation",
    currentStep: 1,
    totalSteps: 1,
    stepName: "Quality Assurance Disposition",
    requiredRole: "QUALITY",
    status: "PENDING",
    createdAt: "2026-02-11T09:00:00Z",
    details: {
      vendorOrCustomer: "Coimbatore Central Warehouse - Hold Bay B-04",
      product: "Fabric Roll R-POLY-003 (Shade Navy-Deep-02)",
      reason: "Minor GSM variation observed at inward gate; re-tested with GSM cutter and verified within 180±5 GSM specification",
    },
  },
];

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<ApprovalItem[]>(INITIAL_APPROVAL_REQUESTS);
  const [activeTab, setActiveTab] = useState("pending");
  const {persona:currentPersona,scope}=useDemo();
  const [selectedRequest, setSelectedRequest] = useState<ApprovalItem | null>(null);
  const [actionDialog, setActionDialog] = useState<"APPROVE" | "REJECT" | null>(null);
  const [comments, setComments] = useState("");
  const isProcessing = false;

  useEffect(()=>{setActionDialog(null);setSelectedRequest(null)},[currentPersona.id,scope.unit,scope.location]);
  useEffect(()=>{try{const raw=localStorage.getItem('innotex-demo-approvals-v1');if(raw){const saved=JSON.parse(raw);if(Array.isArray(saved))setRequests(saved)}}catch{toast.error('Saved demo approvals could not be loaded')}},[]);

  const handleDecision = async (decision: "APPROVED" | "REJECTED") => {
    if (!selectedRequest) return;

    // Strict Segregation of Duties Check
    if (currentPersona.role === selectedRequest.makerRole || currentPersona.email === selectedRequest.makerEmail) {
      toast.error("Segregation of Duties Violation: Maker cannot approve or reject their own document!");
      return;
    }

    if (!canDecideApproval(currentPersona,selectedRequest,scope)) {toast.error('This decision is not available for your current role and scope.');return;}
    if(selectedRequest.status !== 'PENDING')return;
    const next=requests.map(item=>item.id===selectedRequest.id?{...item,status:decision,decisionNote:comments.trim(),decidedBy:currentPersona.name,decidedAt:new Date().toISOString()}:item);
    setRequests(next);
    try {localStorage.setItem('innotex-demo-approvals-v1',JSON.stringify(next));toast.success('Demo decision saved: '+decision.toLowerCase());}catch{toast.error('Decision applies for this session only; storage unavailable.');}
    setActionDialog(null);setSelectedRequest(null);setComments('');
  };
  const scopedRequests = requests.filter(req=>inScope(approvalScope(req),scope));

  const pendingCount = scopedRequests.filter((r) => r.status === "PENDING").length;
  const highValueCount = scopedRequests.filter((r) => r.amount && r.amount > 500000 && r.status === "PENDING").length;
  const approvedCount = scopedRequests.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = scopedRequests.filter((r) => r.status === "REJECTED").length;

  const filteredRequests = scopedRequests.filter((r) => {
    if (activeTab === "pending") return r.status === "PENDING";
    if (activeTab === "high-value") return r.amount && r.amount > 500000 && r.status === "PENDING";
    if (activeTab === "approved") return r.status === "APPROVED";
    if (activeTab === "rejected") return r.status === "REJECTED";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-indigo-500" />
              Maker-Checker Approval Queue
            </h1>
            <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 font-mono text-xs">
              Module 1: Governance
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Local demo approval queue with role checks and maker/checker separation. Decisions are saved in this browser; no backend approval is submitted.
          </p>
        </div>

        {/* Current Active Persona Badge */}
        <div className="flex items-center gap-2 bg-card border rounded-lg p-2 px-3 shadow-xs">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-muted-foreground">Current Acting Persona</div>
            <div className="text-xs font-semibold text-foreground flex items-center gap-1.5 justify-end">
              <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
              {currentPersona.name} ({currentPersona.roleName})
            </div>
          </div>
          <Badge className={currentPersona.avatarColor}>{currentPersona.role}</Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium text-amber-600 flex items-center justify-between">
              Pending Approvals
              <Clock className="h-4 w-4 text-amber-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">{pendingCount}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Awaiting checker review & authorization
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium text-purple-600 flex items-center justify-between">
              High-Value POs (&gt; ₹5L)
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">{highValueCount}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Tier-2 Management checker mandatory
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium text-emerald-600 flex items-center justify-between">
              Approved
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">{approvedCount}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Successfully authorized & released
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium text-muted-foreground flex items-center justify-between">
              Segregation of Duties
              <Ban className="h-4 w-4 text-blue-500" />
            </CardDescription>
            <CardTitle className="text-sm font-semibold text-emerald-500 flex items-center gap-1.5 pt-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Enforced by Rule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Maker cannot self-approve documents
          </CardContent>
        </Card>
      </div>

      {/* Segregation of Duties Warning Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-blue-400">Maker-Checker Policy Rules Active</div>
          <div className="text-muted-foreground leading-relaxed">
            Every high-value Purchase Order, BOM release, and stock hold release requires an independent checker review. 
            If the current user is the original creator (<span className="text-foreground font-mono font-medium">maker</span>), 
            the action buttons will be automatically blocked to prevent self-approval. Use the top bar persona dropdown to switch to <strong>Management</strong> or <strong>Quality</strong> to test approvals.
          </div>
        </div>
      </div>

      {/* Tab Controls */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 max-w-xl">
          <TabsTrigger value="pending" className="text-xs">
            Pending ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="high-value" className="text-xs">
            High-Value &gt;₹5L ({highValueCount})
          </TabsTrigger>
          <TabsTrigger value="approved" className="text-xs">
            Approved ({approvedCount})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="text-xs">
            Rejected ({rejectedCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 space-y-4">
          {filteredRequests.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <div className="text-base font-semibold text-foreground">No approval requests in this view</div>
              <p className="text-xs text-muted-foreground mt-1">
                All requests under this tab have already been resolved.
              </p>
            </Card>
          ) : (
            filteredRequests.map((req) => {
              const isMaker = currentPersona.role === req.makerRole || currentPersona.email === req.makerEmail;
              const canApprove = canDecideApproval(currentPersona,req,scope);

              return (
                <Card key={req.id} className="border-border hover:border-slate-700 transition-all shadow-xs">
                  <CardHeader className="p-4 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-muted/20 border-b">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="font-mono text-xs">
                          {req.documentType.replace("_", " ")}
                        </Badge>
                        <span className="font-mono font-bold text-sm text-foreground">
                          {req.documentNumber}
                        </span>
                        <StatusBadge status={req.status} />
                        {req.amount && req.amount > 500000 && (
                          <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 text-[10px]">
                            High-Value &gt; ₹5L
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-sm font-semibold text-foreground">
                        {req.title}
                        {req.decidedBy && <span className="mt-2 block text-xs font-normal text-muted-foreground">Decision by {req.decidedBy} · {req.decidedAt && formatDateTime(req.decidedAt)}{req.decisionNote && ` · ${req.decisionNote}`}</span>}
                      </CardTitle>
                    </div>

                    <div className="text-right">
                      {req.amount && (
                        <div className="text-base font-bold text-foreground font-mono">
                          {formatCurrency(req.amount)}
                        </div>
                      )}
                      {req.quantity && (
                        <div className="text-xs font-semibold text-muted-foreground font-mono">
                          Qty: {req.quantity}
                        </div>
                      )}
                      <div className="text-[10px] text-muted-foreground">
                        Submitted: {formatDateTime(req.createdAt)}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 space-y-4">
                    {/* Document & Policy Context */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-muted/10 p-3 rounded-lg border">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Maker (Requester)</span>
                        <div className="font-medium text-foreground mt-0.5 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                          {req.makerName} ({req.makerRole})
                        </div>
                        <div className="text-[10px] text-muted-foreground">{req.makerEmail}</div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Policy Governance</span>
                        <div className="font-medium text-foreground mt-0.5">{req.policyName}</div>
                        <div className="text-[10px] text-muted-foreground">{req.policyThreshold}</div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Approval Step</span>
                        <div className="font-medium text-indigo-400 mt-0.5 flex items-center gap-1">
                          <span>Step {req.currentStep} of {req.totalSteps}:</span>
                          <span>{req.stepName}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Authorized Checker: <strong>{req.requiredRole}</strong> or Management
                        </div>
                      </div>
                    </div>

                    {/* Justification / Specifics */}
                    <div className="text-xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Business Justification & Impact</span>
                      <p className="text-muted-foreground bg-muted/30 p-2.5 rounded-md border text-xs leading-relaxed">
                        {req.details.reason}
                        {req.details.specStatus && (
                          <span className="block font-medium text-emerald-400 mt-1">
                            ✓ {req.details.specStatus}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t">
                      <div className="flex items-center gap-2">
                        {req.documentType === "PURCHASE_ORDER" && (
                          <Link href="/procurement/requisitions" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" /> View Requisition & PO Details
                          </Link>
                        )}
                        {req.documentType === "BOM_REVISION" && (
                          <Link href="/manufacturing/plans" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                            <Layers className="h-3.5 w-3.5" /> View BOM Revision Tree
                          </Link>
                        )}
                        {req.documentType === "STOCK_ADJUSTMENT" && (
                          <Link href="/inventory/stock" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" /> View Quarantined Fabric Roll
                          </Link>
                        )}
                      </div>

                      {req.status === "PENDING" ? (
                        isMaker ? (
                          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 px-3 py-1.5 rounded-md text-xs text-destructive">
                            <Ban className="h-4 w-4 shrink-0" />
                            <span>
                              <strong>Self-Approval Prohibited:</strong> You created this request. Switch persona to Management to approve.
                            </span>
                          </div>
                        ) : canApprove ? (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setSelectedRequest(req);
                                setActionDialog("REJECT");
                              }}
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1 text-destructive" />
                              Reject / Return
                            </Button>
                            <Button
                              size="sm"
                              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                              onClick={() => {
                                setSelectedRequest(req);
                                setActionDialog("APPROVE");
                              }}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              Authorize & Approve
                            </Button>
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground italic flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                            Requires role: <strong>{req.requiredRole}</strong> or Management
                          </div>
                        )
                      ) : (
                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          {req.status === "APPROVED" ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4" /> Approved & Locked
                            </span>
                          ) : (
                            <span className="text-destructive flex items-center gap-1">
                              <XCircle className="h-4 w-4" /> Rejected & Returned to Maker
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Decision Dialog */}
      <Dialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionDialog === "APPROVE" ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Confirm Document Approval
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-destructive" />
                  Confirm Document Rejection
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {actionDialog === "APPROVE"
                ? `You are authorizing ${selectedRequest?.documentNumber} under ${selectedRequest?.policyName}.`
                : `You are returning ${selectedRequest?.documentNumber} to ${selectedRequest?.makerName} for revision.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 bg-muted rounded-md space-y-1">
              <div className="font-semibold text-foreground">{selectedRequest?.title}</div>
              {selectedRequest?.amount && (
                <div className="font-mono text-emerald-400 font-bold">
                  Amount: {formatCurrency(selectedRequest.amount)}
                </div>
              )}
              <div className="text-muted-foreground text-[11px]">
                Checker: <strong>{currentPersona.name}</strong> ({currentPersona.roleName})
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Checker Review Notes / Comments
              </label>
              <Textarea
                placeholder={
                  actionDialog === "APPROVE"
                    ? "Verified against budget allocation and QC specs. Approved for processing."
                    : "Specify reason for rejection or corrective actions required by maker..."
                }
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="text-xs h-20"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActionDialog(null)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className={
                actionDialog === "APPROVE"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-destructive hover:bg-destructive/90 text-white"
              }
              onClick={() =>
                actionDialog &&
                handleDecision(actionDialog === "APPROVE" ? "APPROVED" : "REJECTED")
              }
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : actionDialog === "APPROVE" ? "Confirm Approval" : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { DocumentConnections } from "@/components/shared/document-connections";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Plus,
  FileText,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function PLMDesignsPage() {
  const [selectedBriefId, setSelectedBriefId] = useState("db-apx-01");
  const [isBulkReleased, setIsBulkReleased] = useState(true);

  const designBriefs = [
    {
      id: "db-apx-01",
      briefNumber: "BRF-2026-004",
      title: "Apex Custom Performance Training Jacket",
      customer: "Apex Endurance Sports Pvt Ltd",
      season: "Autumn / Winter 2026",
      status: "APPROVED",
      assignedFacility: "Tirupur Atelier",
      targetDate: "2026-11-15",
      productCode: "SP-JKT-APX-01",
      iterations: [
        {
          iterationNumber: 1,
          status: "REJECTED",
          qcResult: "FAIL",
          defectReason: "Zipper seam puckering under stretch test; reflective tape alignment off by 4mm",
          sampleDate: "2026-01-20",
          evaluator: "Customer QC & Quality Lead",
        },
        {
          iterationNumber: 2,
          status: "APPROVED",
          qcResult: "PASS",
          defectReason: "Seam puckering resolved with stabilizing tape; customer signed off prototype",
          sampleDate: "2026-02-08",
          evaluator: "Dr. Meenakshi Iyer (Quality Lead)",
          bulkReleased: isBulkReleased,
        },
      ],
    },
    {
      id: "db-wrk-02",
      briefNumber: "BRF-2026-009",
      title: "High-Visibility Industrial Uniform Coverall",
      customer: "L&T Heavy Engineering",
      season: "Annual Contract 2026",
      status: "SUBMITTED",
      assignedFacility: "Tirupur Atelier",
      targetDate: "2026-12-01",
      productCode: "WRK-COV-01",
      iterations: [
        {
          iterationNumber: 1,
          status: "PENDING",
          qcResult: "PENDING",
          defectReason: "First prototype in progress on cutting table",
          sampleDate: "2026-02-18",
          evaluator: "Pending Evaluation",
        },
      ],
    },
  ];

  const currentBrief = designBriefs.find((b) => b.id === selectedBriefId) || designBriefs[0];

  const handleToggleBulkRelease = () => {
    setIsBulkReleased(!isBulkReleased);
    if (!isBulkReleased) {
      toast.success("Specification revision unlocked: 'Released for Bulk' applied. Commercial Sales Orders can now be posted.");
    } else {
      toast.warning("Bulk release gate revoked. Sales orders cannot be confirmed.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              PLM & Sampling Workbench
            </h1>
            <Badge variant="golden" className="text-xs">
              Module 4 • Gate 1
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Design creation, specification revisions, Tirupur atelier prototype iterations, and commercial bulk release gates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => toast.info("New Design Brief registration modal")}
            className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            New Design Brief
          </Button>
        </div>
      </div>

      {/* Grid: Left briefs list (4 cols) + Right Detail & Iterations (8 cols) */}
      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Briefs List */}
        <div className="md:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-blue-600" />
            Registered Design Briefs
          </h3>

          <div className="space-y-2">
            {designBriefs.map((brief) => (
              <div
                key={brief.id}
                onClick={() => setSelectedBriefId(brief.id)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  selectedBriefId === brief.id
                    ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/40 ring-1 ring-blue-500 shadow-xs"
                    : "border-border bg-card hover:bg-accent hover:border-slate-400"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-mono text-xs font-bold text-foreground">
                    {brief.briefNumber}
                  </span>
                  <StatusBadge status={brief.status} />
                </div>
                <div className="font-semibold text-xs text-foreground line-clamp-1">
                  {brief.title}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {brief.customer}
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-2 pt-2 border-t">
                  <span>{brief.season}</span>
                  <span className="font-medium text-foreground">{brief.assignedFacility}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Brief Details, Iteration Timeline & Bulk Release Gate */}
        <div className="md:col-span-8 space-y-5">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50 flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-bold text-foreground">
                    {currentBrief.title}
                  </CardTitle>
                  <StatusBadge status={currentBrief.status} />
                </div>
                <CardDescription className="text-xs">
                  Brief: <span className="font-mono font-semibold">{currentBrief.briefNumber}</span> • Customer: {currentBrief.customer}
                </CardDescription>
              </div>

              {/* Bulk Release Gate Button */}
              <Button
                size="sm"
                onClick={handleToggleBulkRelease}
                variant={isBulkReleased ? "default" : "outline"}
                className={`text-xs gap-1.5 font-semibold ${
                  isBulkReleased
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : "border-amber-500 text-amber-600 hover:bg-amber-50"
                }`}
              >
                {isBulkReleased ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Released for Bulk Production
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    Gate: Hold Commercial Release
                  </>
                )}
              </Button>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Product Specifications Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg border bg-slate-50/50 dark:bg-slate-900/40 text-xs">
                <div>
                  <span className="text-muted-foreground text-[11px]">Internal Item Code:</span>
                  <div className="font-mono font-bold text-foreground mt-0.5">{currentBrief.productCode}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px]">Customer Item Code:</span>
                  <div className="font-mono font-bold text-blue-600 mt-0.5">APX-TRJ-NVY</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px]">Primary Fabric:</span>
                  <div className="font-medium text-foreground mt-0.5">Recycled Moisture Knit</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px]">Target Delivery:</span>
                  <div className="font-medium text-foreground mt-0.5">{currentBrief.targetDate}</div>
                </div>
              </div>

              {/* Atelier Sample Iteration History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-blue-600" />
                    Tirupur Atelier Prototype Iterations ({currentBrief.iterations.length})
                  </h4>
                  <span className="text-[11px] text-muted-foreground">
                    Physical sample sign-off requirement
                  </span>
                </div>

                <div className="space-y-3">
                  {currentBrief.iterations.map((iter) => (
                    <div
                      key={iter.iterationNumber}
                      className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                        iter.status === "APPROVED"
                          ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20"
                          : "border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">
                            Sample Iteration #{iter.iterationNumber}
                          </span>
                          <Badge
                            variant={iter.status === "APPROVED" ? "success" : "destructive"}
                            className="text-[10px]"
                          >
                            {iter.qcResult} • {iter.status}
                          </Badge>
                          {iter.iterationNumber === 2 && isBulkReleased && (
                            <Badge variant="golden" className="text-[9px]">
                              RELEASED FOR BULK
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground">{iter.sampleDate}</span>
                      </div>

                      <div className="text-xs text-foreground/90 leading-relaxed">
                        <span className="font-medium">QC Notes:</span> {iter.defectReason}
                      </div>

                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1 border-t border-border/50">
                        <ShieldCheck className="h-3 w-3 text-blue-600" />
                        <span>Evaluated by: {iter.evaluator}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Link to Order */}
              <div className="pt-2 flex items-center justify-between border-t text-xs">
                <span className="text-muted-foreground">
                  Bulk release allows sales orders to bind to Specification Revision 2.
                </span>
                <Link href="/sales/orders/a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d">
                  <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
                    View Commercial Order (SO-APX)
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Shared Document Connections Panel */}
          <DocumentConnections
            documentType="DESIGN_BRIEF"
            documentId="db-apx-01"
            documentNumber={currentBrief.briefNumber}
          />
        </div>
      </div>
    </div>
  );
}

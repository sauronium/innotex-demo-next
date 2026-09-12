"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { DocumentConnections } from "@/components/shared/document-connections";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  ShieldCheck,
  Building,
  ArrowRight,
  Download,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function QualityInspectionDetailPage() {
  const params = useParams();
  const inspectionId = (params?.id as string) || "qi-fabric-01";

  const inspection = {
    inspectionNumber: "QC-FG-2026-012",
    inspectionType: "FINISHED_GOODS",
    referenceDocument: "PRD-2026-101",
    customer: "Apex Endurance Sports Pvt Ltd",
    itemCode: "SP-JKT-APX-01",
    itemName: "Custom Performance Training Jacket",
    inspectedQuantity: 1095,
    acceptedQuantity: 1095,
    rejectedQuantity: 0,
    holdQuantity: 0,
    disposition: "PASS",
    inspector: "Dr. Meenakshi Iyer (Quality Lead)",
    inspectionDate: "2026-02-23",
    certificateNumber: "COA-APX-2026-089",
  };

  const parameters = [
    {
      param: "Fabric Weight / GSM",
      spec: "210 GSM (±5%)",
      method: "ASTM D3776",
      actual: "211 GSM",
      result: "PASS",
      criticality: "Major",
    },
    {
      param: "Tensile Strength (Warp / Weft)",
      spec: "Min 450 N",
      method: "ISO 13934-1",
      actual: "485 N / 492 N",
      result: "PASS",
      criticality: "Critical",
    },
    {
      param: "Colorfastness to Washing",
      spec: "Grade 4-5 Minimum",
      method: "ISO 105-C06",
      actual: "Grade 4.5",
      result: "PASS",
      criticality: "Major",
    },
    {
      param: "Chest & Collar Measurements",
      spec: "Size matrix spec ± 0.5 cm",
      method: "AAMA Measurement Rig",
      actual: "All sizes within ± 0.2 cm",
      result: "PASS",
      criticality: "Critical",
    },
    {
      param: "Reflective Tape Luminance",
      spec: "> 400 cd/lx/m²",
      method: "EN ISO 20471",
      actual: "460 cd/lx/m²",
      result: "PASS",
      criticality: "Safety Critical",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              Quality Inspection: {inspection.inspectionNumber}
            </h1>
            <Badge variant="success" className="text-xs">
              DISPOSITION: {inspection.disposition}
            </Badge>
            <Badge variant="golden" className="text-xs">
              Released for Dispatch
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Finished Goods Clearance • {inspection.itemName} ({inspection.itemCode}) • Reference: {inspection.referenceDocument}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => toast.success(`Certificate ${inspection.certificateNumber} exported to PDF`)}
            variant="outline"
            className="text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Download Certificate (COA)
          </Button>
        </div>
      </div>

      {/* Grid: Inspection Context (4 cols) + Checklists & Parameters (8 cols) */}
      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Metadata */}
        <div className="md:col-span-4 space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/40">
              <CardTitle className="text-sm font-bold">Inspection Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground text-[11px]">Inspection Category:</span>
                <div className="font-semibold text-foreground">{inspection.inspectionType}</div>
                <div className="text-[10px] text-muted-foreground">Certified on: {inspection.inspectionDate}</div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">Certified Lead:</span>
                <div className="font-medium text-foreground">{inspection.inspector}</div>
              </div>

              <div className="border-t pt-2">
                <span className="text-muted-foreground text-[11px]">Certificate of Analysis:</span>
                <div className="font-mono font-bold text-blue-600 mt-0.5">{inspection.certificateNumber}</div>
              </div>

              <div className="border-t pt-3 p-3 rounded-lg border bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 space-y-1">
                <span className="text-emerald-800 dark:text-emerald-300 font-bold text-[10px] uppercase block">
                  Quality Gate Verdict:
                </span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  All 1,095 garments pass customer aesthetic and performance tolerances. Unlocks commercial dispatch planning.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Parameters Table */}
        <div className="md:col-span-8 space-y-5">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Tested Parameters & Methodologies</CardTitle>
                <CardDescription className="text-xs">
                  ASTM, ISO, and customer-specific physical & chemical compliance tests
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {parameters.length} Test Verifications
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Parameter</TableHead>
                    <TableHead>Specification Standard</TableHead>
                    <TableHead>Test Method</TableHead>
                    <TableHead>Actual Result</TableHead>
                    <TableHead className="text-right">Verdict</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parameters.map((p, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-xs font-semibold text-foreground">
                        {p.param}
                        <span className="block text-[10px] text-muted-foreground font-normal">
                          Criticality: {p.criticality}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {p.spec}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {p.method}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-foreground">
                        {p.actual}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="success" className="text-[10px]">
                          {p.result}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Shared Document Connections Panel */}
          <DocumentConnections
            documentType="QUALITY_INSPECTION"
            documentId={inspectionId}
            documentNumber={inspection.inspectionNumber}
          />
        </div>
      </div>
    </div>
  );
}

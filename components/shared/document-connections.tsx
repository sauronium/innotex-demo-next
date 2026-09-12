"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  getDocumentConnections,
  DocumentConnectionsResult,
} from "@/lib/supabase/rpc";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  Link as LinkIcon,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Paperclip,
  Upload,
  FileCheck,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface DocumentConnectionsProps {
  documentType: string;
  documentId: string;
  documentNumber?: string;
  className?: string;
}

export function DocumentConnections({
  documentType,
  documentId,
  documentNumber,
  className,
}: DocumentConnectionsProps) {
  const [data, setData] = useState<DocumentConnectionsResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchConnections() {
      setLoading(true);
      const res = await getDocumentConnections(documentType, documentId);
      if (mounted) {
        setData(res);
        setLoading(false);
      }
    }
    fetchConnections();
    return () => {
      mounted = false;
    };
  }, [documentType, documentId]);

  const upstreamCount = data?.upstream?.length || 0;
  const downstreamCount = data?.downstream?.length || 0;
  const auditCount = data?.audit?.length || 0;
  const attachmentCount = data?.attachments?.length || 0;

  const getRouteForDoc = (type: string, id: string): string => {
    switch (type.toUpperCase()) {
      case "SALES_ORDER":
        return `/sales/orders/${id}`;
      case "PURCHASE_ORDER":
        return `/procurement/requisitions`;
      case "MATERIAL_PLAN":
        return `/manufacturing/plans`;
      case "PRODUCTION_ORDER":
        return `/manufacturing/orders/${id}`;
      case "GRN":
        return `/procurement/receipts/${id}`;
      case "FABRIC_ROLL":
        return `/inventory/rolls/${id}`;
      case "DISPATCH_PLAN":
      case "DELIVERY_CHALLAN":
        return `/dispatch/plans/${id}`;
      case "SALES_INVOICE":
        return `/finance/invoices/${id}`;
      case "QUALITY_INSPECTION":
        return `/quality/inspections/${id}`;
      case "JOB_WORK_ORDER":
        return `/job-work/orders/${id}`;
      default:
        return "#";
    }
  };

  return (
    <Card className={`border-slate-200 dark:border-slate-800 shadow-sm ${className || ""}`}>
      <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <LinkIcon className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Document Connections & Lineage</CardTitle>
              <CardDescription className="text-xs">
                Traceability trail for {documentType} {documentNumber || documentId.slice(0, 8)}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Audit Guard Active
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <Tabs defaultValue="lineage" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 w-full md:w-auto md:inline-flex">
            <TabsTrigger value="lineage" className="text-xs gap-1.5">
              <ArrowUpRight className="h-3.5 w-3.5" />
              Lineage ({upstreamCount + downstreamCount})
            </TabsTrigger>
            <TabsTrigger value="audit" className="text-xs gap-1.5">
              <History className="h-3.5 w-3.5" />
              Audit Trail ({auditCount})
            </TabsTrigger>
            <TabsTrigger value="attachments" className="text-xs gap-1.5">
              <Paperclip className="h-3.5 w-3.5" />
              Files ({attachmentCount})
            </TabsTrigger>
          </TabsList>

          {/* Lineage Tab */}
          <TabsContent value="lineage" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Upstream */}
              <div className="p-3.5 rounded-lg border bg-slate-50/40 dark:bg-slate-900/30">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <ArrowUpRight className="h-3.5 w-3.5 text-blue-600" />
                  Upstream Parent Records ({upstreamCount})
                </div>
                {upstreamCount === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-2">
                    No upstream documents (initiating root record).
                  </p>
                ) : (
                  <div className="space-y-2">
                    {data?.upstream.map((up, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-md bg-background border text-xs"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{up.type}</span>
                          <span className="text-[11px] text-muted-foreground">{up.link}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">{formatDate(up.created_at)}</span>
                          <Link href={getRouteForDoc(up.type, up.id)}>
                            <Button size="sm" variant="ghost" className="h-7 px-2">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Downstream */}
              <div className="p-3.5 rounded-lg border bg-slate-50/40 dark:bg-slate-900/30">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <ArrowDownRight className="h-3.5 w-3.5 text-emerald-600" />
                  Downstream Generated Records ({downstreamCount})
                </div>
                {downstreamCount === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-2">
                    No downstream documents generated yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {data?.downstream.map((down, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-md bg-background border text-xs"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{down.type}</span>
                          <span className="text-[11px] text-muted-foreground">{down.link}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">{formatDate(down.created_at)}</span>
                          <Link href={getRouteForDoc(down.type, down.id)}>
                            <Button size="sm" variant="ghost" className="h-7 px-2">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Audit Trail Tab */}
          <TabsContent value="audit">
            {auditCount === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                <ShieldAlert className="h-6 w-6 mx-auto mb-1 text-slate-400 opacity-60" />
                No audit events logged yet.
              </div>
            ) : (
              <div className="relative pl-6 border-l space-y-4 my-2 text-xs">
                {data?.audit.map((event, i) => (
                  <div key={i} className="relative group">
                    <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-blue-600 ring-4 ring-background" />
                    <div className="p-3 rounded-md border bg-slate-50/50 dark:bg-slate-900/40">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-foreground">{event.action}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {formatDateTime(event.created_at)}
                        </span>
                      </div>
                      {event.changes && (
                        <pre className="mt-1 p-2 rounded bg-slate-100 dark:bg-slate-950 font-mono text-[10px] overflow-x-auto text-slate-700 dark:text-slate-300">
                          {JSON.stringify(event.changes, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Attachments Tab */}
          <TabsContent value="attachments">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Stored securely in Supabase bucket <code className="text-primary font-mono">erp-documents</code>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs h-7"
                  onClick={() => {
                    toast.info("Upload simulation: Pick document file to upload to erp-documents");
                  }}
                >
                  <Upload className="h-3 w-3" />
                  Attach File
                </Button>
              </div>

              {attachmentCount === 0 ? (
                <div className="p-6 text-center border rounded-lg border-dashed text-xs text-muted-foreground">
                  <FileCheck className="h-8 w-8 mx-auto mb-1 text-slate-300 dark:text-slate-700" />
                  No files attached to this document. Click &quot;Attach File&quot; to upload QC certificates, artwork, or signed PODs.
                </div>
              ) : (
                <div className="divide-y border rounded-lg">
                  {data?.attachments.map((file) => (
                    <div key={file.id} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{file.file_name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {file.mime_type} • {(file.file_size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="h-7 text-xs">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

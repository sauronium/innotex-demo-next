import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  RotateCcw,
  Send,
  Lock,
} from "lucide-react";

interface StatusBadgeProps {
  status: string | null | undefined;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (!status) return <Badge variant="outline">UNKNOWN</Badge>;

  const s = status.toUpperCase();

  switch (s) {
    case "APPROVED":
    case "PASS":
    case "RELEASED":
    case "BULK_RELEASED":
      return (
        <Badge variant="success" className={`gap-1 font-medium ${className || ""}`}>
          <CheckCircle2 className="h-3 w-3" />
          {status}
        </Badge>
      );
    case "POSTED":
    case "CLOSED":
    case "CONFIRMED":
      return (
        <Badge variant="default" className={`gap-1 bg-blue-600 font-medium ${className || ""}`}>
          <Lock className="h-3 w-3" />
          {status}
        </Badge>
      );
    case "PENDING":
    case "PENDING_APPROVAL":
    case "SUBMITTED":
      return (
        <Badge variant="warning" className={`gap-1 font-medium ${className || ""}`}>
          <Clock className="h-3 w-3" />
          {status}
        </Badge>
      );
    case "PARTIALLY_CLOSED":
    case "PARTIAL":
      return (
        <Badge variant="info" className={`gap-1 font-medium ${className || ""}`}>
          <Send className="h-3 w-3" />
          {status}
        </Badge>
      );
    case "HOLD":
    case "ON_HOLD":
      return (
        <Badge variant="warning" className={`gap-1 font-medium bg-amber-500 text-slate-950 ${className || ""}`}>
          <AlertTriangle className="h-3 w-3" />
          {status}
        </Badge>
      );
    case "REJECTED":
    case "FAIL":
    case "CANCELLED":
      return (
        <Badge variant="destructive" className={`gap-1 font-medium ${className || ""}`}>
          <XCircle className="h-3 w-3" />
          {status}
        </Badge>
      );
    case "REWORK":
      return (
        <Badge variant="purple" className={`gap-1 font-medium ${className || ""}`}>
          <RotateCcw className="h-3 w-3" />
          {status}
        </Badge>
      );
    case "DRAFT":
    default:
      return (
        <Badge variant="outline" className={`gap-1 text-muted-foreground ${className || ""}`}>
          <FileText className="h-3 w-3" />
          {status}
        </Badge>
      );
  }
}

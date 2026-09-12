"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModuleNode, MODULES } from "@/lib/constants/module-map";
import {
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Database,
} from "lucide-react";
import Link from "next/link";

interface ModuleDrawerProps {
  module: ModuleNode | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectRelatedModule?: (moduleId: string) => void;
}

export function ModuleDrawer({
  module,
  isOpen,
  onClose,
  onSelectRelatedModule,
}: ModuleDrawerProps) {
  if (!module) return null;

  const upstreamModules = MODULES.filter((m) => module.upstream.includes(m.id));
  const downstreamModules = MODULES.filter((m) => module.downstream.includes(m.id));

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl overflow-y-auto space-y-6">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Module #{module.number}
            </span>
            <Badge variant="outline" className="text-[11px] capitalize">
              {module.category}
            </Badge>
            {module.goldenStep && (
              <Badge variant="golden" className="text-[10px]">
                Walkthrough step {module.goldenStep}
              </Badge>
            )}
          </div>
          <SheetTitle className="text-xl font-bold text-foreground flex items-center justify-between">
            {module.name}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground leading-relaxed">
            {module.description}
          </SheetDescription>
        </SheetHeader>

        {/* Live KPIs */}
        <div className="grid grid-cols-3 gap-2.5">
          {module.kpis.map((kpi, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border bg-slate-50/60 dark:bg-slate-900/40 text-center"
            >
              <div className="text-xs text-muted-foreground font-medium">{kpi.label}</div>
              <div className="text-lg font-bold text-foreground mt-0.5">{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Primary Responsibilities */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
            What you can do here
          </h4>
          <ul className="space-y-1.5 text-xs">
            {module.responsibilities.map((resp, i) => (
              <li key={i} className="flex items-start gap-2 text-foreground/90">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Roles */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
            Who uses this
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {module.ownerRoles.map((role) => (
              <Badge key={role} variant="secondary" className="text-xs font-mono">
                {role}
              </Badge>
            ))}
          </div>
        </div>

        {/* Upstream / Downstream Connections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
          {/* Upstream Feeder Modules */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <ArrowUpRight className="h-3.5 w-3.5 text-blue-600" />
              Receives from ({upstreamModules.length})
            </div>
            {upstreamModules.length === 0 ? (
              <p className="text-xs text-muted-foreground">No incoming connections.</p>
            ) : (
              <div className="space-y-1.5">
                {upstreamModules.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onSelectRelatedModule && onSelectRelatedModule(m.id)}
                    className="w-full text-left p-2 rounded border bg-card hover:bg-accent text-xs flex items-center justify-between transition-colors"
                  >
                    <span className="font-medium truncate">{m.shortName}</span>
                    <Badge variant="outline" className="text-[9px]">#{m.number}</Badge>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Downstream Consumers */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <ArrowDownRight className="h-3.5 w-3.5 text-emerald-600" />
              Sends to ({downstreamModules.length})
            </div>
            {downstreamModules.length === 0 ? (
              <p className="text-xs text-muted-foreground">No outgoing connections.</p>
            ) : (
              <div className="space-y-1.5">
                {downstreamModules.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onSelectRelatedModule && onSelectRelatedModule(m.id)}
                    className="w-full text-left p-2 rounded border bg-card hover:bg-accent text-xs flex items-center justify-between transition-colors"
                  >
                    <span className="font-medium truncate">{m.shortName}</span>
                    <Badge variant="outline" className="text-[9px]">#{m.number}</Badge>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="pt-4 border-t flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
            <Button asChild size="sm" className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium">
              <Link href={module.route}>
              Open {module.shortName}
              <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

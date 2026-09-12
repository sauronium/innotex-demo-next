"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MODULES, type ModuleNode } from "@/lib/constants/module-map";
import { type WorkflowStep } from "@/lib/constants/workflows";
import { WorkflowPlayer } from "@/components/modules/workflow-player";
import { ModuleDrawer } from "@/components/modules/module-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ChevronDown, ChevronUp, Search, Route } from "lucide-react";

const STAGES = [
  { id: "plan", title: "Design & plan", description: "Agree on the product and what it needs.", modules: ["plm-sampling", "sales-orders", "bom-mrp"] },
  { id: "source", title: "Buy & receive", description: "Source materials and make them available.", modules: ["procurement", "inward-grn", "inventory-traceability"] },
  { id: "make", title: "Make & check", description: "Manage production and verify quality.", modules: ["production-execution", "job-work", "quality-management"] },
  { id: "deliver", title: "Deliver & collect", description: "Ship the order and track its value.", modules: ["dispatch-logistics", "finance-costing"] },
  { id: "support", title: "Manage the business", description: "Shared tools that support every stage.", modules: ["identity-access", "organization-locations", "master-data", "reports-dashboard", "integrations-documents"] },
];

const SUMMARIES: Record<string, string> = {
  "plm-sampling": "Develop designs, review samples and approve products for production.",
  "sales-orders": "Manage customer requirements, quantities and confirmed orders.",
  "bom-mrp": "List the materials needed for each product and calculate shortages.",
  procurement: "Request materials, compare suppliers and raise purchase orders.",
  "inward-grn": "Record deliveries and check which materials can be accepted.",
  "inventory-traceability": "Find stock, trace fabric rolls and reserve materials for orders.",
  "production-execution": "Track work from cutting to packing, including scrap and rework.",
  "job-work": "Send work to outside suppliers and track what comes back.",
  "quality-management": "Inspect materials and finished goods before releasing them.",
  "dispatch-logistics": "Plan shipments and record delivery confirmation.",
  "finance-costing": "Manage invoices, payments, order costs and profit.",
  "identity-access": "Manage permissions, review approvals and see who changed what.",
  "organization-locations": "Organize business units, factories and warehouses.",
  "master-data": "Maintain shared lists of items, customers and suppliers.",
  "reports-dashboard": "Review business performance and export reports.",
  "integrations-documents": "Explore simulated integrations and linked documents.",
};

function ModulesPageContent() {
  const params = useSearchParams();
  const focus = params.get("focus");
  const workflow = params.get("workflow");
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("all");
  const [selected, setSelected] = useState<ModuleNode | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(Boolean(workflow));
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const onStepChange = useCallback((step: WorkflowStep) => setActiveModule(step.moduleId), []);

  useEffect(() => {
    const match = MODULES.find((mod) => mod.id === focus);
    if (match) { setSelected(match); setDrawerOpen(true); }
  }, [focus]);

  useEffect(() => { if (workflow) setShowGuide(true); }, [workflow]);

  const query = search.trim().toLowerCase();
  const groups = STAGES.filter((group) => stage === "all" || stage === group.id).map((group) => ({
    ...group,
    items: group.modules.flatMap((id) => {
      const mod = MODULES.find((item) => item.id === id);
      if (!mod) return [];
      const text = [mod.name, mod.shortName, mod.description, SUMMARIES[id], ...mod.ownerRoles, ...mod.responsibilities].join(" ").toLowerCase();
      return text.includes(query) ? [mod] : [];
    }),
  })).filter((group) => group.items.length > 0);
  const count = groups.reduce((total, group) => total + group.items.length, 0);
  const clearFilters = () => { setSearch(""); setStage("all"); };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Explore INNOTEX</p>
          <h1 className="text-2xl font-bold tracking-tight">Module map</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Follow an order from design to payment. Choose a module to start working, or view its details to see how it connects.</p>
        </div>
        <Button variant="outline" onClick={() => setShowGuide(!showGuide)} aria-expanded={showGuide} aria-controls="module-guide" className="gap-2">
          <Route className="h-4 w-4" /> {showGuide ? "Hide walkthrough" : "Guided walkthrough"}
          {showGuide ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </header>

      {showGuide && <div id="module-guide"><WorkflowPlayer key={workflow || "golden-path"} initialWorkflowId={workflow || "golden-path"} onStepChange={onStepChange} /></div>}

      <nav aria-label="Filter modules by business stage" className="rounded-xl border bg-card p-2">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-6">
          {[{ id: "all", title: "All modules" }, ...STAGES].map((group, index) => (
            <button key={group.id} type="button" aria-pressed={stage === group.id} onClick={() => setStage(group.id)} className={`flex items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${stage === group.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              {index > 0 && index < 5 && <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs">{index}</span>}
              {group.title}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-sm">
          <Search aria-hidden="true" className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input aria-label="Search modules" placeholder="Find a module or task…" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" />
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span role="status">{count} of {MODULES.length} modules</span>
          {(query || stage !== "all") && <Button variant="ghost" size="sm" onClick={clearFilters}>Clear filters</Button>}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <h2 className="font-semibold">No modules found</h2>
          <p className="mt-2 text-sm text-muted-foreground">Try another search or show all business stages.</p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>Show all modules</Button>
        </div>
      ) : groups.map((group) => (
        <section key={group.id} aria-labelledby={`stage-${group.id}`} className="space-y-3">
          <div className="flex items-center gap-3">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${group.id === "support" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
              {group.id === "support" ? <Route className="h-4 w-4" /> : STAGES.findIndex((item) => item.id === group.id) + 1}
            </span>
            <div><h2 id={`stage-${group.id}`} className="font-semibold">{group.title}</h2><p className="text-sm text-muted-foreground">{group.description}</p></div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {group.items.map((mod) => (
              <article key={mod.id} className={`flex flex-col rounded-xl border bg-card p-5 transition-shadow hover:shadow-md ${showGuide && activeModule === mod.id ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold">{mod.shortName}</h3>
                  {showGuide && activeModule === mod.id && <span className="text-xs font-medium text-primary">In walkthrough</span>}
                </div>
                <p className="mb-5 mt-2 text-sm leading-relaxed text-muted-foreground">{SUMMARIES[mod.id]}</p>
                <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
                  <Button variant="ghost" size="sm" aria-label={`View details for ${mod.shortName}`} onClick={() => { setSelected(mod); setDrawerOpen(true); }}>Details & connections</Button>
                  <Button asChild variant="outline" size="sm" className="gap-1.5"><Link href={mod.route} aria-label={`Open ${mod.shortName}`}>Open <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <ModuleDrawer module={selected} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} onSelectRelatedModule={(id) => { const mod = MODULES.find((item) => item.id === id); if (mod) setSelected(mod); }} />
    </div>
  );
}

export default function ModulesPage() {
  return <Suspense fallback={<div className="p-12 text-sm text-muted-foreground">Loading modules…</div>}><ModulesPageContent /></Suspense>;
}

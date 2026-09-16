"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Lock, Plus, Sparkles, Package, ArrowRight, Layers } from "lucide-react";
import { toast } from "sonner";
import { canRelease, checkKey, initialState, instantiate, productTypes, reviseProduct, stages, storageKey, uid, type PLMState, type ProductType, type ProjectProduct, type SKU, type Spec, type Sample } from "@/lib/plm";

const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
const specLabels: Record<keyof Spec, string> = { fabric: "Fabric, composition & GSM", colour: "Colour / lab dip", sizes: "Size range / dimensions", branding: "Branding & trims", notes: "Construction & variation notes" };
function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-1.5 text-sm font-medium"><span>{label}</span>{children}</label>;
}
function SpecFields({ spec }: { spec?: Spec }) {
  return <>{Object.entries(specLabels).map(([key, label]) => <Field key={key} label={label}>{key === "notes" ? <Textarea name={key} defaultValue={spec?.[key]} maxLength={1000} /> : <Input name={key} required defaultValue={spec?.[key as keyof Spec]} maxLength={250} />}</Field>)}</>;
}
function readSpec(form: FormData): Spec {
  return Object.fromEntries(Object.keys(specLabels).map(key => [key, String(form.get(key) || "").trim()])) as Spec;
}

export default function PLMDesignsPage() {
  const [data, setData] = useState<PLMState>(initialState);
  const [ready, setReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Loading local workspace…");
  const [projectId, setProjectId] = useState("db-apx-01");
  const [productId, setProductId] = useState("");
  const [tab, setTab] = useState("projects");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"project" | "sku" | "attach" | "variant" | "sample" | null>(null);
  const [editingSku, setEditingSku] = useState<SKU | null>(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.version !== 1 || !Array.isArray(parsed.skus) || !Array.isArray(parsed.projects)) throw new Error("Invalid workspace");
        setData(parsed);
      }
    } catch { toast.error("Local workspace could not be loaded. Demo data is shown."); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(storageKey, JSON.stringify(data)); setSaveStatus("Saved in this browser · Demo workspace"); }
    catch { setSaveStatus("Not saved · Browser storage unavailable"); toast.error("Changes are available for this session only; browser storage is unavailable."); }
  }, [data, ready]);
  const project = data.projects.find(p => p.id === projectId) || data.projects[0];
  const product = project?.products.find(p => p.id === productId) || project?.products[0];
  const sku = data.skus.find(s => s.id === product?.skuId);
  const lifecycle = stages(sku?.type || "Performance apparel");
  const updateProduct = (change: (p: ProjectProduct) => ProjectProduct) => setData(previous => ({ ...previous, projects: previous.projects.map(p => p.id === project.id ? { ...p, products: p.products.map(item => item.id === product.id ? change(item) : item) } : p) }));
  const chooseProject = (id: string) => { setProjectId(id); setProductId(""); setTab("projects"); };
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (key: string) => String(form.get(key) || "").trim();
    if (Array.from(event.currentTarget.querySelectorAll<HTMLInputElement>("[required]")).some(input => !input.value.trim())) { toast.error("Complete all required fields."); return; }
    if (modal === "project") {
      const id = uid();
      setData(previous => ({ ...previous, projects: [...previous.projects, { id, name: value("name"), client: value("client"), season: value("season"), due: value("due"), products: [] }] }));
      chooseProject(id);
    } else if (modal === "sku") {
      if (data.skus.some(s => s.id !== editingSku?.id && s.code.toLowerCase() === value("code").toLowerCase())) { toast.error("This SKU code already exists."); return; }
      const record: SKU = { id: editingSku?.id || uid(), code: value("code"), name: value("name"), type: (editingSku?.type || value("type")) as ProductType, revision: (editingSku?.revision || 0) + 1, ...readSpec(form) };
      setData(previous => ({ ...previous, skus: editingSku ? previous.skus.map(s => s.id === record.id ? record : s) : [...previous.skus, record] }));
    } else if (modal === "attach") {
      const master = data.skus.find(s => s.id === value("sku"));
      if (!master) return;
      const item = instantiate(master);
      setData(previous => ({ ...previous, projects: previous.projects.map(p => p.id === project.id ? { ...p, products: [...p.products, item] } : p) }));
      setProductId(item.id);
    } else if (modal === "variant") {
      updateProduct(p => reviseProduct(p, readSpec(form)));
    } else if (modal === "sample") {
      const sample: Sample = { id: uid(), kind: value("kind"), result: value("result") as Sample["result"], notes: value("notes"), reviewer: value("reviewer"), date: value("date") };
      updateProduct(p => ({ ...p, samples: [...p.samples, sample], released: false }));
    }
    setModal(null);
    toast.success("Workspace updated.");
  }
  const released = data.projects.flatMap(p => p.products).filter(p => p.released).length;
  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
      <div><div className="mb-2 flex items-center gap-2 text-blue-600"><Sparkles className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-widest">PLM & Sampling</span></div><h1 className="text-2xl font-bold tracking-tight">From first concept to production</h1><p className="mt-2 text-sm text-muted-foreground">Manage client projects, develop products and reuse your best designs.</p><p role="status" className="mt-2 text-xs text-muted-foreground">{saveStatus}</p></div>
      <Button disabled={!ready} onClick={() => setModal("project")} className="gap-2"><Plus className="h-4 w-4" />New project</Button>
    </div>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[["Active projects", data.projects.length], ["Reusable SKUs", data.skus.length], ["Project products", data.projects.reduce((n, p) => n + p.products.length, 0)], ["Released for bulk", released]].map(([label, value]) => <Card key={label}><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></CardContent></Card>)}</div>
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList><TabsTrigger value="projects">Project lifecycle</TabsTrigger><TabsTrigger value="skus">Product / SKU library</TabsTrigger></TabsList>
      <TabsContent value="projects" className="mt-5">
        <div className="grid items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-3"><h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client projects</h2>{data.projects.map(p => <button key={p.id} onClick={() => chooseProject(p.id)} className={`w-full rounded-xl border p-4 text-left transition-colors ${p.id === project?.id ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-500" : "bg-card hover:bg-accent"}`}><div className="text-sm font-semibold">{p.name}</div><div className="mt-1 text-xs text-muted-foreground">{p.client}</div><div className="mt-3 flex justify-between border-t pt-2 text-xs"><span>{p.products.length} product{p.products.length !== 1 ? "s" : ""}</span><span>{p.due}</span></div></button>)}</aside>
          {project && <div className="min-w-0 space-y-5">
            <Card><CardHeader><div className="flex flex-wrap justify-between gap-3"><div><CardTitle className="text-lg">{project.name}</CardTitle><CardDescription className="mt-1">{project.client} · {project.season}</CardDescription></div><Button disabled={!ready} size="sm" variant="outline" onClick={() => setModal("attach")}><Plus className="mr-1 h-4 w-4" />Add SKU</Button></div></CardHeader><CardContent>
              {project.products.length === 0 ? <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Add a SKU from your library to start this project’s lifecycle.</div> : <div className="flex flex-wrap gap-2">{project.products.map(p => <Button key={p.id} variant={p.id === product?.id ? "default" : "outline"} size="sm" onClick={() => setProductId(p.id)}>{data.skus.find(s => s.id === p.skuId)?.code} · V{p.revision}{project.products.filter(x => x.skuId === p.skuId).length > 1 ? ` · ${p.spec.colour}` : ""}</Button>)}</div>}
            </CardContent></Card>
            {product && sku && <>
              <Card><CardHeader className="pb-3"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="mb-2 flex flex-wrap gap-2"><Badge variant="info">{sku.type}</Badge><Badge variant={product.released ? "success" : "warning"}>{product.released ? "Released for bulk" : "In development"}</Badge></div><CardTitle className="text-lg">{sku.name}</CardTitle><CardDescription className="mt-1">Master {sku.code} / R{product.baseRevision} → Project variant V{product.revision}</CardDescription></div><Button size="sm" variant="outline" disabled={!ready} onClick={() => setModal("variant")}>Edit project variant</Button></div></CardHeader><CardContent><div className="grid gap-4 sm:grid-cols-2">{Object.entries(specLabels).map(([key, label]) => <div key={key} className={key === "notes" ? "sm:col-span-2" : ""}><p className="text-xs text-muted-foreground">{label}{product.spec[key as keyof Spec] !== product.base[key as keyof Spec] && <span className="ml-2 text-blue-600">Project override</span>}</p><p className="mt-1 text-sm">{product.spec[key as keyof Spec] || "—"}</p></div>)}</div><p className="mt-4 border-t pt-3 text-xs text-muted-foreground">This project keeps its own specification and approvals. Master updates do not change existing project variants.</p></CardContent></Card>
              <Card><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-base">Product development lifecycle</CardTitle><span className="text-sm font-semibold text-blue-600">{Math.round(product.checks.length / 16 * 100)}%</span></div><CardDescription>Complete each stage in sequence for this {sku.type.toLowerCase()} product.</CardDescription><div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Lifecycle completion" aria-valuenow={product.checks.length} aria-valuemin={0} aria-valuemax={16}><div className="h-full bg-blue-600 transition-all" style={{ width: `${product.checks.length / 16 * 100}%` }} /></div></CardHeader><CardContent className="space-y-3">{lifecycle.map((stage, index) => {
                const complete = stage.tasks.every((_, t) => product.checks.includes(checkKey(index, t)));
                const available = lifecycle.slice(0, index).every((s, i) => s.tasks.every((_, t) => product.checks.includes(checkKey(i, t))));
                return <div key={stage.name} className={`rounded-lg border p-4 ${complete ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/20" : available ? "border-blue-300" : "bg-muted/20"}`}><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="flex items-center gap-2 text-sm font-semibold">{complete ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">{index + 1}</span>}{stage.name}</h3><span className="text-xs text-muted-foreground">{stage.owner} · {complete ? "Complete" : available ? "Ready" : "Upcoming"}</span></div><div className="mt-3 space-y-2">{stage.tasks.map((task, t) => <label key={task} className="flex items-start gap-2 text-xs leading-5"><input type="checkbox" className="mt-1 accent-blue-600" checked={product.checks.includes(checkKey(index, t))} disabled={!ready || !available || product.released} onChange={e => {
                  const checked = e.target.checked;
                  updateProduct(p => ({ ...p, checks: checked ? [...p.checks, checkKey(index, t)] : p.checks.filter(key => Number(key.split("-")[0]) <= index && key !== checkKey(index, t)), released: false }));
                }} />{task}</label>)}</div></div>;
              })}</CardContent></Card>
              <Card><CardHeader><div className="flex flex-wrap items-center justify-between gap-2"><CardTitle className="text-base">Samples & client reviews</CardTitle><Button size="sm" variant="outline" disabled={!ready || product.released} onClick={() => setModal("sample")}><Plus className="mr-1 h-4 w-4" />Record sample</Button></div><CardDescription>Reviews for project variant V{product.revision}. The latest sample must be approved for bulk release.</CardDescription></CardHeader><CardContent className="space-y-3">{!product.samples.length && <p className="text-sm text-muted-foreground">No sample reviews yet. Record prototype, fit or pre-production feedback.</p>}{product.samples.map((sample, index) => <div key={sample.id} className="rounded-lg border p-3 text-sm"><div className="flex flex-wrap justify-between gap-2"><span className="font-semibold">#{index + 1} · {sample.kind}</span><Badge variant={sample.result === "Approved" ? "success" : sample.result === "Rejected" ? "destructive" : "warning"}>{sample.result}</Badge></div><p className="my-2">{sample.notes}</p><p className="text-xs text-muted-foreground">{sample.reviewer} · {sample.date}</p></div>)}</CardContent></Card>
              {!!product.history?.length && <Card><CardHeader><CardTitle className="text-base">Previous specification revisions</CardTitle><CardDescription>Preserved specifications, lifecycle checks and sample decisions.</CardDescription></CardHeader><CardContent className="space-y-3">{product.history.map(previous => <details key={previous.revision} className="rounded-lg border p-3 text-sm"><summary className="cursor-pointer font-medium">Variant V{previous.revision} · {previous.checks.length}/16 checks · {previous.released ? "Released" : "In development"}</summary><div className="mt-3 space-y-2">{Object.entries(specLabels).map(([key, label]) => <p key={key}><span className="text-muted-foreground">{label}: </span>{previous.spec[key as keyof Spec] || "—"}</p>)}{previous.samples.map(sample => <p key={sample.id} className="border-t pt-2">{sample.kind} · {sample.result} · {sample.reviewer} · {sample.date}<br />{sample.notes}</p>)}</div></details>)}</CardContent></Card>}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-5"><div><h3 className="flex items-center gap-2 text-sm font-semibold"><Lock className="h-4 w-4 text-blue-600" />Bulk production gate</h3><p className="mt-1 text-xs text-muted-foreground">{product.released ? "This variant is released. Revoke release before recording further reviews." : canRelease(product) ? "All lifecycle checks and the latest sample are approved." : "Complete all 8 stages and approve the latest sample to release."}</p></div><Button disabled={!ready || (!product.released && !canRelease(product))} variant={product.released ? "outline" : "default"} onClick={() => updateProduct(p => ({ ...p, released: !p.released }))}>{product.released ? "Revoke release" : "Release for bulk"}<ArrowRight className="ml-2 h-4 w-4" /></Button></div>
            </>}
          </div>}
        </div>
      </TabsContent>
      <TabsContent value="skus" className="mt-5 space-y-4"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-lg font-semibold">Reusable product library</h2><p className="text-sm text-muted-foreground">One core product, many projects and clients. Each project develops independently.</p></div><Button disabled={!ready} onClick={() => { setEditingSku(null); setModal("sku"); }}><Plus className="mr-2 h-4 w-4" />New SKU</Button></div><Input aria-label="Search SKU library" placeholder="Search code, product or product type…" value={search} onChange={e => setSearch(e.target.value)} className="max-w-md" /><div className="grid gap-4 md:grid-cols-2">{data.skus.filter(s => `${s.code} ${s.name} ${s.type}`.toLowerCase().includes(search.toLowerCase())).map(s => {
        const usages = data.projects.filter(p => p.products.some(item => item.skuId === s.id));
        return <Card key={s.id}><CardHeader><div className="flex justify-between gap-2"><Package className="h-5 w-5 text-blue-600" /><Badge variant="outline">Master R{s.revision}</Badge></div><CardTitle className="text-base">{s.name}</CardTitle><CardDescription>{s.code} · {s.type}</CardDescription></CardHeader><CardContent className="space-y-4"><p className="text-sm">{s.fabric}<br /><span className="text-muted-foreground">{s.colour} · {s.sizes}</span></p><div className="space-y-2 border-t pt-3"><p className="flex items-center gap-1 text-xs font-semibold"><Layers className="h-3 w-3" />Used in {usages.length} projects</p>{usages.map(p => <button className="block text-left text-xs text-blue-600 hover:underline" key={p.id} onClick={() => { chooseProject(p.id); setProductId(p.products.find(item => item.skuId === s.id)!.id); }}>{p.name} · {p.client}</button>)}{!usages.length && <p className="text-xs text-muted-foreground">Ready to add to a client project.</p>}</div><Button size="sm" variant="outline" disabled={!ready} onClick={() => { setEditingSku(s); setModal("sku"); }}>Edit master SKU</Button></CardContent></Card>;
      })}</div>{!data.skus.some(s => `${s.code} ${s.name} ${s.type}`.toLowerCase().includes(search.toLowerCase())) && <p className="p-8 text-center text-sm text-muted-foreground">No SKUs match your search.</p>}</TabsContent>
    </Tabs>
    <Dialog open={modal !== null} onOpenChange={open => { if (!open) setModal(null); }}><DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{modal === "project" ? "Create client project" : modal === "sku" ? editingSku ? "Edit master SKU" : "Create reusable SKU" : modal === "attach" ? "Add SKU to project" : modal === "variant" ? "Revise project specification" : "Record sample review"}</DialogTitle><DialogDescription>{modal === "variant" ? "Saving starts a new project revision and resets its lifecycle checks and sample reviews. The master and other projects stay unchanged." : modal === "sku" ? "Master specifications are copied when a SKU is added to a project. Existing project variants keep their original specifications." : modal === "attach" ? `Add an independent variant to ${project?.name}. You can customise its specification next.` : "Complete the details below to save to your local demo workspace."}</DialogDescription></DialogHeader>
      <form key={`${modal}-${editingSku?.id || "new"}`} onSubmit={submit} className="space-y-4">
        {modal === "project" && <><Field label="Project name"><Input name="name" required maxLength={150} /></Field><Field label="Client"><Input name="client" required maxLength={150} /></Field><Field label="Season / programme"><Input name="season" required maxLength={100} /></Field><Field label="Target delivery"><Input name="due" type="date" required /></Field></>}
        {modal === "sku" && <><Field label="SKU code"><Input name="code" required maxLength={60} defaultValue={editingSku?.code} /></Field><Field label="Product name"><Input name="name" required maxLength={150} defaultValue={editingSku?.name} /></Field><Field label="Product type"><select name="type" className={selectClass} defaultValue={editingSku?.type || productTypes[0]} disabled={!!editingSku}>{productTypes.map(type => <option key={type}>{type}</option>)}</select></Field><SpecFields spec={editingSku || undefined} /></>}
        {modal === "attach" && <Field label="Product SKU"><select className={selectClass} name="sku" required>{data.skus.map(s => <option key={s.id} value={s.id}>{s.code} · {s.name} (R{s.revision})</option>)}</select></Field>}
        {modal === "variant" && <SpecFields spec={product?.spec} />}
        {modal === "sample" && <><Field label="Sample type"><select className={selectClass} name="kind">{["Prototype", "Fit sample", "Size set", "Lab test", "Pre-production"].map(kind => <option key={kind}>{kind}</option>)}</select></Field><Field label="Review result"><select className={selectClass} name="result">{["Pending", "Approved", "Rejected"].map(result => <option key={result}>{result}</option>)}</select></Field><Field label="Reviewer / client approver"><Input name="reviewer" required maxLength={150} /></Field><Field label="Review date"><Input name="date" type="date" required defaultValue={new Date().toLocaleDateString("en-CA")} /></Field><Field label="Feedback / approval reference"><Textarea name="notes" required maxLength={1000} /></Field></>}
        <div className="flex justify-end gap-2 border-t pt-4"><Button type="button" variant="outline" onClick={() => setModal(null)}>Cancel</Button><Button type="submit">{modal === "attach" ? "Add to project" : "Save"}</Button></div>
      </form>
    </DialogContent></Dialog>
  </div>;
}

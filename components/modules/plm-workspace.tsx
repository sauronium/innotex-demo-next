"use client";
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useDemo } from '@/components/demo/demo-context';
import { inScope, workScope, canEditPLM, units, locations } from '@/lib/demo-scope';
import Link from 'next/link';
import { ArrowRight, Plus, Search, Layers, Library, Users, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PLMStatusBoard, StageBadge, WorkProgress, HandoverSummary } from '@/components/modules/plm-status-board';
import { stageColours } from '@/lib/plm-workspace';
import { toast } from 'sonner';
import { advance, canAdvance, categories, lifecycle, newWork, sampleTypes, seedWorkspace, taskKey, workspaceKey, type Workspace, type Work, type Material, type ProductSample } from '@/lib/plm-workspace';
const selectStyle = 'h-10 rounded-md border bg-background px-3 text-sm';
function Field({ label, children }: {
    label: string;
    children: ReactNode;
}) { return <label className="block space-y-2 text-sm font-medium"><span>{label}</span>{children}</label>; }
function Panel({ children }: {
    children: ReactNode;
}) { return <section className="rounded-xl border bg-card p-5 shadow-sm">{children}</section>; }
export default function PLMWorkspace({ initialModule = 'master' }: {
    initialModule?: 'master' | 'client';
}) {
    const {scope,persona} = useDemo();
    const canCreate = ['MANAGEMENT','ADMIN','SALES'].includes(persona.role);
    const canLibrary = ['MANAGEMENT','ADMIN','PURCHASE','QUALITY'].includes(persona.role);
    const canCommercial = ['MANAGEMENT','ADMIN','SALES','FINANCE'].includes(persona.role);
    const [data, setData] = useState<Workspace>(seedWorkspace);
    const [ready, setReady] = useState(false);
    const [saved, setSaved] = useState('Loading workspace…');
    const [module, setModule] = useState(initialModule);
    const [view, setView] = useState('Looker');
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [materialStatus, setMaterialStatus] = useState('All');
    const [materialSort, setMaterialSort] = useState('Code');
    const [clientId, setClientId] = useState('apex');
    const [workId, setWorkId] = useState('work-0');
    const [stage, setStage] = useState(0);
    const [crmEntries, setCrmEntries] = useState<{
        id: string;
        clientId: string;
        type: string;
        body: string;
    }[]>([]);
    const [modal, setModal] = useState<'material' | 'sample' | 'client' | 'work' | null>(null);
    const [material, setMaterial] = useState<Material | null>(null);
    const [sample, setSample] = useState<ProductSample | null>(null);
    useEffect(() => {
        try {
            const raw = localStorage.getItem(workspaceKey);
            if (raw) {
                const p = JSON.parse(raw);
                if (p.version === 2 && Array.isArray(p.works) && Array.isArray(p.materials) && Array.isArray(p.clients) && Array.isArray(p.samples))
                    setData(p);
                else
                    throw Error();
            }
        }
        catch {
            toast.error('Saved workspace could not be read. Demo records are shown.');
        }
        try {
            const entries = localStorage.getItem('innotex-crm-history-v1');
            if (entries)
                setCrmEntries(JSON.parse(entries));
        }
        catch { }
        const params = new URLSearchParams(window.location.search);
        const selected = params.get('client');
        const selectedWork = params.get('work');
        if (selectedWork) {
            try { const stored = localStorage.getItem(workspaceKey); const source: Workspace = stored ? JSON.parse(stored) : seedWorkspace; const match = source.works.find(w => w.id === selectedWork); if (match) { setClientId(match.clientId); setWorkId(match.id); setStage(match.stage); setModule('client'); } } catch {}
        }
        if (selected)
            setClientId(selected);
        setReady(true);
    }, []);
    useEffect(() => { if (!ready)
        return; try {
        localStorage.setItem(workspaceKey, JSON.stringify(data));
        setSaved('Saved in this browser · Demo workspace');
    }
    catch {
        setSaved('Session only · Changes could not be saved');
    } }, [data, ready]);
    const scopedWorks = data.works.filter(w=>inScope(workScope(w),scope));
    const scopedClients = data.clients.filter(c=>scopedWorks.some(w=>w.clientId===c.id)||!data.works.some(w=>w.clientId===c.id));
    const visibleData = {...data, works:scopedWorks, clients:scopedClients};
    const client = scopedClients.find(c => c.id === clientId) || scopedClients[0];
    const works = scopedWorks.filter(w => w.clientId === client?.id);
    const work = works.find(w => w.id === workId) || works[0];
    useEffect(()=>{if(work)setStage(work.stage)},[work?.id]);
    const stageEditable = !!work && canEditPLM(persona.role,work.stage);
    const update = (patch: Partial<Work>) => {
        if(!work || !inScope(workScope(work),scope))return;
        const commercial = Object.keys(patch).every(k=>['payment','followup'].includes(k));
        const metadata = Object.keys(patch).every(k=>['owner','priority','due','blocker'].includes(k));
        if(!(commercial?canCommercial:metadata?canEditPLM(persona.role):stageEditable)){toast.error('This action is not available for your demo role.');return;}
        setData(d=>({...d,works:d.works.map(w=>w.id===work.id?{...w,...patch}:w)}));
    };
    function openWork(w: Work) { setClientId(w.clientId); setWorkId(w.id); setStage(w.stage); setModule('client'); setQuery(''); }
    function changeView(v: string) { setView(v); setQuery(''); setCategory('All'); setMaterialStatus('All'); }
    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if ((modal === "material" || modal === "sample") ? !canLibrary : !canCreate) { toast.error("This demo role has read-only access here."); return; }
        const f = new FormData(e.currentTarget);
        const v = (k: string) => String(f.get(k) || '').trim();
        if (Array.from(e.currentTarget.querySelectorAll<HTMLInputElement>('[required]')).some(x => !x.value.trim())) {
            toast.error('Complete all required fields');
            return;
        }
        if (modal === 'material') {
            if (data.materials.some(m => m.id !== material?.id && m.code.toLowerCase() === v('code').toLowerCase())) {
                toast.error('Material code already exists');
                return;
            }
            const m: Material = { id: material?.id || crypto.randomUUID(), code: v('code'), name: v('name'), category: v('category'), composition: v('composition'), specification: v('specification'), colour: v('colour'), supplier: v('supplier'), unit: v('unit'), price: Number(v('price')), moq: Number(v('moq')), lead: Number(v('lead')), status: v('status'), notes: v('notes') };
            setData(d => ({ ...d, materials: material ? d.materials.map(x => x.id === m.id ? m : x) : [m, ...d.materials] }));
        }
        if (modal === 'sample') {
            if (data.samples.some(s => s.id !== sample?.id && s.code.toLowerCase() === v('code').toLowerCase())) {
                toast.error('Sample code already exists');
                return;
            }
            const s: ProductSample = { id: sample?.id || crypto.randomUUID(), code: v('code'), name: v('name'), category: v('category'), specification: v('specification'), status: v('status') };
            setData(d => ({ ...d, samples: sample ? d.samples.map(x => x.id === s.id ? s : x) : [s, ...d.samples] }));
        }
        if (modal === 'client') {
            if (data.clients.some(c => c.code.toLowerCase() === v('code').toLowerCase())) {
                toast.error('Client code already exists');
                return;
            }
            const c = { id: crypto.randomUUID(), code: v('code'), name: v('name') };
            setData(d => ({ ...d, clients: [...d.clients, c] }));
            setClientId(c.id);
            setModule('client');
        }
        if (modal === 'work') {
            if(!client)return;
            const w = {...newWork(client.id, v('name'), v('due'), Number(v('quantity'))),unit:v('unit'),location:v('location')};
            setData(d => ({ ...d, works: [...d.works, w] }));
            openWork(w);
        }
        setModal(null);
        toast.success('Workspace updated');
    }
    const searched = (s: string) => s.toLowerCase().includes(query.toLowerCase());
    const materials = data.materials.filter(m => (category === 'All' || m.category === category) && (materialStatus === 'All' || m.status === materialStatus) && searched(Object.values(m).join(' '))).sort((a,b)=>materialSort==='Lead time'?a.lead-b.lead:materialSort==='Price'?a.price-b.price:materialSort==='Name'?a.name.localeCompare(b.name):a.code.localeCompare(b.code));
    const samples = data.samples.filter(s => (category === 'All' || s.category === category) && searched(Object.values(s).join(' ')));
    return <div className="space-y-6"><header className="flex flex-wrap items-start justify-between gap-4"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[.2em] text-blue-600">Product lifecycle management</p><h1 className="text-3xl font-bold tracking-tight">Every product. One connected journey.</h1><p className="mt-2 text-sm text-muted-foreground">From client insight to delivered product, with a shared view of every handover.</p><p role="status" className="mt-2 text-xs text-muted-foreground">{saved}</p></div><Badge variant="outline">PLM / {module === 'master' ? 'Master PLM' : 'Client PLM'}</Badge></header>
 <nav aria-label="PLM modules" className="flex gap-2 border-b pb-4">{(['master', 'client'] as const).map((m, i) => <Button key={m} variant={module === m ? 'default' : 'outline'} onClick={() => { setModule(m); setQuery(''); }}>{i ? <Users className="mr-2 h-4 w-4"/> : <Layers className="mr-2 h-4 w-4"/>}{i ? 'Client PLM' : 'Master PLM'}</Button>)}</nav>
 <fieldset disabled={!ready} className="min-w-0 space-y-5">
 {module === 'master' ? <>
 <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[['Client products', scopedWorks.length], ['Awaiting approval', scopedWorks.filter(w => w.stage === 2 && w.approval !== 'Approved').length], ['In production', scopedWorks.filter(w => w.stage >= 4 && w.stage <= 8).length], ['Library materials', data.materials.length]].map(([label, count]) => <Panel key={label}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold">{count}</p></Panel>)}</div>
 <div className="flex flex-wrap gap-2">{['Looker', 'Material Library', 'Product Library'].map(v => <Button key={v} variant={view === v ? 'secondary' : 'ghost'} onClick={() => changeView(v)}>{v !== 'Looker' && <Library className="mr-2 h-4 w-4"/>}{v}</Button>)}</div>
 <Panel><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">{view === 'Looker' ? 'Master status view' : view}</h2><p className="mt-1 text-sm text-muted-foreground">{view === 'Looker' ? 'All clients, one live overview. Open a product to work through its lifecycle.' : 'Global Library · POT inside Master PLM · Shared across all units and locations'}</p></div>{view !== 'Looker' && <Button disabled={!canLibrary} onClick={() => { setMaterial(null); setSample(null); setModal(view === 'Material Library' ? 'material' : 'sample'); }}><Plus className="mr-2 h-4 w-4"/>Add new {view === 'Material Library' ? 'material' : 'sample'}</Button>}</div>
 {view !== 'Looker' && <div className="mb-5 flex flex-wrap gap-3"><div className="relative min-w-48 flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input aria-label="Search library" className="pl-9" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, code, composition or supplier…"/></div><select aria-label="Library category" className={selectStyle} value={category} onChange={e=>setCategory(e.target.value)}>{['All',...(view==='Material Library'?categories:sampleTypes)].map(c=><option key={c}>{c}</option>)}</select>{view==='Material Library'&&<><select aria-label="Material availability" className={selectStyle} value={materialStatus} onChange={e=>setMaterialStatus(e.target.value)}>{['All','Available','Under review','Discontinued'].map(s=><option key={s}>{s}</option>)}</select><select aria-label="Sort materials" className={selectStyle} value={materialSort} onChange={e=>setMaterialSort(e.target.value)}>{['Code','Name','Lead time','Price'].map(s=><option key={s}>{s}</option>)}</select></>}</div>}
 {view === 'Looker' ? <PLMStatusBoard key={scope.unit+scope.location} data={visibleData} onOpen={openWork}/> : view === 'Material Library' ? <><p className="mb-3 text-xs text-muted-foreground">{materials.length} of {data.materials.length} materials · {data.materials.filter(m => m.category === 'Fabrics').length} fabrics · Illustrative supplier and price data</p><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{materials.map(m => <button key={m.id} onClick={() => { setMaterial(m); setModal('material'); }} className="group rounded-xl border p-4 text-left transition hover:border-blue-400 hover:shadow-md"><div className="mb-3 flex items-center justify-between"><span className="text-xs font-mono text-muted-foreground">{m.code}</span><Badge variant="outline">{m.category}</Badge></div><h3 className="font-semibold group-hover:text-blue-600">{m.name}</h3><p className="mt-2 text-xs text-muted-foreground">{m.composition}</p><p className="mt-1 text-xs">{m.specification}</p><div className="mt-4 flex justify-between border-t pt-3 text-xs"><span>₹{m.price} / {m.unit}</span><span>{m.lead} days · {m.status}</span></div><p className="mt-2 text-xs text-muted-foreground">{m.supplier}</p></button>)}</div>{!materials.length && <p className="p-8 text-center">No materials found. Try another search or add a material.</p>}</> : <><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{samples.map(s => <button key={s.id} onClick={() => { setSample(s); setModal('sample'); }} className="rounded-lg border p-4 text-left hover:border-blue-400"><Badge variant="outline">{s.category}</Badge><h3 className="mt-3 font-semibold">{s.name}</h3><p className="my-2 text-xs text-muted-foreground">{s.code} · {s.status}</p><p className="text-sm">{s.specification}</p></button>)}</div>{!samples.length && <p className="p-8 text-center">No samples match this search.</p>}</>}
 </Panel></> : <div className="grid items-start gap-5 lg:grid-cols-[240px_minmax(0,1fr)]"><aside className="space-y-3"><div className="flex items-center justify-between"><h2 className="font-semibold">Client directory</h2><Button size="sm" variant="outline" aria-label="Add client" disabled={!canCreate} onClick={() => setModal('client')}><Plus className="h-4 w-4"/></Button></div><Input aria-label="Search clients" placeholder="Search clients…" value={query} onChange={e => setQuery(e.target.value)}/>{scopedClients.filter(c => searched(`${c.name} ${c.code}`)).map(c => <button key={c.id} onClick={() => { setClientId(c.id); const w = scopedWorks.find(w => w.clientId === c.id); setWorkId(w?.id || ''); setStage(w?.stage || 0); }} className={`w-full rounded-lg border p-4 text-left ${c.id === client?.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'bg-card'}`}><p className="text-xs font-mono text-muted-foreground">{c.code}</p><p className="mt-1 text-sm font-semibold">{c.name}</p><p className="mt-2 text-xs text-muted-foreground">{scopedWorks.filter(w => w.clientId === c.id).length} products</p></button>)}</aside><div className="min-w-0 space-y-4"><Panel><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold">{client?.name}</h2><p className="mt-1 text-xs text-muted-foreground">{client?.code} · Client product workspace</p></div><Button disabled={!canCreate || !client} onClick={() => setModal('work')}><Plus className="mr-2 h-4 w-4"/>New product</Button></div><div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-950"><Link className="font-medium text-blue-600 underline" href={`/crm/clients?client=${client?.id}`}>View CRM client history →</Link><p className="mt-1 text-xs text-muted-foreground">Conversations, WhatsApp API, call recordings, meeting minutes and references are owned by CRM. Use these sources in Derivatives.</p></div><div className="mt-4 flex flex-wrap gap-2">{works.map(w => <Button size="sm" key={w.id} variant={work?.id === w.id ? 'default' : 'outline'} onClick={() => { setWorkId(w.id); setStage(w.stage); }}>{w.name}</Button>)}</div></Panel>
 {!work ? <Panel><p className="text-sm text-muted-foreground">No product in this scope. Create a client/product or change the selectors. New products enter Phase 1 — Derivatives.</p></Panel> : <><Panel><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold">{work.name}</h3><p className="mt-1 text-sm text-muted-foreground">{work.quantity} pcs · Due {work.due} · {workScope(work).unit} / {workScope(work).location}</p></div><StageBadge work={work}/></div><div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={()=>setStage(work.stage)}>Jump to current stage</Button>{work.stage>=4&&<Button size="sm" variant="outline" asChild><Link href="/manufacturing/plans">Production handover & MRP →</Link></Button>}</div><div className="mt-5 grid gap-4 sm:grid-cols-2"><WorkProgress work={work}/><WorkProgress work={work} current/></div><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">{lifecycle.map((s, i) => <button key={s.name} onClick={() => setStage(i)} aria-pressed={stage === i} style={{borderTopColor: stageColours[i], borderTopWidth: 4}} className={`rounded-lg border p-3 text-left ${stage === i ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : i < work.stage ? 'bg-emerald-50 dark:bg-emerald-950' : 'bg-muted/30'}`}><p className="text-[10px] uppercase text-muted-foreground">{s.phase}</p><p className="mt-1 text-xs font-semibold">{i < work.stage ? '✓ ' : ''}{s.name}</p></button>)}</div></Panel>
 <Panel><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs text-blue-600">{lifecycle[stage].phase} · {lifecycle[stage].owner}</p><h3 className="mt-1 text-xl font-semibold">{lifecycle[stage].name}</h3></div><Badge variant="outline">{stage < work.stage || work.completed ? 'Complete' : stage === work.stage ? 'In progress' : 'Upcoming'}</Badge></div><p className="mb-4 text-xs text-muted-foreground">Record evidence and complete every task before the next handover. Completed and upcoming stages are read-only.</p>
 <p className="my-3 text-xs text-muted-foreground">{stageEditable ? "Your role can update this product’s current stage." : "Read-only stage for your role. Select the responsible role to record this handover."}</p><HandoverSummary work={work}/><div className="my-4"/>
 <fieldset disabled={stage !== work.stage || work.completed || !stageEditable} className="space-y-3">{stage === 0 && <Field label="Reference CRM history in the Data Pool"><select className={selectStyle + ' w-full'} value="" onChange={e => { const entry = crmEntries.find(x => x.id === e.target.value); if (entry)
                update({ evidence: { ...work.evidence, '0:2': (work.evidence['0:2'] || '') + '\nCRM ' + entry.id + ' · ' + entry.type + ': ' + entry.body } }); }}><option value="">Select a CRM history entry…</option>{crmEntries.filter(x => x.clientId === client.id).map(x => <option key={x.id} value={x.id}>{x.type} · {x.body.slice(0, 75)}</option>)}</select><p className="text-xs text-muted-foreground">Open CRM history to view or add source entries, then return here to reference them.</p></Field>}{lifecycle[stage].tasks.map((task, i) => { const key = taskKey(stage, i); return <div key={key} className="rounded-lg border p-3"><label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={!!work.checks[key]} onChange={e => update({ checks: { ...work.checks, [key]: e.target.checked } })}/>{task}</label><Textarea className="mt-2 min-h-16" aria-label={`${task} evidence`} placeholder={`Record ${task.toLowerCase()} details, reference or result…`} value={work.evidence[key] || ''} onChange={e => update({ evidence: { ...work.evidence, [key]: e.target.value } })}/></div>; })}
 {(stage === 1 || stage === 4) && <Field label="Linked materials / BOM references"><select className={`${selectStyle} w-full`} value="" onChange={e => { if (e.target.value && !work.materials.includes(e.target.value))
                update({ materials: [...work.materials, e.target.value] }); }}><option value="">Select a material from Master PLM…</option>{data.materials.map(m => <option key={m.id} value={m.id}>{m.code} · {m.name}</option>)}</select><div className="flex flex-wrap gap-2">{work.materials.map(id => <Button type="button" size="sm" variant="secondary" key={id} onClick={() => update({ materials: work.materials.filter(x => x !== id) })}>{data.materials.find(m => m.id === id)?.name} ×</Button>)}</div></Field>}
 {stage === 1 && <Field label="Product Library sample references"><select aria-label="Link sample" className={selectStyle + ' w-full'} value="" onChange={e => { if (e.target.value && !work.sampleIds?.includes(e.target.value))
                update({ sampleIds: [...(work.sampleIds || []), e.target.value] }); }}><option value="">Select a sample from the Library POT…</option>{data.samples.map(s => <option key={s.id} value={s.id}>{s.code} · {s.category} · {s.name}</option>)}</select><div className="flex flex-wrap gap-2">{(work.sampleIds || []).map(id => <Button type="button" size="sm" variant="secondary" key={id} onClick={() => update({ sampleIds: work.sampleIds?.filter(x => x !== id) })}>{data.samples.find(s => s.id === id)?.code} ×</Button>)}</div></Field>}
 {stage === 3 && <Field label="CQP quality sign-off"><select className={selectStyle + ' w-full'} value={work.cqp || 'Pending'} onChange={e => update({ cqp: e.target.value })}><option>Pending</option><option>Changes required</option><option>Signed off</option></select></Field>}
 {stage === 2 && <Field label="Client approval decision"><select className={`${selectStyle} w-full`} value={work.approval} onChange={e => update({ approval: e.target.value })}><option>Pending</option><option>Approved</option><option>Rejected</option><option>Changes requested</option></select></Field>}
 {stage === 9 && <div className="grid gap-3 sm:grid-cols-2"><Field label={`Delivered quantity / ${work.quantity} pcs`}><Input type="number" min={0} max={work.quantity} value={work.delivered} onChange={e => update({ delivered: Number(e.target.value) })}/></Field><Field label="Invoice reference"><Input value={work.invoice} onChange={e => update({ invoice: e.target.value })}/></Field><Field label="Delivery geo-tag / location"><Input placeholder="Location and coordinates" value={work.geo} onChange={e => update({ geo: e.target.value })}/></Field></div>}
 </fieldset><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4"><p className="max-w-sm text-xs text-muted-foreground">{stage === 2 ? 'Approval must be Approved to proceed.' : stage === 1 ? 'Link at least one material and one product sample before handover.' : stage === 3 ? 'CQP must be signed off before Production.' : stage === 9 ? 'Full quantity, invoice, location and task evidence are required to complete delivery.' : 'All task checks and evidence are required.'}</p><Button disabled={stage !== work.stage || !canAdvance(work) || !stageEditable} onClick={() => { const next = advance(work); update(next); setStage(next.stage); toast.success(next.completed ? 'Delivery completed' : 'Product advanced to ' + lifecycle[next.stage].name); }}>{work.completed ? 'Delivered' : stage === 9 ? 'Complete delivery' : 'Complete & continue'}<ArrowRight className="ml-2 h-4 w-4"/></Button></div></Panel>
 <Panel><h3 className="mb-4 font-semibold">Ownership & priorities</h3><div className="grid gap-4 sm:grid-cols-2"><Field label="Responsible owner"><Input disabled={!canEditPLM(persona.role)} value={work.owner || ''} placeholder={lifecycle[work.stage].owner} onChange={e => update({owner:e.target.value})}/></Field><Field label="Priority"><select className={selectStyle+' w-full'} disabled={!canEditPLM(persona.role)} value={work.priority || 'Normal'} onChange={e=>update({priority:e.target.value as Work['priority']})}>{['Low','Normal','High','Urgent'].map(p=><option key={p}>{p}</option>)}</select></Field><Field label="Delivery due date"><Input type="date" disabled={!canEditPLM(persona.role)} value={work.due} onChange={e=>{if(e.target.value)update({due:e.target.value})}}/></Field><Field label="Blocker / hold reason"><Input disabled={work.completed || !canEditPLM(persona.role)} value={work.blocker || ''} placeholder="Leave empty when work can proceed" onChange={e=>update({blocker:e.target.value})}/></Field></div><p className="mt-3 text-xs text-muted-foreground">A blocker pauses handover. Clear it when resolved; approval and evidence requirements still apply.</p></Panel>
 <Panel><h3 className="mb-4 font-semibold">Payment & followups</h3><div className="grid gap-4 sm:grid-cols-2"><Field label="Payment status"><select className={`${selectStyle} w-full`} disabled={!canCommercial} value={work.payment} onChange={e => update({ payment: e.target.value })}>{['Not invoiced', 'Awaiting payment', 'Part paid', 'Paid', 'Overdue'].map(p => <option key={p}>{p}</option>)}</select></Field><Field label="Next followup"><Input disabled={!canCommercial} value={work.followup} onChange={e => update({ followup: e.target.value })} placeholder="Owner, action and due date"/></Field></div><h4 className="mb-2 mt-5 text-sm font-medium">Handover history</h4>{work.history.map((h, i) => <p key={i} className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="h-3 w-3"/>{h}</p>)}</Panel></>}
 </div></div>}
 </fieldset>
 <Dialog open={!!modal} onOpenChange={open => { if (!open)
        setModal(null); }}><DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{modal === 'material' ? (material ? 'Material details' : 'Add new material') : modal === 'sample' ? (sample ? 'Sample details' : 'Add new sample') : modal === 'client' ? 'Add client' : 'New client product'}</DialogTitle><DialogDescription>{modal === 'work' ? 'New products begin at Derivatives.' : modal === 'client' ? 'Create a unique client code and name.' : 'Review and edit the shared library record. Changes are saved in this browser.'}</DialogDescription></DialogHeader><form onSubmit={submit} className="space-y-4">
 {(modal === 'material' || modal === 'sample' || modal === 'client') && <Field label="Unique code"><Input name="code" required maxLength={60} defaultValue={modal === 'material' ? material?.code : modal === 'sample' ? sample?.code : ''}/></Field>}
 <Field label="Name"><Input name="name" required maxLength={160} defaultValue={modal === 'material' ? material?.name : modal === 'sample' ? sample?.name : ''}/></Field>
 {(modal === 'material' || modal === 'sample') && <><Field label="Category"><select name="category" className={`${selectStyle} w-full`} defaultValue={modal === 'material' ? material?.category : sample?.category}>{(modal === 'material' ? categories : sampleTypes).map(c => <option key={c}>{c}</option>)}</select></Field><Field label="Technical specification"><Textarea name="specification" required defaultValue={modal === 'material' ? material?.specification : sample?.specification}/></Field></>}
 {modal === 'material' && <><div className="grid gap-4 sm:grid-cols-2">{(['composition', 'colour', 'supplier', 'unit'] as const).map(k => <Field key={k} label={k[0].toUpperCase() + k.slice(1)}><Input name={k} required defaultValue={material?.[k] || ''}/></Field>)}{(['price', 'moq', 'lead'] as const).map(k => <Field key={k} label={k === 'price' ? 'Unit price (INR)' : k === 'moq' ? 'Minimum order quantity' : 'Lead time (days)'}><Input name={k} type="number" required min={k === 'moq' ? 1 : 0} step={k === 'price' ? '0.01' : '1'} defaultValue={material?.[k] ?? 0}/></Field>)}</div><Field label="Status"><select name="status" className={`${selectStyle} w-full`} defaultValue={material?.status || 'Available'}>{['Available', 'Under review', 'Discontinued'].map(s => <option key={s}>{s}</option>)}</select></Field><Field label="Notes / testing requirements"><Textarea name="notes" defaultValue={material?.notes}/></Field></>}
 {modal === 'sample' && <Field label="Status"><select name="status" className={`${selectStyle} w-full`} defaultValue={sample?.status || 'In development'}>{['In development', 'Reference', 'Approved', 'Rejected'].map(s => <option key={s}>{s}</option>)}</select></Field>}
 {modal === 'work' && <><div className="grid gap-4 sm:grid-cols-2"><Field label="Business unit"><select name="unit" className={selectStyle} defaultValue={scope.unit==='All units'?units[0]:scope.unit}>{(scope.unit==='All units'?units:[scope.unit]).map(u=><option key={u}>{u}</option>)}</select></Field><Field label="Product location"><select name="location" className={selectStyle} defaultValue={scope.location==='All locations'?locations[2]:scope.location}>{(scope.location==='All locations'?locations:[scope.location]).map(l=><option key={l}>{l}</option>)}</select></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Delivery due"><Input name="due" type="date" required/></Field><Field label="Order quantity (pcs)"><Input name="quantity" type="number" min={1} step={1} required/></Field></div></>}
 <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setModal(null)}>Cancel</Button><Button disabled={!ready || ((modal === "material" || modal === "sample") ? !canLibrary : !canCreate)} type="submit">Save {modal === 'work' ? 'product' : modal}</Button></div></form></DialogContent></Dialog>
 </div>;
}

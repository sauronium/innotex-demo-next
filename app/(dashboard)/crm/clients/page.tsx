"use client";
import { useEffect, useState, type FormEvent } from 'react';
import {useDemo} from '@/components/demo/demo-context';
import {inScope,workScope} from '@/lib/demo-scope';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { seedClients, seedWorkspace, workspaceKey, type Work, type Client } from '@/lib/plm-workspace';
import { toast } from 'sonner';
type Entry = {
    id: string;
    clientId: string;
    type: string;
    date: string;
    body: string;
};
const types = ['Conversations', 'WhatsApp API', 'Call Recordings', 'Meeting Minutes', 'Client References'];
export default function CRMPage() {
    const {scope}=useDemo();
    const [works,setWorks]=useState<Work[]>(seedWorkspace.works);
    const [clients, setClients] = useState<Client[]>(seedClients);
    const [clientId, setClientId] = useState('apex');
    const [entries, setEntries] = useState<Entry[]>(seedClients.flatMap(c => types.map((type, i) => ({ id: `${c.id}-${i}`, clientId: c.id, type, date: '2026-09-20', body: ['Client requests a winter range with durable construction and consistent sizing.', 'Demo message summary: confirm navy colour and a reflective branding option.', 'Demo call summary: procurement needs material lead times before approval.', 'Review fit sample, validate shrinkage and share the revised BOM at next meeting.', 'Reference: training jacket, four-way stretch knit, concealed zipper.'][i] }))));
    const [ready, setReady] = useState(false);
    const [status, setStatus] = useState('Loading…');
    useEffect(() => { try {
        const workspace = localStorage.getItem(workspaceKey);
        if (workspace) {const parsed=JSON.parse(workspace);setClients(parsed.clients);setWorks(parsed.works);}
        const stored = localStorage.getItem('innotex-crm-history-v1');
        if (stored)
            setEntries(JSON.parse(stored));
        setClientId(new URLSearchParams(window.location.search).get('client') || 'apex');
    }
    catch {
        toast.error('Could not load CRM history');
    } setReady(true); }, []);
    useEffect(() => { if (ready)
        try {
            localStorage.setItem('innotex-crm-history-v1', JSON.stringify(entries));
            setStatus('Saved in this browser · Demo communications');
        }
        catch {
            setStatus('Session only · Storage unavailable');
        } }, [entries, ready]);
    const visibleClients=clients.filter(c=>works.some(w=>w.clientId===c.id&&inScope(workScope(w),scope))||!works.some(w=>w.clientId===c.id));
    const selectedClient=visibleClients.find(c=>c.id===clientId)?.id||visibleClients[0]?.id||'';
    function add(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const f = new FormData(e.currentTarget); const body = String(f.get('body') || '').trim(); if (!body || !selectedClient)
        return; setEntries(v => [{ id: crypto.randomUUID(), clientId:selectedClient, type: String(f.get('type')), date: String(f.get('date')), body }, ...v]); e.currentTarget.reset(); toast.success('CRM history entry saved'); }
    return <div className="space-y-5"><p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Customer relationship management</p><h1 className="text-3xl font-bold">Client history</h1><p className="text-sm text-muted-foreground">CRM owns the relationship record. Reference these entries when developing a product in PLM. WhatsApp and calls are demo summaries; no live connection is configured.</p><p className="text-xs" role="status">{status}</p><div className="flex flex-wrap gap-3"><select aria-label="CRM client" className="rounded-md border bg-background p-2" value={selectedClient} onChange={e => setClientId(e.target.value)}>{visibleClients.map(c => <option key={c.id} value={c.id}>{c.code} · {c.name}</option>)}</select><Button asChild variant="outline"><Link href={"/plm/clients?client=" + selectedClient}>Open Client PLM →</Link></Button></div><div className="grid items-start gap-5 lg:grid-cols-[1fr_320px]"><div className="space-y-3">{!selectedClient&&<p className="rounded-lg border p-5 text-sm">No clients in this unit/location scope.</p>}{entries.filter(e => e.clientId === selectedClient).map(e => <article key={e.id} className="rounded-xl border bg-card p-5"><div className="flex justify-between text-xs text-muted-foreground"><span>{e.type}</span><span>{e.date}</span></div><p className="my-3 text-sm">{e.body}</p><p className="break-all font-mono text-xs text-blue-600">CRM reference: {e.id}</p></article>)}</div><form className="space-y-4 rounded-xl border bg-card p-5" onSubmit={add}><h2 className="font-semibold">Add history entry</h2><label className="block text-sm">Source<select name="type" className="mt-2 w-full rounded-md border bg-background p-2">{types.map(t => <option key={t}>{t}</option>)}</select></label><label className="block text-sm">Date<Input className="mt-2" name="date" type="date" required/></label><label className="block text-sm">Notes / reference<Textarea className="mt-2" name="body" required/></label><Button disabled={!ready || !selectedClient}>Save to CRM</Button></form></div></div>;
}

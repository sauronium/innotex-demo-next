"use client";
import { useDemo } from '@/components/demo/demo-context';
import { inScope,workScope } from '@/lib/demo-scope';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PLMStatusBoard } from '@/components/modules/plm-status-board';
import { seedWorkspace, workspaceKey, type Workspace } from '@/lib/plm-workspace';
export function PLMProductionHandover() {
    const router=useRouter();
    const {scope}=useDemo();
    const [data,setData]=useState<Workspace>(seedWorkspace);
    const [message,setMessage]=useState('Loading client product handovers…');
    useEffect(()=>{
        const refresh=()=>{try{const raw=localStorage.getItem(workspaceKey);if(raw){const saved=JSON.parse(raw);if(saved.version!==2||!Array.isArray(saved.works)||!Array.isArray(saved.clients))throw Error('Invalid workspace');setData(saved);}else setData(seedWorkspace);setMessage('Shared with Client PLM · Saved in this browser');}catch{setMessage('Saved PLM data could not be loaded; sample handovers shown.')}};
        refresh();window.addEventListener('storage',refresh);window.addEventListener('focus',refresh);
        return ()=>{window.removeEventListener('storage',refresh);window.removeEventListener('focus',refresh)};
    },[]);
    return <section className="space-y-5 rounded-xl border bg-card p-5 shadow-sm"><div><p className="text-xs font-semibold uppercase tracking-widest text-blue-600">PLM → Manufacturing</p><h2 className="mt-2 text-xl font-semibold">Production handover & floor readiness</h2><p className="mt-2 text-sm text-muted-foreground">Track client products from Production through Delivery. Open a card to review its BOM references, sourcing evidence, QC and next handover in Client PLM.</p><p role="status" className="mt-2 text-xs text-muted-foreground">{message}</p></div><PLMStatusBoard key={scope.unit+scope.location} data={{...data,works:data.works.filter(w=>inScope(workScope(w),scope))}} productionOnly onOpen={work=>router.push(`/plm/clients?work=${encodeURIComponent(work.id)}`)}/><p className="border-t pt-3 text-xs text-muted-foreground">The MRP example below demonstrates material calculations separately. PLM stage changes do not post stock movements or purchase orders.</p></section>;
}

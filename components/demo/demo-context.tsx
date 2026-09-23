"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { DEMO_PERSONAS } from '@/lib/constants/demo-personas';
import { units,locations,defaultScope,canOpenRoute,fixedSampleScope,inScope,type Scope } from '@/lib/demo-scope';
import { Button } from '@/components/ui/button';
type ContextValue = {persona:typeof DEMO_PERSONAS[number];scope:Scope;ready:boolean;setPersona:(id:string)=>void;setScope:(scope:Scope)=>void};
const Context=createContext<ContextValue|null>(null);
export function DemoProvider({children}:{children:ReactNode}){
 const [personaId,setPersonaId]=useState('management');const [scope,setScopeState]=useState(defaultScope);const [ready,setReady]=useState(false);const [error,setError]=useState('');
 useEffect(()=>{try{const id=localStorage.getItem('innotex_active_persona');if(DEMO_PERSONAS.some(p=>p.id===id))setPersonaId(id!);const raw=localStorage.getItem('innotex-demo-scope-v1');if(raw){const value=JSON.parse(raw);setScopeState({unit:units.includes(value.unit)?value.unit:'All units',location:locations.includes(value.location)?value.location:'All locations'});}}catch{setError('Browser preferences could not be loaded.')}setReady(true)},[]);
 const setPersona=(id:string)=>{if(!DEMO_PERSONAS.some(p=>p.id===id))return;setPersonaId(id);try{localStorage.setItem('innotex_active_persona',id)}catch{setError('Selection applies for this session; browser storage is unavailable.')}};
 const setScope=(value:Scope)=>{setScopeState(value);try{localStorage.setItem('innotex-demo-scope-v1',JSON.stringify(value))}catch{setError('Selection applies for this session; browser storage is unavailable.')}};
 const persona=DEMO_PERSONAS.find(p=>p.id===personaId)!;
 return <Context.Provider value={{persona,scope,ready,setPersona,setScope}}>{error&&<p role="status" className="bg-amber-50 p-2 text-xs text-amber-900">{error}</p>}{children}</Context.Provider>;
}
export function useDemo(){const context=useContext(Context);if(!context)throw Error('DemoProvider is required');return context}
export function DemoBoundary({children}:{children:ReactNode}){
 const {persona,scope,ready,setScope}=useDemo();const path=usePathname();
 if(!ready)return <p className="p-8 text-sm text-muted-foreground">Loading demo context…</p>;
 const permitted=canOpenRoute(persona.role,path);const sample=fixedSampleScope(path);const matches=!sample||inScope(sample,scope);
 return <><div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-3 text-xs"><span><strong>{persona.roleName}</strong> · {scope.unit} · {scope.location}</span><span className="text-muted-foreground">Demo persona and data scope · not database permissions</span></div>{!permitted?<section className="rounded-xl border bg-card p-8"><h1 className="text-xl font-semibold">This module belongs to another role</h1><p className="my-3 text-sm text-muted-foreground">Choose an appropriate demo role above, or open your scoped dashboard.</p><Button asChild><Link href="/dashboard">My dashboard</Link></Button></section>:!matches?<section className="rounded-xl border bg-card p-8"><h1 className="text-xl font-semibold">No sample document in this scope</h1><p className="my-3 text-sm text-muted-foreground">This fixed example belongs to {sample!.unit} / {sample!.location}. PLM and fabric genealogy contain records across units and locations.</p><div className="flex flex-wrap gap-3"><Button onClick={()=>setScope(sample!)}>Use this sample’s scope</Button><Button variant="outline" asChild><Link href="/plm/designs">Scoped PLM</Link></Button><Button variant="outline" asChild><Link href="/inventory/stock">Fabric genealogy</Link></Button></div></section>:children}</>;
}

export function FixedExample({children}:{children:ReactNode}){
 const {scope,setScope}=useDemo();const sample={unit:'Sportswear',location:'Tirupur Garment Unit'};
 return inScope(sample,scope)?<>{children}</>:<section className="rounded-xl border bg-card p-6"><h2 className="font-semibold">MRP calculation example is outside this scope</h2><p className="my-3 text-sm text-muted-foreground">The calculation example belongs to Sportswear / Tirupur Garment Unit. The production handover board above follows your current selection.</p><Button variant="outline" onClick={()=>setScope(sample)}>View the MRP sample scope</Button></section>;
}

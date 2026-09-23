"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DEMO_PERSONAS } from '@/lib/constants/demo-personas';
import { units,locations } from '@/lib/demo-scope';
import { useDemo } from '@/components/demo/demo-context';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
export function Topbar(){
 const {persona,scope,setPersona,setScope,ready}=useDemo();const router=useRouter();
 async function logout(){try{const {error}=await createClient().auth.signOut();if(error){toast.error('Sign out failed. Please retry.');return;}localStorage.removeItem('innotex_active_persona');router.push('/login')}catch{toast.error('Sign out failed. Please retry.')}}
 return <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b bg-card p-3 shadow-sm"><fieldset disabled={!ready} className="flex min-w-0 flex-1 flex-wrap gap-3">{[{label:'Role',value:persona.id,items:DEMO_PERSONAS.map(p=>({value:p.id,label:p.roleName})),change:setPersona},{label:'Unit',value:scope.unit,items:['All units',...units].map(v=>({value:v,label:v})),change:(unit:string)=>setScope({...scope,unit})},{label:'Location',value:scope.location,items:['All locations',...locations].map(v=>({value:v,label:v})),change:(location:string)=>setScope({...scope,location})}].map(field=><label key={field.label} className="min-w-0 text-[11px] font-medium text-muted-foreground">{field.label}<select aria-label={field.label} value={field.value} onChange={e=>field.change(e.target.value)} className="mt-1 block h-9 max-w-full rounded-md border bg-background px-2 text-xs text-foreground sm:max-w-56">{field.items.map(v=><option key={v.value} value={v.value}>{v.label}</option>)}</select></label>)}</fieldset><Button size="sm" variant="ghost" asChild><Link href="/modules">Module map</Link></Button><Button size="sm" variant="outline" onClick={logout}>Sign out</Button></header>;
}

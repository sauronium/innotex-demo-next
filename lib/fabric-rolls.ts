export type RollEvent = {id:string;type:'Received'|'Reserved'|'Issued'|'QC'|'Linked';quantity:number;date:string;actor:string;note:string};
export type FabricRoll = {id:string;code:string;materialId:string;unit:string;location:string;lot:string;batch:string;shade:string;bin:string;grn:string;supplier:string;qc:'Approved'|'Hold'|'Rejected';workId:string;events:RollEvent[]};
export const rollStorageKey='innotex-fabric-rolls-v1';
export function rollBalance(roll:FabricRoll){
 const received=roll.events.filter(e=>e.type==='Received').reduce((n,e)=>n+e.quantity,0);
 const issued=roll.events.filter(e=>e.type==='Issued').reduce((n,e)=>n+e.quantity,0);
 const reserved=roll.events.filter(e=>e.type==='Reserved').reduce((n,e)=>n+e.quantity,0)-issued;
 const remaining=Math.round((received-issued)*100)/100;
 return {received,issued,reserved:Math.round(reserved*100)/100,remaining,available:roll.qc==='Approved'?Math.round((remaining-reserved)*100)/100:0,usedPercent:received?Math.round(issued/received*100):0};
}
export function rollStatus(roll:FabricRoll){const b=rollBalance(roll);return roll.qc!=='Approved'?roll.qc:b.remaining===0?'Consumed':b.reserved>0?'Reserved':'Available'}
export function recordRollAction(roll:FabricRoll,action:'Reserved'|'Issued'|'Approved'|'Hold'|'Rejected',quantity:number,note:string,actor:string,role:string):FabricRoll {
 const qc=['Approved','Hold','Rejected'].includes(action);
 if(!(qc?['MANAGEMENT','ADMIN','QUALITY']:['MANAGEMENT','ADMIN','STORE','PRODUCTION']).includes(role))throw Error('This demo role cannot perform that action.');
 if(!note.trim())throw Error('Enter a reason or document reference.');
 const b=rollBalance(roll);
 if(!qc){
  if(roll.qc!=='Approved')throw Error('QC must approve this roll first.');
  if(!roll.workId)throw Error('Link a client product before reserving or issuing.');
  if(!Number.isFinite(quantity)||quantity<=0||Math.abs(quantity*100-Math.round(quantity*100))>0.00001)throw Error('Enter a positive metre quantity with at most two decimals.');
  if(quantity>(action==='Reserved'?b.available:b.reserved))throw Error(action==='Reserved'?'Quantity exceeds available metres.':'Quantity exceeds reserved metres.');
 }
 return {...roll,qc:qc?action as FabricRoll['qc']:roll.qc,events:[...roll.events,{id:crypto.randomUUID(),type:qc?'QC':action as 'Reserved'|'Issued',quantity:qc?0:quantity,date:new Date().toISOString(),actor,note:qc?`${action}: ${note.trim()}`:note.trim()}]};
}
const unitNames=['Sportswear','Workwear & Uniforms','Sportswear','Protective Clothing','Technical Textiles'];
const workLocations=['Tirupur Garment Unit','Coimbatore Garment Unit','Tirupur Atelier','Coimbatore Garment Unit','Kinathukidavu Composites Centre'];
export const seedRolls:FabricRoll[]=Array.from({length:20},(_,i)=>{
 const index=i%10,received=250+i*10, reserved=i%4===0?100:0, issued=i%4===0?40:0;
 return {id:i===0?'80000000-0000-0000-0000-000000000001':`roll-${i+1}`,code:`R-FAB-${String(i+1).padStart(3,'0')}`,materialId:`mat-${index+1}`,unit:unitNames[index%5],location:i<10?'Coimbatore Central Warehouse':workLocations[index%5],lot:`LOT-${String(Math.floor(i/2)+1).padStart(3,'0')}`,batch:'B-2026-09',shade:['Navy A','Natural B','Charcoal A'][i%3],bin:`FAB-${i<10?'A':'B'}-${i%5+1}`,grn:`GRN-DEMO-${Math.floor(i/2)+1}`,supplier:['Kaveri Textile Mills','Southern Knitworks','Atlas Trims India','GreenWeave Textiles'][index%4],qc:i%7===1?'Hold':i%9===2?'Rejected':'Approved',workId:`work-${index}`,events:[{id:`rec-${i}`,type:'Received',quantity:received,date:'2026-09-20T09:00:00.000Z',actor:'Store demo',note:'Received against supplier lot and incoming GRN'},...(reserved?[{id:`res-${i}`,type:'Reserved' as const,quantity:reserved,date:'2026-09-21T09:00:00.000Z',actor:'Production demo',note:'Allocated against linked PLM product'},{id:`iss-${i}`,type:'Issued' as const,quantity:issued,date:'2026-09-22T09:00:00.000Z',actor:'Store demo',note:'Issued for cutting'}]:[])]};
});

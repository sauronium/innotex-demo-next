import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultScope,inScope,workScope,canOpenRoute,canEditPLM,canManageRolls,canInspectRolls,fixedSampleScope} from '../lib/demo-scope.ts';
import {seedWorkspace} from '../lib/plm-workspace.ts';
import {seedRolls,rollBalance,rollStatus,recordRollAction} from '../lib/fabric-rolls.ts';
import {MODULES,MODULE_FEATURES} from '../lib/constants/module-map.ts';
test('all-unit context includes records; specific unit and location narrow together',()=>{
 assert.ok(seedWorkspace.works.every(w=>inScope(workScope(w),defaultScope)));
 const scope={unit:'Workwear & Uniforms',location:'Coimbatore Garment Unit'};
 const selected=seedWorkspace.works.filter(w=>inScope(workScope(w),scope));assert.ok(selected.length>0);assert.ok(selected.every(w=>workScope(w).unit===scope.unit&&workScope(w).location===scope.location));
 assert.equal(seedWorkspace.works.filter(w=>inScope(workScope(w),{...scope,location:'Tirupur Atelier'})).length,0);
});
test('new product explicit scope overrides legacy fallbacks',()=>{
 assert.deepEqual(workScope({id:'new-product',unit:'Technical Textiles',location:'Kinathukidavu Composites Centre'}),{unit:'Technical Textiles',location:'Kinathukidavu Composites Centre'});
 assert.equal(workScope({id:'work-1'}).unit,'Workwear & Uniforms');
});
test('role navigation and PLM stages have separate permissions',()=>{
 assert.equal(canOpenRoute('SALES','/finance/profitability'),false);assert.equal(canOpenRoute('FINANCE','/finance/profitability'),true);assert.equal(canOpenRoute('ADMIN','/quality/inspections/qi-fabric-01'),true);
 assert.equal(canEditPLM('SALES',0),true);assert.equal(canEditPLM('SALES',3),false);assert.equal(canEditPLM('QUALITY',3),true);assert.equal(canEditPLM('STORE',8),true);assert.equal(canEditPLM('STORE',9),false);assert.equal(canEditPLM('DISPATCH',9),true);
 assert.equal(canManageRolls('QUALITY'),false);assert.equal(canInspectRolls('QUALITY'),true);
});
test('fixed example documents cannot silently appear in another unit',()=>{
 const sample=fixedSampleScope('/sales/orders/example');assert.equal(inScope(sample,{unit:'Technical Textiles',location:'All locations'}),false);assert.equal(inScope(sample,defaultScope),true);assert.equal(fixedSampleScope('/inventory/stock'),null);
});
test('every module exposes a feature list under its title',()=>{
 assert.ok(MODULES.every(m=>MODULE_FEATURES[m.id]?.length>=3));assert.ok(MODULE_FEATURES['plm-sampling'].some(f=>f.includes('Kanban')));assert.ok(MODULE_FEATURES['inventory-traceability'].some(f=>f.includes('movement')));
});
test('seeded rolls refer to existing PLM fabrics and products with matching unit',()=>{
 assert.equal(new Set(seedRolls.map(r=>r.id)).size,20);
 for(const roll of seedRolls){const work=seedWorkspace.works.find(w=>w.id===roll.workId);assert.ok(work);assert.equal(workScope(work).unit,roll.unit);assert.ok(work.materials.includes(roll.materialId));assert.ok(seedWorkspace.materials.some(m=>m.id===roll.materialId&&m.category==='Fabrics'));const b=rollBalance(roll);assert.ok(b.reserved>=0);assert.ok(b.remaining>=b.reserved);assert.ok(b.available>=0);}
});
test('reserve and issue append ledger events and reconcile quantities',()=>{
 const roll=structuredClone(seedRolls[3]);assert.equal(roll.qc,'Approved');const initial=rollBalance(roll);
 const reserved=recordRollAction(roll,'Reserved',60,'Cutting allocation','Store user','STORE');assert.equal(rollBalance(reserved).available,initial.available-60);assert.equal(rollBalance(reserved).remaining,initial.remaining);
 const issued=recordRollAction(reserved,'Issued',25,'CUT-001','Store user','STORE');assert.equal(rollBalance(issued).remaining,initial.remaining-25);assert.equal(rollBalance(issued).reserved,35);assert.equal(rollStatus(issued),'Reserved');assert.equal(issued.events.length,roll.events.length+2);assert.equal(roll.events.length,1);
});
test('held fabric, over-issues, negative quantities and unauthorized actions are rejected',()=>{
 const roll=structuredClone(seedRolls[3]);
 assert.throws(()=>recordRollAction(roll,'Reserved',99999,'Allocation','Store','STORE'),/exceeds/);
 assert.throws(()=>recordRollAction(roll,'Issued',1,'Cutting','Store','STORE'),/reserved/);
 assert.throws(()=>recordRollAction(roll,'Reserved',-1,'Allocation','Store','STORE'),/positive/);
 assert.throws(()=>recordRollAction(roll,'Approved',0,'QC','Sales','SALES'),/role/);
 const held=recordRollAction(roll,'Hold',0,'Shade variance','Quality','QUALITY');assert.equal(rollBalance(held).available,0);assert.throws(()=>recordRollAction(held,'Reserved',1,'Allocation','Store','STORE'),/QC/);
 const released=recordRollAction(held,'Approved',0,'Retest accepted','Quality','QUALITY');assert.equal(rollStatus(released),'Available');assert.ok(rollBalance(released).available>0);
});
test('fractional metres reconcile to two decimals',()=>{
 const roll=structuredClone(seedRolls[3]);const reserved=recordRollAction(roll,'Reserved',0.3,'Test','Store','STORE');const issued=recordRollAction(reserved,'Issued',0.1,'Test','Store','STORE');assert.equal(rollBalance(issued).reserved,0.2);assert.throws(()=>recordRollAction(roll,'Reserved',0.123,'Test','Store','STORE'),/two decimals/);
});

import {approvalScope,canDecideApproval} from '../lib/demo-scope.ts';
test('approval decisions follow role, maker separation, status and current scope',()=>{
 const req={requiredRole:'QUALITY',makerRole:'STORE',makerEmail:'store@example.test',status:'PENDING'};
 const qa={role:'QUALITY',email:'qa@example.test'};
 assert.equal(approvalScope(req).location,'Coimbatore Central Warehouse');
 assert.equal(canDecideApproval(qa,req,defaultScope),true);
 assert.equal(canDecideApproval(qa,req,{unit:'Sportswear',location:'Tirupur Garment Unit'}),false);
 assert.equal(canDecideApproval({role:'SALES',email:'sales@example.test'},req,defaultScope),false);
 assert.equal(canDecideApproval({...qa,email:req.makerEmail},req,defaultScope),false);
 assert.equal(canDecideApproval(qa,{...req,status:'APPROVED'},defaultScope),false);
 assert.equal(canOpenRoute('QUALITY','/admin/approvals'),true);
 assert.equal(canOpenRoute('QUALITY','/admin/users'),false);
});

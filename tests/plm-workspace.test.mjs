import test from 'node:test';
import assert from 'node:assert/strict';
import {seedWorkspace,seedMaterials,newWork,lifecycle,taskKey,canAdvance,advance} from '../lib/plm-workspace.ts';
const filled=(stage)=>{const w=newWork('apex','Test product','2026-12-01',100);w.stage=stage;for(let i=0;i<lifecycle[stage].tasks.length;i++){w.checks[taskKey(stage,i)]=true;w.evidence[taskKey(stage,i)]='Reviewed by owner';}return w;};
test('library contains fifty fabrics and unique detailed material records',()=>{assert.ok(seedMaterials.filter(m=>m.category==='Fabrics').length>=50);assert.equal(new Set(seedMaterials.map(m=>m.code)).size,seedMaterials.length);assert.ok(seedMaterials.every(m=>m.composition&&m.supplier&&m.specification&&m.unit&&m.moq>0));});
test('new client product enters Derivatives and cannot bypass evidence',()=>{const w=newWork('apex','New','2026-12-01',10);assert.equal(w.stage,0);assert.equal(canAdvance(w),false);assert.equal(advance(w),w);const ready=filled(0);assert.equal(advance(ready).stage,1);ready.evidence['0:0']='  ';assert.equal(canAdvance(ready),false);});
test('R&D requires both library references and processing requires approval',()=>{const w=filled(1);assert.equal(canAdvance(w),false);w.materials=['mat-1'];assert.equal(canAdvance(w),false);w.sampleIds=['sample-0-0'];assert.equal(canAdvance(w),true);const processing=filled(2);for(const decision of ['Pending','Rejected','Changes requested']){processing.approval=decision;assert.equal(canAdvance(processing),false);}processing.approval='Approved';assert.equal(advance(processing).stage,3);});
test('CQP sign-off gates production',()=>{const w=filled(3);assert.equal(canAdvance(w),false);w.cqp='Signed off';assert.equal(advance(w).stage,4);});
test('delivery reconciles quantity and completes without creating an extra stage',()=>{const w=filled(9);w.invoice='INV-1';w.geo='Chennai';w.delivered=99;assert.equal(canAdvance(w),false);w.delivered=100;const done=advance(w);assert.equal(done.completed,true);assert.equal(done.stage,9);assert.equal(canAdvance(done),false);assert.equal(w.completed,false);});
test('demo covers every stage and links clients and materials',()=>{assert.equal(new Set(seedWorkspace.works.map(w=>w.stage)).size,10);for(const w of seedWorkspace.works){assert.ok(seedWorkspace.clients.some(c=>c.id===w.clientId));assert.ok(w.materials.every(id=>seedMaterials.some(m=>m.id===id)));}});

import {overallProgress,stageProgress,handoverIssues,dueStatus} from '../lib/plm-workspace.ts';
test('progress ignores unchecked evidence and empty checked tasks',()=>{
 const w=newWork('apex','Progress','2026-09-23',10);
 w.checks['0:0']=true;w.evidence['0:1']='Only evidence';
 assert.equal(stageProgress(w).done,0);assert.equal(overallProgress(w),0);
 w.evidence['0:0']='Confirmed';assert.equal(stageProgress(w).done,1);assert.ok(overallProgress(w)>0);
 for(let s=0;s<lifecycle.length;s++)for(let t=0;t<lifecycle[s].tasks.length;t++){w.checks[taskKey(s,t)]=true;w.evidence[taskKey(s,t)]='Verified';}
 assert.equal(overallProgress(w),99);w.completed=true;assert.equal(overallProgress(w),100);
});
test('a blocker pauses a ready handover until resolved',()=>{
 const w=filled(0);assert.equal(canAdvance(w),true);w.blocker='Client feedback needed';
 assert.equal(canAdvance(w),false);assert.equal(advance(w),w);assert.ok(handoverIssues(w).includes(w.blocker));
 w.blocker=' ';assert.equal(canAdvance(w),true);assert.deepEqual(handoverIssues(w),[]);
});
test('schedule distinguishes overdue, today, next seven days and delivered',()=>{
 const w=newWork('apex','Schedule','2026-09-22',10),today=new Date(2026,8,23,18,0);
 assert.equal(dueStatus(w,today),'Overdue');w.due='2026-09-23';assert.equal(dueStatus(w,today),'Due today');
 w.due='2026-09-30';assert.equal(dueStatus(w,today),'Due this week');w.due='2026-10-01';assert.equal(dueStatus(w,today),'On schedule');
 w.completed=true;assert.equal(dueStatus(w,today),'Delivered');
});
test('handover explanations agree with the gates across all seeded stages',()=>{
 for(const w of seedWorkspace.works) assert.equal(handoverIssues(w).length===0,canAdvance(w));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { newWork, newDevelopment, rdCost, rdIssues, rdHandover, canAdvance } from '../lib/plm-workspace.ts';

function readyWork() {
    const work = newWork('apex', 'Development jacket', '2026-12-01', 100);
    work.stage = 1; work.materials = ['mat-1']; work.sampleIds = ['sample-0-0'];
    const rd = newDevelopment(work);
    Object.assign(rd, { brief: 'Training jacket', sizes: 'S–XL', colours: 'Navy', target: 500, selectedDesign: 'design-1', labour: 50, processing: 20, packaging: 10 });
    rd.decisions = { 'mat-1': { status: 'Selected', reason: 'Meets the development brief' } };
    rd.bom = [{ id: 'row-1', materialId: 'mat-1', quantity: 2, wastage: 10, rate: 100 }];
    rd.designs = [{ id: 'design-1', name: 'Jacket', version: 'V1', reference: 'drawing-001', notes: 'Initial version', colour: '#334155' }];
    rd.discussions = [{ id: 'decision-1', author: 'Sales', body: 'Fit reviewed', reference: 'V1', owner: 'Developer', due: work.due, resolved: true }];
    rd.trials = [{ id: 'trial-1', name: 'Fit', expected: 'Comfortable movement', actual: 'Comfortable movement', evidence: 'fit-review-001', status: 'Pass', action: '' }];
    rd.samples = [{ id: 'sample-1', version: 1, status: 'Ready for presentation', measurements: 'Chest 104 cm', feedback: 'Fit accepted for presentation', reference: 'photo-001', materials: ['mat-1'], design: 'design-1', cost: rdCost(rd), date: '2026-09-23' }];
    work.rd = rd;
    return work;
}

test('trial cost includes consumption, waste and all per-unit charges', () => {
    const work = readyWork();
    assert.equal(rdCost(work.rd), 300);
    assert.deepEqual(rdIssues(work.rd), []);
});
test('handover records evidence and moves the same product to Processing', () => {
    const work = readyWork();
    const next = rdHandover(work);
    assert.equal(next.stage, 2);
    assert.equal(next.id, work.id);
    assert.equal(work.stage, 1);
    assert.equal(Object.keys(work.checks).length, 0);
    assert.equal(Object.values(next.checks).filter(Boolean).length, 5);
    assert.match(next.evidence['1:4'], /300/);
    assert.equal(next.approval, 'Pending');
});
test('structured development checks cannot be bypassed through legacy task checks', () => {
    const work = readyWork();
    for (let i = 0; i < 5; i++) { work.checks[`1:${i}`] = true; work.evidence[`1:${i}`] = 'Reviewed'; }
    assert.equal(canAdvance(work), true);
    work.rd.trials[0].status = 'Rework';
    assert.equal(canAdvance(work), false);
    assert.equal(rdHandover(work), work);
});
test('cost and material changes require a fresh sample snapshot', () => {
    const work = readyWork();
    work.rd.bom[0].rate = 150;
    assert.ok(rdIssues(work.rd).some(s => s.includes('new sample revision')));
    assert.equal(work.rd.samples[0].cost, 300);
    work.rd.samples.push({ ...work.rd.samples[0], id: 'sample-2', version: 2, cost: rdCost(work.rd) });
    assert.deepEqual(rdIssues(work.rd), []);
    work.rd.decisions['mat-2'] = { status: 'Selected', reason: 'Additional trim' };
    assert.ok(rdIssues(work.rd).some(s => s.includes('new sample revision')));
});
test('missing references, blockers and over-target cost decisions prevent handover', () => {
    for (const mutate of [w => { w.sampleIds = []; }, w => { w.blocker = 'Client clarification'; }, w => { w.rd.target = 100; }, w => { w.rd.discussions[0].resolved = false; }, w => { w.rd.samples[0].reference = ''; }]) {
        const work = readyWork(); mutate(work); assert.equal(rdHandover(work), work);
    }
    const work = readyWork(); work.rd.target = 100; work.rd.costNote = 'Proceed with cost variance for client presentation';
    assert.equal(rdHandover(work).stage, 2);
});

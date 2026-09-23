export const lifecycle = [
    { name: 'Derivatives', phase: 'Phase 1', owner: 'Merchandising', tasks: ['Spec Sheet', 'Inspirations', 'Data Pool'] },
    { name: 'R&D', phase: 'Phase 2', owner: 'Design & development', tasks: ['Library References', 'Group Discussions', 'Designs & File Inventory', 'Samples', 'BOM'] },
    { name: 'Processing', phase: 'Review', owner: 'Client & merchandising', tasks: ['Client Presentation', 'Approval Module', 'Notes'] },
    { name: 'Product Evaluation', phase: 'Validation', owner: 'Quality', tasks: ['Final Samples', 'Critical Quality Points (CQP)'] },
    { name: 'Production', phase: 'Phase 3', owner: 'Production planning', tasks: ['BOM', 'Sourcing Status', 'QC', 'Project Inventory'] },
    { name: 'Cutting', phase: 'Production', owner: 'Cutting floor', tasks: ['Spread & Test', 'Cutting', 'Bundling & Numbering', 'Layout Panelling', 'QC'] },
    { name: 'Stitching', phase: 'Production', owner: 'Sewing floor', tasks: ['Sub Assembly', 'Overlock & Flatlock', 'Print / Embroidery', 'QC'] },
    { name: 'Finishing', phase: 'Production', owner: 'Finishing floor', tasks: ['Trimming & De-Greasing', 'Measure Check', 'Pressing', 'Tagging & Numbering', 'Packing', 'QC'] },
    { name: 'Inventory', phase: 'Production', owner: 'Stores', tasks: ['Bar Tagging', 'Lot Management', 'Lot Tracking'] },
    { name: 'Delivery', phase: 'Phase 4', owner: 'Dispatch', tasks: ['Quantity', 'Invoice', 'Geo-Tagging', 'Notes'] },
];
export const categories = ['Fabrics', 'Accessories', 'Zippers', 'Seams', 'Buttons', 'Threads', 'Labels', 'Packaging'];
export const sampleTypes = ['Client Samples', 'R&D Samples', 'Delivery Samples', 'Purchase Samples', 'Generic Samples', 'Reference Samples'];
export type Material = {
    id: string;
    code: string;
    name: string;
    category: string;
    composition: string;
    specification: string;
    colour: string;
    supplier: string;
    unit: string;
    price: number;
    moq: number;
    lead: number;
    status: string;
    notes: string;
};
export type Client = {
    id: string;
    code: string;
    name: string;
};
export type ProductSample = {
    id: string;
    code: string;
    name: string;
    category: string;
    specification: string;
    status: string;
};
export type Work = {
    unit?: string;
    location?: string;
    owner?: string;
    priority?: "Low" | "Normal" | "High" | "Urgent";
    blocker?: string;
    id: string;
    clientId: string;
    name: string;
    due: string;
    quantity: number;
    stage: number;
    completed: boolean;
    checks: Record<string, boolean>;
    evidence: Record<string, string>;
    materials: string[];
    sampleIds?: string[];
    cqp?: string;
    approval: string;
    payment: string;
    followup: string;
    invoice: string;
    geo: string;
    delivered: number;
    history: string[];
};
export type Workspace = {
    version: 2;
    clients: Client[];
    works: Work[];
    materials: Material[];
    samples: ProductSample[];
};
export const workspaceKey = 'innotex-plm-lifecycle-v2';
export const taskKey = (stage: number, task: number) => `${stage}:${task}`;
export function canAdvance(work: Work) {
    if (work.completed || work.blocker?.trim() || !lifecycle[work.stage])
        return false;
    if (!lifecycle[work.stage].tasks.every((_, i) => work.checks[taskKey(work.stage, i)] && work.evidence[taskKey(work.stage, i)]?.trim()))
        return false;
    if (work.stage === 1 && !work.materials.length)
        return false;
    if (work.stage === 3 && work.cqp !== 'Signed off')
        return false;
    if (work.stage === 1 && !work.sampleIds?.length)
        return false;
    if (work.stage === 2 && work.approval !== 'Approved')
        return false;
    if (work.stage === 9 && (!work.invoice.trim() || !work.geo.trim() || work.delivered !== work.quantity))
        return false;
    return true;
}
export function advance(work: Work): Work {
    if (!canAdvance(work))
        return work;
    return { ...work, stage: Math.min(9, work.stage + 1), completed: work.stage === 9, history: [...work.history, `${lifecycle[work.stage].name} completed · ${new Date().toLocaleDateString('en-IN')}`] };
}
export function newWork(clientId: string, name: string, due: string, quantity: number): Work {
    return { id: crypto.randomUUID(), clientId, name, due, quantity, stage: 0, completed: false, checks: {}, evidence: {}, materials: [], approval: 'Pending', payment: 'Not invoiced', followup: '', invoice: '', geo: '', delivered: 0, history: ['Entered Derivatives from CRM client history'] };
}
const fabrics: [
    string,
    string,
    string
][] = [
    ['Cotton single jersey', '100% cotton', '180 GSM / 160 cm / single knit'], ['Organic cotton jersey', '100% organic cotton', '160 GSM / 160 cm / single knit'], ['Recycled performance knit', '88% recycled polyester / 12% elastane', '220 GSM / 152 cm / four-way stretch'], ['Poly-cotton workwear twill', '65% polyester / 35% cotton', '240 GSM / 150 cm / 2:1 twill'], ['PU-coated polyester', '100% polyester / PU coating', '300 GSM / 150 cm / water resistant'], ['Cotton interlock', '100% cotton', '220 GSM / 160 cm / double knit'], ['Cotton pique', '100% cotton', '200 GSM / 160 cm / pique'], ['Polyester birdseye mesh', '100% polyester', '140 GSM / 152 cm / breathable'], ['Nylon power mesh', '85% nylon / 15% elastane', '120 GSM / 150 cm / stretch mesh'], ['French terry', '80% cotton / 20% polyester', '280 GSM / 180 cm / loopback'], ['Brushed fleece', '70% cotton / 30% polyester', '320 GSM / 180 cm / brushed'], ['Micro polar fleece', '100% polyester', '240 GSM / 150 cm / anti-pill'], ['Cotton rib 1x1', '95% cotton / 5% elastane', '240 GSM / 100 cm / tubular'], ['Cotton rib 2x2', '95% cotton / 5% elastane', '280 GSM / 100 cm / tubular'], ['Cotton poplin', '100% cotton', '120 GSM / 147 cm / plain weave'], ['Oxford shirting', '60% cotton / 40% polyester', '150 GSM / 150 cm / basket weave'], ['Cotton denim', '100% cotton', '340 GSM / 150 cm / 3:1 twill'], ['Stretch denim', '98% cotton / 2% elastane', '300 GSM / 150 cm / stretch twill'], ['Linen plain weave', '100% linen', '170 GSM / 140 cm / plain weave'], ['Linen cotton blend', '55% linen / 45% cotton', '160 GSM / 140 cm / plain weave'], ['Viscose challis', '100% viscose', '110 GSM / 140 cm / soft drape'], ['Lyocell twill', '100% lyocell', '180 GSM / 145 cm / twill'], ['Modal jersey', '95% modal / 5% elastane', '170 GSM / 160 cm / knit'], ['Bamboo viscose jersey', '95% bamboo viscose / 5% elastane', '200 GSM / 160 cm / knit'], ['Nylon ripstop', '100% nylon', '90 GSM / 150 cm / grid weave'], ['Polyester taffeta lining', '100% polyester', '65 GSM / 150 cm / plain weave'], ['Satin lining', '100% polyester', '95 GSM / 150 cm / satin'], ['Softshell laminate', '94% polyester / 6% elastane', '310 GSM / 145 cm / three-layer'], ['Waterproof shell', '100% polyester / membrane', '150 GSM / 145 cm / laminated'], ['Canvas duck', '100% cotton', '350 GSM / 150 cm / duck weave'], ['Cotton drill', '100% cotton', '260 GSM / 150 cm / drill'], ['Stretch woven suiting', '64% polyester / 32% viscose / 4% elastane', '210 GSM / 150 cm / twill'], ['Merino jersey', '100% merino wool', '180 GSM / 150 cm / fine knit'], ['Wool blend suiting', '50% wool / 50% polyester', '240 GSM / 150 cm / twill'], ['Flame-resistant twill', '93% meta-aramid / 5% para-aramid / 2% antistatic', '200 GSM / 150 cm / test before use'], ['Antistatic workwear', '64% polyester / 35% cotton / 1% conductive fibre', '240 GSM / 150 cm / grid'], ['High visibility knit', '100% polyester', '160 GSM / 152 cm / fluorescent'], ['Compression tricot', '72% nylon / 28% elastane', '250 GSM / 150 cm / warp knit'], ['Swim tricot', '80% nylon / 20% elastane', '190 GSM / 150 cm / warp knit'], ['Spacer mesh', '100% polyester', '280 GSM / 150 cm / 3D knit'], ['Waffle knit', '100% cotton', '230 GSM / 160 cm / waffle'], ['Seersucker', '100% cotton', '130 GSM / 145 cm / puckered weave'], ['Double gauze', '100% cotton', '125 GSM / 140 cm / double layer'], ['Corduroy 16 wale', '100% cotton', '280 GSM / 145 cm / cut pile'], ['Velour', '80% cotton / 20% polyester', '260 GSM / 160 cm / pile knit'], ['Scuba knit', '95% polyester / 5% elastane', '300 GSM / 150 cm / double knit'], ['Ponte roma', '65% viscose / 30% nylon / 5% elastane', '320 GSM / 150 cm / double knit'], ['Jacquard knit', '70% polyester / 30% cotton', '220 GSM / 160 cm / jacquard'], ['Quilted lining', '100% polyester', '180 GSM / 145 cm / padded'], ['Recycled stretch woven', '92% recycled polyester / 8% elastane', '150 GSM / 150 cm / stretch woven']
];
const trims: [
    string,
    string,
    string,
    string
][] = [['Reflective tape', 'Accessories', 'Glass bead / polyester', '50 mm sew-on'], ['Drawcord', 'Accessories', '100% polyester', '5 mm braided'], ['Elastic waistband', 'Accessories', 'Polyester / rubber', '40 mm woven'], ['Hook and loop', 'Accessories', '100% nylon', '25 mm paired'], ['Coil zipper', 'Zippers', 'Polyester coil / nylon tape', '#5 open end / 65 cm'], ['Metal zipper', 'Zippers', 'Brass / cotton tape', '#5 closed end / 18 cm'], ['Invisible zipper', 'Zippers', 'Nylon coil', '#3 closed end / 22 cm'], ['Overlock seam', 'Seams', 'Polyester thread', '504 / 3-thread / 5 mm'], ['Flatlock seam', 'Seams', 'Textured polyester', '607 / 6-thread / 6 mm'], ['Lockstitch seam', 'Seams', 'Core-spun polyester', '301 / 10 SPI'], ['Corozo button', 'Buttons', 'Corozo nut', '18L / four-hole'], ['Resin button', 'Buttons', 'Polyester resin', '20L / four-hole'], ['Snap fastener', 'Buttons', 'Nickel-free brass', '15 mm / four-part'], ['Core spun thread', 'Threads', 'Polyester core / cotton wrap', 'Tex 40 / 5000 m cone'], ['Textured looper thread', 'Threads', '100% polyester', 'Tex 24 / 5000 m cone'], ['Woven brand label', 'Labels', 'Recycled polyester', '50 x 20 mm / end fold'], ['Care label', 'Labels', 'Polyester satin', '30 x 70 mm / wash symbols'], ['Size label', 'Labels', 'Polyester damask', '15 x 20 mm'], ['Compostable garment bag', 'Packaging', 'PLA blend', '35 x 45 cm / 50 micron'], ['Recycled shipping carton', 'Packaging', 'Recycled kraft paper', '60 x 40 x 40 cm / 5 ply']];
export const seedMaterials: Material[] = [...fabrics.map(([name, composition, specification]) => ({ name, composition, specification, category: 'Fabrics' })), ...trims.map(([name, category, composition, specification]) => ({ name, category, composition, specification }))].map((m, i) => ({ ...m, id: `mat-${i + 1}`, code: `MAT-${String(i + 1).padStart(3, '0')}`, colour: ['Navy', 'Natural', 'Charcoal', 'White', 'Black'][i % 5], supplier: ['Kaveri Textile Mills', 'Southern Knitworks', 'Atlas Trims India', 'GreenWeave Textiles'][i % 4], unit: m.category === 'Fabrics' ? 'm' : m.category === 'Seams' ? 'm' : m.category === 'Threads' ? 'cone' : 'pcs', price: m.category === 'Fabrics' ? 120 + i * 7 : 8 + (i % 15) * 6, moq: m.category === 'Fabrics' ? 300 : 500, lead: 7 + (i % 4) * 7, status: i % 9 === 0 ? 'Under review' : 'Available', notes: 'Illustrative demo specification and pricing. Confirm shade, shrinkage and applicable test results with the supplier before purchase.' }));
export const seedClients: Client[] = [{ id: 'apex', code: 'CLI-001', name: 'Apex Endurance Sports Pvt Ltd' }, { id: 'lt', code: 'CLI-002', name: 'L&T Heavy Engineering' }, { id: 'summit', code: 'CLI-003', name: 'Summit Athletics Club' }, { id: 'north', code: 'CLI-004', name: 'Northstar Outdoor' }, { id: 'urban', code: 'CLI-005', name: 'Urban Loom Retail' }];
export const seedWorkspace: Workspace = { version: 2, clients: seedClients, materials: seedMaterials, samples: sampleTypes.flatMap((category, i) => ['Training jacket', 'Utility overshirt'].map((name, j) => ({ id: `sample-${i}-${j}`, code: `SMP-${i + 1}${j + 1}`, name, category, specification: j ? 'Cotton drill · 260 GSM · S–3XL · reinforced pockets' : 'Recycled performance knit · 220 GSM · XS–XXL · reflective logo', status: i === 1 ? 'In development' : 'Reference' }))), works: [] };
seedWorkspace.works = ['Winter training jacket', 'Industrial coverall', 'Club teamwear', 'Trail shell', 'Essential overshirt', 'Travel fleece', 'Team polo', 'Utility trousers', 'Performance shorts', 'Training vest'].map((name, i) => ({ id: `work-${i}`, clientId: seedClients[i % 5].id, name, due: `2026-${i < 5 ? '10' : '11'}-${String(10 + i).padStart(2, '0')}`, quantity: (i + 1) * 100, stage: i, completed: false, checks: Object.fromEntries(lifecycle.slice(0, i).flatMap((s, n) => s.tasks.map((_, t) => [taskKey(n, t), true]))), evidence: Object.fromEntries(lifecycle.slice(0, i).flatMap((s, n) => s.tasks.map((task, t) => [taskKey(n, t), `${task} reviewed and recorded in demo handover.`]))), materials: [`mat-${i + 1}`], sampleIds: i > 1 ? ['sample-0-0'] : [], cqp: i > 3 ? 'Signed off' : 'Pending', approval: i > 2 ? 'Approved' : 'Pending', payment: i === 9 ? 'Awaiting payment' : 'Not invoiced', followup: i === 2 ? 'Client presentation approval due 25 September' : '', invoice: i === 9 ? 'INV-DEMO-010' : '', geo: i === 9 ? 'Chennai · 13.0827, 80.2707' : '', delivered: 0, history: [`Demo project currently at ${lifecycle[i].name}`] }));

// Shared display metrics: a task counts only when its check and evidence are present.
export const stageColours = ['#475569', '#7c3aed', '#d97706', '#db2777', '#2563eb', '#0891b2', '#4f46e5', '#9333ea', '#0d9488', '#059669'];
export function stageProgress(work: Work, stage = work.stage) {
    const tasks = lifecycle[stage]?.tasks || [];
    const done = tasks.filter((_, i) => work.checks[taskKey(stage, i)] && work.evidence[taskKey(stage, i)]?.trim()).length;
    return { done, total: tasks.length, percent: tasks.length ? Math.round(done / tasks.length * 100) : 0 };
}
export function overallProgress(work: Work) {
    if (work.completed) return 100;
    const done = lifecycle.reduce((sum, _, stage) => sum + stageProgress(work, stage).done, 0);
    return Math.min(99, Math.round(done / lifecycle.reduce((sum, s) => sum + s.tasks.length, 0) * 100));
}
export function handoverIssues(work: Work): string[] {
    if (work.completed) return [];
    const issues: string[] = [];
    const progress = stageProgress(work);
    if (work.blocker?.trim()) issues.push(work.blocker.trim());
    if (progress.done < progress.total) issues.push(`${progress.total - progress.done} tasks need checks or evidence`);
    if (work.stage === 1 && !work.materials.length) issues.push('Link a material');
    if (work.stage === 1 && !work.sampleIds?.length) issues.push('Link a product sample');
    if (work.stage === 2 && work.approval !== 'Approved') issues.push('Client approval required');
    if (work.stage === 3 && work.cqp !== 'Signed off') issues.push('CQP sign-off required');
    if (work.stage === 9) {
        if (work.delivered !== work.quantity) issues.push('Reconcile delivery quantity');
        if (!work.invoice.trim()) issues.push('Add invoice reference');
        if (!work.geo.trim()) issues.push('Add delivery location');
    }
    return issues;
}
export function dueStatus(work: Work, today = new Date()) {
    if (work.completed) return 'Delivered';
    const due = new Date(`${work.due}T00:00:00`);
    const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const days = Math.round((due.getTime() - current.getTime()) / 86400000);
    if (!Number.isFinite(days)) return 'No due date';
    return days < 0 ? 'Overdue' : days === 0 ? 'Due today' : days <= 7 ? 'Due this week' : 'On schedule';
}

// Seed varied work-in-progress so a fresh demo illustrates the operating views.
seedWorkspace.works = seedWorkspace.works.map((work, i) => {
    const current = lifecycle[work.stage];
    const count = i === 0 || i === 4 ? current.tasks.length : Math.min(1, current.tasks.length);
    return {
        ...work,
        owner: ['Merchandising lead', 'Development lead', 'Account manager', 'Quality lead', 'Production planner'][i % 5],
        priority: i === 2 ? 'Urgent' : i === 6 ? 'High' : 'Normal',
        blocker: i === 2 ? 'Awaiting client colourway decision' : i === 6 ? 'Embroidery strike-off needs correction' : '',
        checks: { ...work.checks, ...Object.fromEntries(current.tasks.slice(0, count).map((_, n) => [taskKey(work.stage, n), true])) },
        evidence: { ...work.evidence, ...Object.fromEntries(current.tasks.slice(0, count).map((task, n) => [taskKey(work.stage, n), `${task} reviewed for this demonstration.`])) },
    };
});

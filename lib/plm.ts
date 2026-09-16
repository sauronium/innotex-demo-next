export const productTypes = ["Performance apparel", "Industrial workwear", "Technical textiles"] as const;
export type ProductType = typeof productTypes[number];
export type Spec = { fabric: string; colour: string; sizes: string; branding: string; notes: string };
export type SKU = Spec & { id: string; code: string; name: string; type: ProductType; revision: number };
export type Sample = { id: string; kind: string; result: "Pending" | "Approved" | "Rejected"; notes: string; reviewer: string; date: string };
export type Revision = { revision: number; spec: Spec; checks: string[]; samples: Sample[]; released: boolean };
export type ProjectProduct = Revision & { id: string; skuId: string; baseRevision: number; base: Spec; history?: Revision[] };
export type Project = { id: string; name: string; client: string; due: string; season: string; products: ProjectProduct[] };
export type PLMState = { version: 1; skus: SKU[]; projects: Project[] };
export const storageKey = "innotex-plm-workbench-v1";
export const uid = () => crypto.randomUUID();
export function stages(type: ProductType) {
  const specialty = type === "Performance apparel"
    ? ["Stretch recovery and moisture management validated", "Fit, mobility and seam comfort approved"]
    : type === "Industrial workwear"
      ? ["Client safety requirements and visibility tests reviewed", "Reinforcement, pocket placement and movement approved"]
      : ["Coating, tensile strength and end-use tests reviewed", "Dimensions, bonding and durability approved"];
  return [
    { name: "Client brief", owner: "Merchandising", tasks: ["End use, target price and quantity agreed", "Size range, delivery and client requirements captured"] },
    { name: "Design development", owner: "Design team", tasks: ["Concepts, colourways and artwork reviewed", "Technical drawings and construction details prepared"] },
    { name: "Fabric & trims", owner: "Sourcing", tasks: ["Composition, GSM, finish and supplier selected", "Swatches, lab dips and trims approved"] },
    { name: "Design lock-in", owner: "Client / Design lead", tasks: ["Client design approval recorded", "Tech pack, measurements and material specification frozen"] },
    { name: "Prototype & fit", owner: "Tirupur Atelier", tasks: ["Pattern and first prototype completed", specialty[1]] },
    { name: "Testing & validation", owner: "Quality lead", tasks: [specialty[0], "Wash, shrinkage and colourfastness results accepted"] },
    { name: "Costing & pre-production", owner: "Merchandising / Production", tasks: ["Consumption, BOM and target costing approved", "Size set and pre-production sample signed off"] },
    { name: "Production handover", owner: "Production lead", tasks: ["Final tech pack and approved sample handed over", "Routing, quality plan and delivery schedule confirmed"] },
  ];
}
export const checkKey = (stage: number, task: number) => `${stage}-${task}`;
export function canRelease(product: ProjectProduct) {
  return Array.from({ length: 8 }, (_, i) => [checkKey(i, 0), checkKey(i, 1)]).flat().every(key => product.checks.includes(key))
    && product.samples.at(-1)?.result === "Approved";
}
export function instantiate(sku: SKU): ProjectProduct {
  const { fabric, colour, sizes, branding, notes } = sku;
  const spec = { fabric, colour, sizes, branding, notes };
  return { id: uid(), skuId: sku.id, baseRevision: sku.revision, base: { ...spec }, spec: { ...spec }, revision: 1, checks: [], samples: [], released: false };
}
export function reviseProduct(product: ProjectProduct, spec: Spec): ProjectProduct {
  const { revision, spec: previousSpec, checks, samples, released } = product;
  return { ...product, spec, revision: revision + 1, checks: [], samples: [], released: false,
    history: [...(product.history || []), { revision, spec: previousSpec, checks, samples, released }] };
}
export const initialState: PLMState = {
  version: 1,
  skus: [
    { id: "sku-jacket", code: "SP-JKT-01", name: "Performance training jacket", type: "Performance apparel", revision: 1, fabric: "Recycled polyester / elastane knit · 220 GSM", colour: "Navy", sizes: "XS–XXL", branding: "Reflective chest logo", notes: "Four-way stretch; moisture-wicking finish; coil zipper." },
    { id: "sku-coverall", code: "WRK-COV-01", name: "High-visibility industrial coverall", type: "Industrial workwear", revision: 1, fabric: "Poly-cotton twill · 240 GSM", colour: "Safety orange", sizes: "S–3XL", branding: "Client chest patch", notes: "Reinforced knees, utility pockets and reflective tape." },
    { id: "sku-shell", code: "TEC-SHL-01", name: "Coated protective textile panel", type: "Technical textiles", revision: 1, fabric: "PU-coated woven polyester · 300 GSM", colour: "Charcoal", sizes: "1.5 × 2 m", branding: "Printed batch label", notes: "Bonded seams; validate tensile strength for client end use." },
  ],
  projects: [],
};
const jacket = initialState.skus[0];
const coverall = initialState.skus[1];
function seededProduct(sku: SKU, id: string, completed: number): ProjectProduct {
  const { fabric, colour, sizes, branding, notes } = sku;
  const spec = { fabric, colour, sizes, branding, notes };
  return { id, skuId: sku.id, baseRevision: 1, base: { ...spec }, spec: { ...spec }, revision: 1, checks: Array.from({ length: completed }, (_, i) => checkKey(Math.floor(i / 2), i % 2)), samples: [], released: false };
}
const apex = seededProduct(jacket, "apex-jacket", 16);
apex.samples = [
  { id: "sample-1", kind: "Prototype", result: "Rejected", notes: "Zipper seam puckering; reflective tape alignment off by 4 mm.", reviewer: "Customer QC", date: "2026-01-20" },
  { id: "sample-2", kind: "Pre-production", result: "Approved", notes: "Stabilising tape added; fit and construction signed off.", reviewer: "Dr. Meenakshi Iyer", date: "2026-02-08" },
];
apex.released = true;
const club = seededProduct(jacket, "club-jacket", 4);
club.spec = { ...club.spec, colour: "Forest green", branding: "Embroidered club crest", notes: "Same core construction; contrast zipper for club collection." };
initialState.projects = [
  { id: "db-apx-01", name: "Apex winter training collection", client: "Apex Endurance Sports Pvt Ltd", due: "2026-11-15", season: "Autumn / Winter 2026", products: [apex] },
  { id: "db-wrk-02", name: "Industrial uniform programme", client: "L&T Heavy Engineering", due: "2026-12-01", season: "Annual Contract 2026", products: [seededProduct(coverall, "work-coverall", 8)] },
  { id: "db-club-03", name: "Club teamwear collection", client: "Summit Athletics Club", due: "2026-12-10", season: "Winter 2026", products: [club] },
];

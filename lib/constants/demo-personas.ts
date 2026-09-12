export interface DemoPersona {
  id: string;
  email: string;
  name: string;
  role: string;
  roleName: string;
  department: string;
  description: string;
  avatarColor: string;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
}

export const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_SEED_PASSWORD || "Demo@12345";

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "management",
    email: "management@demo.innotex.example",
    name: "Vikram Rathore",
    role: "MANAGEMENT",
    roleName: "Executive Management",
    department: "Executive",
    description: "Business KPIs, company governance, bulk release & threshold approvals",
    avatarColor: "bg-purple-600 text-white",
    badgeVariant: "default",
  },
  {
    id: "sales",
    email: "sales@demo.innotex.example",
    name: "Ananya Deshmukh",
    role: "SALES",
    roleName: "Sales & Client Lead",
    department: "Commercial",
    description: "Customer enquiries, quotations, sales order booking, customer specifications",
    avatarColor: "bg-blue-600 text-white",
    badgeVariant: "secondary",
  },
  {
    id: "purchase",
    email: "purchase@demo.innotex.example",
    name: "Rajesh Kulkarni",
    role: "PURCHASE",
    roleName: "Procurement Manager",
    department: "Supply Chain",
    description: "Material shortages, RFQs, supplier quote comparison, purchase orders",
    avatarColor: "bg-emerald-600 text-white",
    badgeVariant: "secondary",
  },
  {
    id: "store",
    email: "store@demo.innotex.example",
    name: "Muthu Vel",
    role: "STORE",
    roleName: "Warehouse & Inward Store",
    department: "Logistics",
    description: "Gate entry, GRN inward, fabric roll genealogy, multi-bin inventory ledgers",
    avatarColor: "bg-amber-600 text-white",
    badgeVariant: "outline",
  },
  {
    id: "production",
    email: "production@demo.innotex.example",
    name: "Karthik Sundaram",
    role: "PRODUCTION",
    roleName: "Production Planner",
    department: "Manufacturing",
    description: "BOM revision trees, MRP explosions, production scheduling, shopfloor releases",
    avatarColor: "bg-indigo-600 text-white",
    badgeVariant: "default",
  },
  {
    id: "operator",
    email: "operator@demo.innotex.example",
    name: "Selvam P",
    role: "OPERATOR",
    roleName: "Shopfloor Operator",
    department: "Manufacturing Operations",
    description: "Stage execution (Cutting, Stitching, Finishing), input/good/scrap tracking",
    avatarColor: "bg-teal-600 text-white",
    badgeVariant: "outline",
  },
  {
    id: "quality",
    email: "quality@demo.innotex.example",
    name: "Dr. Meenakshi Iyer",
    role: "QUALITY",
    roleName: "Quality Assurance Lead",
    department: "Quality Assurance",
    description: "Incoming fabric QC, in-process inspections, customer parameter checks, disposition",
    avatarColor: "bg-rose-600 text-white",
    badgeVariant: "destructive",
  },
  {
    id: "dispatch",
    email: "dispatch@demo.innotex.example",
    name: "Senthil Nathan",
    role: "DISPATCH",
    roleName: "Logistics & Dispatch Lead",
    department: "Logistics",
    description: "Pick/packing lists, partial shipments, delivery challans, LR & POD capture",
    avatarColor: "bg-cyan-600 text-white",
    badgeVariant: "secondary",
  },
  {
    id: "finance",
    email: "finance@demo.innotex.example",
    name: "Srinivasan Raman",
    role: "FINANCE",
    roleName: "Finance & Accounts Head",
    department: "Finance & Controlling",
    description: "Tax invoices, GST calculation, customer payments, 9-component cost waterfall",
    avatarColor: "bg-emerald-700 text-white",
    badgeVariant: "default",
  },
  {
    id: "admin",
    email: "admin@demo.innotex.example",
    name: "Prakash Nair",
    role: "ADMIN",
    roleName: "System Administrator",
    department: "IT & Governance",
    description: "Security policies, location scopes, immutable audit trail, integration adapters",
    avatarColor: "bg-slate-800 text-white",
    badgeVariant: "outline",
  },
];

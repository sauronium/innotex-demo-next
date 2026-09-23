# PLM demo workspace

- `/plm/designs`: Master PLM, Looker table/Kanban, Material Library and Product Library.
- `/plm/clients`: Client PLM, client directory and sequential product lifecycle.
- `/plm/rd`: Dedicated R&D workspace, also linked from the sidebar, PLM navigation and product lifecycle.
- `/crm/clients`: CRM-owned communication history and source references.

The Library is a POT within Master PLM. Looker derives its rows from the same client products; it does not create department workflows. New products enter Derivatives, and move through R&D, Processing, Product Evaluation, Production, Cutting, Stitching, Finishing, Inventory and Delivery.

The material catalogue starts with 70 records, including 50 fabrics. Users can search across material details, filter categories, open/edit records and add materials. Twelve sample references cover the six requested Product Library categories. R&D references both shared libraries. Task evidence, client approval and CQP sign-off gate stage transitions. Delivery requires the full quantity, invoice reference and location. Payment and followups remain editable after delivery.

CRM entries can be referenced into the Derivatives Data Pool. Open the CRM page to initialize its sample history, then return to Client PLM and select an entry. WhatsApp, call summaries, suppliers and prices are illustrative. Invoices and geo-tags are entered references, not live billing or tracking integrations. Stage file inventory and BOM details are recorded as evidence; binary upload and line-level manufacturing execution remain outside this local demo workspace.

Persistence uses browser localStorage (`innotex-plm-lifecycle-v2`, `innotex-crm-history-v1`). This is a single-browser demo, not a shared Supabase workflow. Existing v1 PLM data remains untouched under its original key but is not automatically mapped into the new lifecycle.

## R&D development workspace

R&D uses the same scoped client products and browser persistence as Client PLM. Management, Admin and Sales can edit products currently in R&D; later stages retain read-only development details. Existing records remain compatible until structured development is started.

Seven sections cover the development brief and Derivatives evidence, material comparison and Product Library references, discussion decisions and action owners, design versions and colourway swatches, sample revisions, editable trial BOM costing, and development checks. File and photo references are text records, not uploaded binaries. Costing uses material consumption × (1 + wastage / 100) × rate plus per-unit labour, processing and packaging.

For a walkthrough, select an R&D product and choose **Load illustrative V1 scenario**. Inspect the sleeve-fit rework, create V2, revise measurements, close the discussion action, record a passing development check and link a Product Library sample. Mark the latest sample ready for presentation with a file reference. Earlier sample revisions retain their measurements, feedback, selected-material IDs, design ID and cost snapshot. A later design-selection, material-selection or cost change requires a fresh sample revision.

The handover panel lists missing requirements. Successful handover records evidence for the five R&D tasks and advances the existing product to Processing, where client approval remains pending. Structured development gates also apply when advancing through Client PLM. Formal CQP sign-off remains in Product Evaluation.

Validation for this update: TypeScript, 24 existing workflow tests and 5 additional R&D tests; browser verification of navigation, illustrative scenario, V2 creation, preserved V1 fields and persistence after reload.

Validation: `npm run typecheck`; `node --experimental-strip-types --test tests/*.test.mjs`.
Production build requires access to the existing Google Fonts Inter dependency in `app/layout.tsx`. The restricted-environment build could not download it; the network-enabled retry was declined.

## Visual operations update

Looker now opens as a coloured Kanban board, with an alternate table, clickable stage legend, client/stage/attention filters, priority/progress/due-date sorting, and real CSV export of the filtered rows. Cards show current owner, priority, quantity, due date, schedule risk, followup and blockers. All colours have accompanying text labels.

Overall progress measures checked tasks that include evidence across the lifecycle. It stays below 100% until delivery is completed. Current-stage evidence progress is separate from approval readiness. Owners, priorities, due dates and blocker reasons can be edited in Client PLM; a nonempty blocker prevents handover. The handover summary lists remaining evidence and approval requirements.

The MRP workbench (`/manufacturing/plans`) includes a production handover board using the same locally saved PLM products. Cards deep-link to the exact client product. The existing MRP calculation example remains separate and does not imply automatic stock or purchasing transactions. Cross-tab storage changes and returning focus refresh the handover board.

The material catalogue additionally filters availability and sorts by code, name, lead time or price. Fresh demo data includes varied task completion, priorities and holds. Existing browser data is preserved; its new optional fields default to the stage owner and Normal priority.

The dev server was stopped as requested and was not restarted for this update. Validation uses TypeScript and automated workflow tests; a fresh browser visual check was not performed for this update.

## Shared selectors, module map and fabric genealogy

All module cards now show searchable feature lists below their titles. The details drawer shares those lists. The PLM-to-inventory connection describes the shared material and client-product references.

`DemoProvider` owns the role, unit and location selections for the dashboard layout. Native selects immediately change role-aware navigation, stage edit permissions, scoped product/roll totals and the dashboard. Role is saved under the existing `innotex_active_persona` key; unit and location use `innotex-demo-scope-v1`. Legacy seeded products receive deterministic unit/location fallbacks without rewriting the user's data. New products explicitly record their unit and location. The Material and Product Library POT remains global.

The user directory and approval queue use the same persona context. Changing persona or scope closes an open approval decision. Approval decisions recheck checker role, maker separation, pending status and document scope. Local decisions and comments persist in `innotex-demo-approvals-v1`. These are demo controls, not database authorization: switching persona does not impersonate a Supabase account, and demo approval decisions do not submit backend RPCs.

The roll register contains 20 example rolls linked to PLM materials and products. Table/Kanban views, scoped KPIs, search, QC badges, metre balances, consumption bars and movement timelines replace the previous single-roll illustration. Store/Production may reserve and issue approved fabric; Quality may approve, hold or reject it. Management/Admin may do both. Movement events persist in `innotex-fabric-rolls-v1`; over-reservation, over-issue, held fabric issues and unauthorized role actions are rejected. Product references lock after reservation/issue. Opening a linked product changes the selectors to that product's scope.

Fixed commercial/manufacturing/report examples have an explicit Sportswear / Tirupur sample scope. In other scopes the demo shows an out-of-scope message instead of relabeling fixed records. The scoped MRP handover board continues to work across all units. Global reference and administrative catalogues remain shared.

No production database schema, RLS policy or stock transaction was changed. The development server remains stopped; automated checks were run without restarting it.

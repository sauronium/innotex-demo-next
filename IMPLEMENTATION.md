# Implementation checklist

- [ ] Phase 0: dependencies, Nuxt 4, Frappe UI, real authentication, validation and checks.
- [ ] Phase 1: live master lists/details, navigation and interactive module map.
- [ ] Phase 2: PLM, sales, BOM and material-plan workbenches.
- [ ] Phase 3: procurement, receipts and roll genealogy.
- [ ] Phase 4: production, job work and quality workbenches.
- [ ] Phase 5: dispatch, finance, reports and explicitly simulated integrations.
- [ ] Phase 6: build/type checks, browser checks, setup and limitations documentation.

User override: Supabase Data API and RPC, without Drizzle. Preserve existing SQL and generated types.

Initial inspection: existing SQL has permissive authenticated policies, read-all anonymous policies, and incomplete transactional guards. No trusted database credentials or Supabase MCP tools are currently exposed to this task. Tenant isolation and transactional posting are not verified.

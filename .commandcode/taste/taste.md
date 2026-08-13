# Taste

## Workflow & Communication
- Reports UI/visual issues by attaching screenshots (e.g., screenshots of the navbar menu and the admin panel) rather than writing detailed textual descriptions — often a terse caption like "fix it". Confidence: 0.8
- Pastes console output/browser warnings (e.g., Next.js dev-server logs, `scroll-behavior` warnings) verbatim into bug reports alongside the request. Confidence: 0.7

## Design
- Cares about visual polish — explicitly asks to "make it a good UI" when something looks off; expects clean, professional-looking UI, not just functional output. Confidence: 0.5
- Expects the whole application to be mobile-friendly and responsive — explicitly asks to make the entire admin panel (all pages, tables, forms, navigation) mobile-friendly, not just the customer-facing storefront. Reports specific mobile bugs as they surface, page by page (e.g., sticky headers overlapping when scrolling, non-responsive page sections, `/locations/[slug]` pages not mobile-friendly). Confidence: 0.92

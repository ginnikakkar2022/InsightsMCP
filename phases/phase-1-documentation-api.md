---
name: "Phase 1 — Insights Documentation API"
overview: >
  Publish the 4 Insights how-to guides and the Insights best-practice sections (§20–22)
  to the PubNub documentation API, then register the new slugs in pubnub-mcp so
  Claude can fetch them via the how_to() tool. This phase is independent of the insights
  tool itself and should be completed first so Claude has reference material the moment
  the tool ships.
todos:
  - id: fix-tool-name-references
    content: >
      Pre-requisite — confirm the 4 how-to files in InsightsMCP/how-tos/ have already been
      updated from `## Using the query_insights Tool` to `## Using the insights Tool`.
      (This was done as part of the plan setup; verify before publishing.)
    status: pending
  - id: publish-howto-files
    content: >
      Copy the 4 publishable how-to markdown files from InsightsMCP/how-tos/ into the
      documentation-api repo (github.com/PubNubDevelopers/documentation-api) using the
      slug mapping table below and open a PR. The 5th file
      (how_to_get_insights_api_access.md) stays as a local reference and is NOT published.
    status: pending
  - id: publish-best-practices
    content: >
      Add the Insights best-practice sections (§20–22 of InsightsMCP/bestpractice.md)
      to the /best-practice endpoint content in the documentation-api repo, and add the
      `Insights: insights (Channels, Users, Messages, User Behavior & Devices)` line to
      the MCP tool pointer summary.
    status: pending
  - id: add-slugs-to-schemas
    content: >
      Once the documentation-api PR is merged, add the 4 new slugs to howToSlugs in
      pubnub-mcp/src/lib/docs/schemas.ts and open a PR.
    status: pending
  - id: verify-how-to-tool
    content: >
      Verify that how_to(slug="how-to-query-insights-channels") resolves correctly via
      the pubnub-mcp how_to tool after both PRs are merged.
    status: pending
isProject: false
---

# Phase 1 — Insights Documentation API

## Context

The `how_to` tool in `pubnub-mcp` fetches content from `docs.pubnubtools.com`.
Valid slugs are hardcoded in `howToSlugs` in `src/lib/docs/schemas.ts`. The 4 publishable
Insights how-to files currently live in `InsightsMCP/how-tos/` and are not accessible
through the tool until they are published to the docs API and their slugs registered.

This phase must be done first (or at minimum concurrently with Phase 2) so that when
the `insights` tool ships, Claude can immediately call:

```
how_to(slug="how-to-query-insights-channels")
how_to(slug="how-to-query-insights-users")
...
```

The `how_to_get_insights_api_access.md` file remains a local reference and is **not**
published — this matches the pattern used for Illuminate, where the API key acquisition
guide stays local and is referenced from the published how-tos via cross-link.

---

## Repos involved

| Repo | Path | Action |
|---|---|---|
| `PubNubDevelopers/documentation-api` | `github.com/PubNubDevelopers/documentation-api` | Publish 4 how-to files + best practices §20–22 |
| `pubnub-mcp` | `/Users/nicolis.miller/Documents/GitHub/pubnub-mcp` | Add slugs to `src/lib/docs/schemas.ts` |

---

## Step 0 — Verify the tool-name fix

Before opening any PR, confirm the 4 publishable how-tos use `## Using the insights Tool`
(not `## Using the query_insights Tool`):

```bash
grep -l "Using the insights Tool" /Users/nicolis.miller/Desktop/InsightsMCP/how-tos/how_to_query_insights_*.md
# Should list all 4 files

grep -l "Using the query_insights Tool" /Users/nicolis.miller/Desktop/InsightsMCP/how-tos/
# Should return nothing
```

If any file still references `query_insights` in a tool section heading, fix it first.
The chosen MCP tool name is `insights` (single word, lowercase).

---

## Step 1 — Publish how-to files to documentation-api

The 4 publishable source files live in:

```
/Users/nicolis.miller/Desktop/InsightsMCP/how-tos/
```

### Slug mapping

| Source file | Slug |
|---|---|
| `how_to_get_insights_api_access.md` | *(local reference only — NOT published, mirrors Illuminate API key file pattern)* |
| `how_to_query_insights_channels.md` | `how-to-query-insights-channels` |
| `how_to_query_insights_users.md` | `how-to-query-insights-users` |
| `how_to_query_insights_messages.md` | `how-to-query-insights-messages` |
| `how_to_query_insights_user_behavior_and_devices.md` | `how-to-query-insights-user-behavior-and-devices` |

Each file already has YAML frontmatter with `resource`, `base_url`, `triggers`, `requires`,
and `produces` fields that the docs API can use for indexing. Each also contains a
`## Using the insights Tool` section with MCP tool-call JSON examples.

Cross-references to `how_to_get_insights_api_access.md` inside the published files should
be left as-is — the docs site can either resolve them as local sibling pages or render
them as plain text without breaking the published content.

---

## Step 2 — Publish Insights best-practice sections

Source file: `/Users/nicolis.miller/Desktop/InsightsMCP/bestpractice.md`

Sections **§20–22** cover Insights-specific best practices:

- **§20) Insights overview** — what Insights is, the two endpoint families (`/v2/insights`
  and `/v2/insights/top`), the five metric groups (Channels, Users, Messages, User
  Behavior, Devices), Premium-only API access tiering, dashboards vs API
- **§21) Insights authentication and API access** — Service Integration setup with the
  Insights Read scope, required headers (`Authorization`, `PubNub-Version`,
  `Content-Type`), base URL, the two endpoints, UTC timestamp note, the subscribe key
  query parameter requirement
- **§22) Querying Insights metrics** — common query parameters, period restrictions
  matrix, categories for top metrics, best practices (default to daily, hourly only
  for duration metrics, never sum top-N counts across periods, channel pattern filtering)

These sections need to be added to the content served by the `/best-practice` endpoint
in the documentation-api repo, which is what the `write_pubnub_app` tool fetches.

Also update the **MCP tool pointer summary** at the bottom of the best-practice content
to add the line:

```
- Insights: insights (Channels, Users, Messages, User Behavior & Devices)
```

---

## Step 3 — Add slugs to pubnub-mcp

File: `pubnub-mcp/src/lib/docs/schemas.ts`

Find the `howToSlugs` array and add the 4 new slugs after the last existing entry
(typically the last Illuminate slug). The existing array looks like:

```typescript
export const howToSlugs = [
  // ... existing slugs ...
] as const;
```

Add these 4 entries:

```typescript
"how-to-query-insights-channels",
"how-to-query-insights-users",
"how-to-query-insights-messages",
"how-to-query-insights-user-behavior-and-devices",
```

After this change, Claude will be able to call
`how_to(slug="how-to-query-insights-channels")` the same way it calls any other guide
today — consistent with the existing pattern.

---

## Step 4 — Verify

After both PRs are merged and deployed:

1. Call `how_to(slug="how-to-query-insights-channels")` via the MCP tool
2. Confirm the response contains the channel metric reference and tool-call JSON examples
3. Spot-check `how_to(slug="how-to-query-insights-user-behavior-and-devices")` for the
   period restrictions table (duration metrics are hourly-only)
4. Spot-check `write_pubnub_app` and look for the Insights overview / auth / querying
   sections (§20–22) in the response

---

## Dependency note

This work is independent of the `insights` tool implementation (Phase 2). The tool is
functional without the docs, but Claude will be significantly more effective if the
how-to guides are available. Complete Phase 1 before or alongside Phase 2.

This phase is also **smaller than Illuminate Phase 1** — there are no missing files to
write, no playbooks to draft. All 5 how-tos already exist in `InsightsMCP/how-tos/`.

---
name: "Phase 3 — Insights Prompts and Tests"
overview: >
  Merge the 4 Insights MCP prompts into pubnub-mcp/src/prompts.ts and write the
  handler test suite. Depends on Phase 2 (insights core tool) being complete and merged
  before this phase begins. Substantially smaller than Illuminate Phase 3 because there
  is only one operation, no 2-step workflow, and no default injection to test.
todos:
  - id: merge-prompts
    content: >
      Add 4 Insights prompt constants to pubnub-mcp/src/prompts.ts
      (insights-snapshot, insights-channel-analysis, insights-user-growth,
      insights-engagement-deep-dive) and append them to the prompts[] export array.
    status: pending
  - id: create-handler-tests
    content: >
      Create src/lib/insights/handlers.test.ts — vitest unit tests using
      vi.mock("./api") (matching the existing portal/illuminate handler test
      pattern in pubnub-mcp) covering metric routing (regular vs top endpoint),
      period validation, category requirement validation, missing API key error
      (PUBNUB_API_KEY), missing subscribe key error, and 401/403/400/429 upstream
      error paths surfaced via mocked api rejections.
    status: pending
  - id: run-tests
    content: Run npm run test:unit in pubnub-mcp and confirm all tests pass.
    status: pending
  - id: final-build
    content: Run npm run build in pubnub-mcp — final build check.
    status: pending
isProject: false
---

# Phase 3 — Insights Prompts and Tests

## Target repo

```
/Users/nicolis.miller/Documents/GitHub/pubnub-mcp
```

**Prerequisite:** Phase 2 (insights core tool) must be merged before this phase. The
test file (`handlers.test.ts`) tests the handler created in Phase 2.

---

## Step 1 — Merge prompts into src/prompts.ts

Source file: `/Users/nicolis.miller/Desktop/InsightsMCP/prompts.ts`

Read the existing `pubnub-mcp/src/prompts.ts` to see the current prompts and the
`generateHandler` pattern. Then add the 4 Insights constants below and append them to
the `prompts[]` export.

### Constants to add

Add these 4 constants after the last existing prompt constant (likely
`illuminateTestVerify`) and before the `export const prompts` line. The full prompt body
text is in `InsightsMCP/prompts.ts` lines 174–214 — copy verbatim.

```typescript
const insightsSnapshot = {
  name: "insights-snapshot",
  definition: {
    title: "Insights Account Snapshot",
    description:
      "Quick high-level analytics snapshot for a date range — unique channels, unique users, message volume, and top channels",
  },
  handler: generateHandler(
    "Act as an analytics engineer and use PubNub MCP to produce an Insights snapshot for my account. Step 0 — Confirm inputs: ..."
    // Full text in InsightsMCP/prompts.ts — copy verbatim
  ),
};

const insightsChannelAnalysis = {
  name: "insights-channel-analysis",
  definition: {
    title: "Analyze Top Channels",
    description:
      "Deep dive into top channels by category, channel patterns, and channel engagement",
  },
  handler: generateHandler(
    "Act as a product analyst and use PubNub MCP to analyze top channels in detail. Step 0 — Confirm inputs: ..."
    // Full text in InsightsMCP/prompts.ts — copy verbatim
  ),
};

const insightsUserGrowth = {
  name: "insights-user-growth",
  definition: {
    title: "Track User Growth",
    description:
      "New vs recurring users, daily/weekly/monthly trends, and geographic distribution",
  },
  handler: generateHandler(
    "Act as a growth analyst and use PubNub MCP to track user growth on my PubNub account. Step 0 — Confirm inputs: ..."
    // Full text in InsightsMCP/prompts.ts — copy verbatim
  ),
};

const insightsEngagementDeepDive = {
  name: "insights-engagement-deep-dive",
  definition: {
    title: "Engagement and Device Deep Dive",
    description:
      "Average user duration, duration buckets, and device-type breakdown of publishes, subscribers, and unique users",
  },
  handler: generateHandler(
    "Act as a product analyst and use PubNub MCP to do an engagement and device deep dive. Step 0 — Confirm inputs: ..."
    // Full text in InsightsMCP/prompts.ts — copy verbatim
  ),
};
```

### Export array

Append to the existing `prompts[]` export (after the last Illuminate prompt):

```typescript
export const prompts = [
  // ...existing prompts unchanged...
  insightsSnapshot,
  insightsChannelAnalysis,
  insightsUserGrowth,
  insightsEngagementDeepDive,
];
```

---

## Step 2 — Create handlers.test.ts

File: `src/lib/insights/handlers.test.ts`

Follow the exact same vitest pattern used in `src/lib/portal/handlers.test.ts` and
`src/lib/illuminate/handlers.test.ts`. Read those files before starting to match the
mock setup and assertion style.

**Mocking strategy — match the repo, do not introduce a new pattern.** Handler tests
in `pubnub-mcp` mock the sibling `api` module with `vi.mock("./api")` and stub each
exported call with `vi.mocked(api.queryInsights).mockResolvedValue(...)` /
`mockRejectedValue(...)`. Do **not** use `msw/node` `setupServer` here — MSW is only
used at the HTTP-layer (`src/lib/docs/api.test.ts`). If you also want HTTP-layer
coverage for `queryInsights`, add a separate `src/lib/insights/api.test.ts` using MSW;
keep `handlers.test.ts` focused on handler logic with `vi.mock`.

### Test coverage checklist

**Endpoint routing:**

- [ ] Regular metric (e.g. `unique_channels`) → calls `GET /v2/insights`
- [ ] Top metric (e.g. `top_20_channels`) → calls `GET /v2/insights/top`
- [ ] Top duration metric (e.g. `top_20_channels_with_user_duration`) → calls `/v2/insights/top`

**Query parameter serialization:**

- [ ] `subscribe_key`, `metric`, `period`, `start_date`, `end_date` always present
- [ ] `category` is included when provided
- [ ] `filter`, `orderBy`, `limit` are included when provided
- [ ] Optional params are omitted when not provided

**Period validation (handler-level):**

- [ ] `top_20_channels` + `period=weekly` → returns error mentioning allowed periods
- [ ] `top_20_channels` + `period=monthly` → returns error
- [ ] `avg_user_duration` + `period=daily` → returns error (hourly only)
- [ ] `new_vs_recurring_users` + `period=hourly` → returns error
- [ ] Each metric with each of its allowed periods → succeeds (or at least passes validation)

**Category requirement (handler-level):**

- [ ] `top_20_channels` without `category` → returns error
- [ ] `top_20_users` without `category` → returns error
- [ ] `top_20_channels` with `category=by_messages` → succeeds
- [ ] Non-top metric (e.g. `unique_channels`) without `category` → succeeds

**Auth resolution:**

- [ ] `api_key` argument is used when provided
- [ ] Falls back to `PUBNUB_API_KEY` env var when `api_key` argument is absent (same
      env var the existing `manage_illuminate` tool uses — there is no separate
      `INSIGHTS_API_KEY`)
- [ ] Missing `PUBNUB_API_KEY` (no arg, no env var) → returns helpful error mentioning
      Insights Premium and the Service Integration permission update (Insights Read)
- [ ] `subscribe_key` argument is used when provided
- [ ] Falls back to `PUBNUB_SUBSCRIBE_KEY` env var when absent
- [ ] Missing both subscribe key sources → returns helpful error

> Note: clear/restore `process.env.PUBNUB_API_KEY` and `process.env.PUBNUB_SUBSCRIBE_KEY`
> in `beforeEach`/`afterEach` so env-fallback tests don't leak into each other or pick
> up the developer's local shell values.

**Error paths from upstream API:**

- [ ] 401 → error response includes the upstream status and body
- [ ] 403 → error response includes the upstream status and body (Premium tier hint
      can be added by Claude in chat, doesn't need to be enforced in the handler)
- [ ] 400 (e.g. invalid date format) → error response is surfaced clearly
- [ ] 429 → error response is surfaced clearly

### Test setup pattern (vi.mock — matches portal/illuminate handler tests)

```typescript
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "./api";
import { insightsHandler } from "./handlers";

vi.mock("./api");

describe("insightsHandler", () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset env so fallback tests are deterministic
    process.env = { ...ORIGINAL_ENV };
    delete process.env.PUBNUB_API_KEY;
    delete process.env.PUBNUB_SUBSCRIBE_KEY;
  });

  describe("endpoint routing", () => {
    it("routes regular metrics to /v2/insights", async () => {
      const mockResult = {
        metric: "unique_channels",
        data: [{ timestamp: "2026-04-01T00:00:00Z", value: 42 }],
      };
      vi.mocked(api.queryInsights).mockResolvedValue(mockResult);

      const res = await insightsHandler({
        metric: "unique_channels",
        period: "daily",
        start_date: "2026-04-01",
        end_date: "2026-04-07",
        subscribe_key: "sub-c-test",
        api_key: "si_test",
      });

      // The api facade owns the URL choice; assert the args it received.
      expect(api.queryInsights).toHaveBeenCalledOnce();
      const [argsArg, apiKeyArg] = vi.mocked(api.queryInsights).mock.calls[0];
      expect(argsArg.metric).toBe("unique_channels");
      expect(apiKeyArg).toBe("si_test");
      const parsed = JSON.parse(res.content?.[0]?.text ?? "");
      expect(parsed).toEqual(mockResult);
    });

    it("routes top metrics to /v2/insights/top", async () => {
      vi.mocked(api.queryInsights).mockResolvedValue({
        metric: "top_20_channels",
        category: "by_messages",
        data: [{ name: "channel-a", count: 100 }],
      });

      const res = await insightsHandler({
        metric: "top_20_channels",
        period: "daily",
        start_date: "2026-04-01",
        end_date: "2026-04-07",
        category: "by_messages",
        subscribe_key: "sub-c-test",
        api_key: "si_test",
      });

      expect(res.content?.[0]?.text).toContain("by_messages");
    });
  });

  describe("period validation", () => {
    it("rejects top_20_channels with period=weekly", async () => {
      const res = await insightsHandler({
        metric: "top_20_channels",
        period: "weekly",
        start_date: "2026-04-01",
        end_date: "2026-04-07",
        category: "by_messages",
        subscribe_key: "sub-c-test",
        api_key: "si_test",
      });

      expect(api.queryInsights).not.toHaveBeenCalled();
      expect(res.isError).toBe(true);
      expect(res.content?.[0]?.text).toMatch(/period.*weekly/i);
    });
  });

  describe("auth resolution", () => {
    it("falls back to PUBNUB_API_KEY env var when api_key arg is absent", async () => {
      process.env.PUBNUB_API_KEY = "si_from_env";
      vi.mocked(api.queryInsights).mockResolvedValue({ data: [] });

      await insightsHandler({
        metric: "unique_channels",
        period: "daily",
        start_date: "2026-04-01",
        end_date: "2026-04-07",
        subscribe_key: "sub-c-test",
      });

      expect(api.queryInsights).toHaveBeenCalledWith(
        expect.objectContaining({ subscribe_key: "sub-c-test" }),
        "si_from_env",
      );
    });

    it("returns a helpful error when neither api_key nor PUBNUB_API_KEY is set", async () => {
      const res = await insightsHandler({
        metric: "unique_channels",
        period: "daily",
        start_date: "2026-04-01",
        end_date: "2026-04-07",
        subscribe_key: "sub-c-test",
      });

      expect(api.queryInsights).not.toHaveBeenCalled();
      expect(res.isError).toBe(true);
      expect(res.content?.[0]?.text).toMatch(/PUBNUB_API_KEY/);
    });
  });

  describe("upstream error paths", () => {
    it("surfaces a 403 response via parseError + JSON.stringify", async () => {
      vi.mocked(api.queryInsights).mockRejectedValue(
        new Error("403 Forbidden — insights premium required"),
      );

      const res = await insightsHandler({
        metric: "unique_channels",
        period: "daily",
        start_date: "2026-04-01",
        end_date: "2026-04-07",
        subscribe_key: "sub-c-test",
        api_key: "si_test",
      });

      expect(res.isError).toBe(true);
      expect(res.content?.[0]?.text).toMatch(/403/);
    });
  });

  // ... additional describe() blocks for category requirement, 401/400/429 paths
});
```

---

## Step 3 — Run tests

```bash
cd /Users/nicolis.miller/Documents/GitHub/pubnub-mcp
npm run test:unit
# Optional, slower — runs the integration project (requires build):
# npm run test:integration
```

`pubnub-mcp` does not define a top-level `npm test` script; the available scripts are
`test:unit` and `test:integration` (see `package.json`). All existing tests must
continue to pass. New Insights tests must also pass.

---

## Step 4 — Final build check

```bash
npm run build
```

Zero TypeScript errors. Zero warnings on the new insights module files.

---

## What this phase does NOT cover (compared to Illuminate Phase 3)

- No 2-step workflow tests (Insights has no scaffold-then-update pattern)
- No default injection tests (Insights has no defaults to inject)
- No publish-fake-data tests (Insights has no write/publish operations)
- No multi-resource CRUD tests (Insights has only one read operation)
- No decision limit tests (Insights has no resource limits to hit)

This is intentional — Insights is read-only and the test surface is correspondingly
narrower.

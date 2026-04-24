---
name: "Phase 4 — Insights Implementation Validation"
overview: >
  An AI-driven end-to-end validation of the insights tool against the real Insights API.
  Claude runs a structured sequence of insights tool calls covering all 5 metric groups
  (Channels, Users, Messages, User Behavior, Devices), verifies routing and response
  shape at each step, exercises the period and category error paths, and produces a
  pass/fail report. Depends on Phase 2 and Phase 3 being merged, the existing
  PUBNUB_API_KEY env var being set (whose Service Integration has Account-level
  Insights Read added — there is no separate INSIGHTS_API_KEY), and a valid subscribe
  key for an account on Insights Premium.
todos:
  - id: verify-prereqs
    content: >
      Confirm PUBNUB_API_KEY is set (starts with si_) and that its Service Integration
      includes Account-level Insights Read, confirm a valid subscribe key is available,
      confirm the account is on Insights Premium, and confirm the `insights` tool is
      available in the MCP server.
    status: pending
  - id: run-channel-metrics
    content: >
      Step 1 — Query unique_channels (period=daily, last 7 days), top_20_channels
      (period=daily, category=by_messages), and channel_patterns (with a startsWith
      filter). Confirm each returns a JSON response shaped as expected.
    status: pending
  - id: run-user-metrics
    content: >
      Step 2 — Query unique_users (period=daily), new_vs_recurring_users (period=daily),
      unique_users_by_country (period=daily), and top_20_users (period=daily,
      category=by_messages). Confirm responses contain user counts and country data.
    status: pending
  - id: run-message-metrics
    content: >
      Step 3 — Query messages (period=daily) and top_10_message_types (period=daily).
      Confirm message volume and message-type rankings come back.
    status: pending
  - id: run-behavior-metrics
    content: >
      Step 4 — Query avg_user_duration (period=hourly, last 24 hours) and
      unique_users_by_duration_timeframe (period=hourly). Confirm hourly data is
      returned and that any attempt at period=daily is rejected by the handler.
    status: pending
  - id: run-device-metrics
    content: >
      Step 5 — Query publishes_by_device_type, subscribers_by_device_type, and
      unique_users_by_device_type (period=daily, last 7 days). Confirm device
      breakdowns are returned.
    status: pending
  - id: verify-error-paths
    content: >
      Step 6 — Confirm error paths: top_20_channels + period=weekly (handler-level
      reject), top_20_channels without category (handler-level reject), invalid
      subscribe_key (upstream 4xx), missing API key (handler-level reject with
      Premium-tier guidance).
    status: pending
  - id: produce-report
    content: >
      Step 7 — Summarize all pass/fail results with the exact metric called, period
      used, response status, and any errors. Output the full report as a final
      message.
    status: pending
isProject: false
---

# Phase 4 — Insights Implementation Validation

## Purpose

This phase validates that the `insights` tool works correctly against the **real**
Insights API. It is not a substitute for the unit tests in Phase 3 (which mock the
sibling `api` module with `vi.mock`). This is an end-to-end smoke test run by Claude
using the live tool.

Run this after Phase 2 and Phase 3 are merged and the server is running with a valid
`PUBNUB_API_KEY` (whose Service Integration has Account-level Insights Read added).

There is **no cleanup step** — Insights is read-only, so nothing is created or modified
on the account.

---

## Prerequisites

Before starting:

- `PUBNUB_API_KEY` is set (starts with `si_`) and the corresponding Service
  Integration has Account-level **Insights Read** permission added (this is the same
  Service Integration key used by `manage_illuminate`; there is no separate
  `INSIGHTS_API_KEY`)
- A valid `subscribe_key` (`sub-c-...`) is available for an account that has activity
  in the queried date range
- The account is on **Insights Premium** (Free tier has no API access; Pro existing
  customers may need to upgrade from Standard to Premium)
- The `insights` tool is available in the MCP server

For each step below, use the same `subscribe_key` and a date range that you know has
activity. Default suggestion: `start_date = today - 7 days`, `end_date = today`, all in
UTC.

---

## Step 1 — Channel metrics

### 1a. Unique channels per day

```json
{
  "metric": "unique_channels",
  "period": "daily",
  "start_date": "<7-days-ago>",
  "end_date": "<today>",
  "subscribe_key": "<your-subscribe-key>"
}
```

**Pass criteria:** 200 response with a JSON array of daily counts. Endpoint hit was
`/v2/insights` (regular, not top).

### 1b. Top 20 channels by messages

```json
{
  "metric": "top_20_channels",
  "period": "daily",
  "start_date": "<7-days-ago>",
  "end_date": "<today>",
  "category": "by_messages",
  "subscribe_key": "<your-subscribe-key>"
}
```

**Pass criteria:** 200 response with up to 20 channels and message counts. Endpoint hit
was `/v2/insights/top` (top, not regular).

### 1c. Channel patterns with prefix filter

Pick a known channel-name prefix on your account (e.g. `lobby.` or `room.`):

```json
{
  "metric": "channel_patterns",
  "period": "daily",
  "start_date": "<7-days-ago>",
  "end_date": "<today>",
  "filter": "startsWith:<your-prefix>",
  "subscribe_key": "<your-subscribe-key>"
}
```

**Pass criteria:** 200 response. If your prefix has matching channels, the response
contains them. Empty result is acceptable if the prefix has no matches.

---

## Step 2 — User metrics

### 2a. Unique users per day

```json
{
  "metric": "unique_users",
  "period": "daily",
  "start_date": "<7-days-ago>",
  "end_date": "<today>",
  "subscribe_key": "<your-subscribe-key>"
}
```

**Pass criteria:** 200 response with daily unique-user counts.

### 2b. New vs recurring users

```json
{
  "metric": "new_vs_recurring_users",
  "period": "daily",
  "start_date": "<7-days-ago>",
  "end_date": "<today>",
  "subscribe_key": "<your-subscribe-key>"
}
```

**Pass criteria:** 200 response with new-user count and recurring-user count per day.

### 2c. Unique users by country

```json
{
  "metric": "unique_users_by_country",
  "period": "daily",
  "start_date": "<7-days-ago>",
  "end_date": "<today>",
  "subscribe_key": "<your-subscribe-key>"
}
```

**Pass criteria:** 200 response with country codes and user counts.

### 2d. Top 20 users by messages

```json
{
  "metric": "top_20_users",
  "period": "daily",
  "start_date": "<7-days-ago>",
  "end_date": "<today>",
  "category": "by_messages",
  "subscribe_key": "<your-subscribe-key>"
}
```

**Pass criteria:** 200 response with up to 20 user IDs and message counts. Endpoint was
`/v2/insights/top`.

---

## Step 3 — Message metrics

### 3a. Total messages

```json
{
  "metric": "messages",
  "period": "daily",
  "start_date": "<7-days-ago>",
  "end_date": "<today>",
  "subscribe_key": "<your-subscribe-key>"
}
```

**Pass criteria:** 200 response with daily message counts.

### 3b. Top 10 message types

```json
{
  "metric": "top_10_message_types",
  "period": "daily",
  "start_date": "<7-days-ago>",
  "end_date": "<today>",
  "subscribe_key": "<your-subscribe-key>"
}
```

**Pass criteria:** 200 response with message-type names and counts. Endpoint was
`/v2/insights/top`.

> Note: If your account has not configured custom message-type extraction, this metric
> may return only the default message type. That is not a failure — it indicates the
> Messages Configuration is using defaults.

---

## Step 4 — User behavior (duration) metrics

### 4a. Average user duration (hourly)

```json
{
  "metric": "avg_user_duration",
  "period": "hourly",
  "start_date": "<yesterday>",
  "end_date": "<today>",
  "subscribe_key": "<your-subscribe-key>"
}
```

**Pass criteria:** 200 response with hourly average durations in seconds.

### 4b. Unique users by duration timeframe (hourly)

```json
{
  "metric": "unique_users_by_duration_timeframe",
  "period": "hourly",
  "start_date": "<yesterday>",
  "end_date": "<today>",
  "subscribe_key": "<your-subscribe-key>"
}
```

**Pass criteria:** 200 response with duration buckets (e.g. `<1m`, `1–5m`, `5–30m`,
`30m+`) and user counts.

### 4c. Period restriction check — duration metric with daily period

```json
{
  "metric": "avg_user_duration",
  "period": "daily",
  "start_date": "<yesterday>",
  "end_date": "<today>",
  "subscribe_key": "<your-subscribe-key>"
}
```

**Pass criteria:** Handler returns an error mentioning that `avg_user_duration` only
supports `period=hourly`. The upstream API is **not** called for this case.

---

## Step 5 — Device metrics

### 5a. Publishes by device type

```json
{
  "metric": "publishes_by_device_type",
  "period": "daily",
  "start_date": "<7-days-ago>",
  "end_date": "<today>",
  "subscribe_key": "<your-subscribe-key>"
}
```

### 5b. Subscribers by device type

```json
{
  "metric": "subscribers_by_device_type",
  "period": "daily",
  "start_date": "<7-days-ago>",
  "end_date": "<today>",
  "subscribe_key": "<your-subscribe-key>"
}
```

### 5c. Unique users by device type

```json
{
  "metric": "unique_users_by_device_type",
  "period": "daily",
  "start_date": "<7-days-ago>",
  "end_date": "<today>",
  "subscribe_key": "<your-subscribe-key>"
}
```

**Pass criteria for 5a–5c:** Each returns 200 with device-type breakdowns (e.g. `web`,
`mobile`, `server`, `iot`).

---

## Step 6 — Error path checks

### 6a. Top metric with disallowed period

```json
{
  "metric": "top_20_channels",
  "period": "weekly",
  "start_date": "<7-days-ago>",
  "end_date": "<today>",
  "category": "by_messages",
  "subscribe_key": "<your-subscribe-key>"
}
```

**Pass criteria:** Handler-level error mentioning that `top_20_channels` does not
support `period=weekly` and listing the allowed periods (`hourly`, `daily`). The
upstream API is **not** called.

### 6b. Top metric without category

```json
{
  "metric": "top_20_channels",
  "period": "daily",
  "start_date": "<7-days-ago>",
  "end_date": "<today>",
  "subscribe_key": "<your-subscribe-key>"
}
```

**Pass criteria:** Handler-level error mentioning that the `category` parameter is
required for `top_20_channels` and listing valid category values.

### 6c. Invalid subscribe key (upstream error)

```json
{
  "metric": "unique_channels",
  "period": "daily",
  "start_date": "<7-days-ago>",
  "end_date": "<today>",
  "subscribe_key": "sub-c-invalid-fake-key-for-test"
}
```

**Pass criteria:** Upstream error (likely 400 or 403) is surfaced as an error response.
The error message includes the upstream status code and a snippet of the body.

### 6d. Missing API key

Run any valid call **without** `api_key` and with `PUBNUB_API_KEY` unset in the
environment. (You may need to start a fresh server process with the env var unset to
test this cleanly. Be aware that unsetting `PUBNUB_API_KEY` will also disable
`manage_illuminate` and any other admin tools that share this key for the duration of
the test — restore it afterward.)

```json
{
  "metric": "unique_channels",
  "period": "daily",
  "start_date": "<7-days-ago>",
  "end_date": "<today>",
  "subscribe_key": "<your-subscribe-key>"
}
```

**Pass criteria:** Handler-level error mentioning `PUBNUB_API_KEY`, explaining that a
Service Integration API key is required, where to get one or update the existing one
(Portal → Service Integrations → add Account-level Insights Read), and that the
account must be on Insights Premium tier.

---

## Step 7 — Final report

After all steps, produce a summary:

```
INSIGHTS IMPLEMENTATION VALIDATION REPORT
==========================================

Step 1 — Channel metrics:
  1a unique_channels:                    PASS / FAIL
  1b top_20_channels (by_messages):      PASS / FAIL
  1c channel_patterns (filter):          PASS / FAIL

Step 2 — User metrics:
  2a unique_users:                       PASS / FAIL
  2b new_vs_recurring_users:             PASS / FAIL
  2c unique_users_by_country:            PASS / FAIL
  2d top_20_users (by_messages):         PASS / FAIL

Step 3 — Message metrics:
  3a messages:                           PASS / FAIL
  3b top_10_message_types:               PASS / FAIL

Step 4 — User behavior metrics:
  4a avg_user_duration (hourly):         PASS / FAIL
  4b unique_users_by_duration_timeframe: PASS / FAIL
  4c period restriction (daily reject):  PASS / FAIL

Step 5 — Device metrics:
  5a publishes_by_device_type:           PASS / FAIL
  5b subscribers_by_device_type:         PASS / FAIL
  5c unique_users_by_device_type:        PASS / FAIL

Step 6 — Error paths:
  6a disallowed period error:            PASS / FAIL
  6b missing category error:             PASS / FAIL
  6c invalid subscribe key error:        PASS / FAIL
  6d missing API key error:              PASS / FAIL

Endpoint routing:
  Regular metrics → /v2/insights:        PASS / FAIL
  Top metrics → /v2/insights/top:        PASS / FAIL

Overall: PASS (all steps passed) / FAIL (list failed steps with errors)
```

If any step failed, include the exact error text returned by the tool, the request
parameters, and a suggested fix (e.g. "verify subscribe key matches the keyset", "check
account is on Insights Premium", "check `metric` is in METRIC_ENDPOINT map").

---

## Dependency note

This phase depends on Phase 2 (tool implementation) and Phase 3 (prompts + tests) being
complete and merged. It does not depend on Phase 1 (documentation API) — the tool works
without the how-to guides being published.

There is no cleanup step (Insights is read-only). The validation can be re-run safely
any time without side effects on the account.

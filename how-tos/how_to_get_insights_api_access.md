---
resource: authentication
base_url: https://admin-api.pubnub.com/v2
triggers:
  - insights api key
  - insights authentication
  - insights setup
  - insights api access
  - insights premium api
  - insights service integration
requires:
  - pubnub account on Starter or Pro plan with Insights Premium
  - admin portal access with Owner or Account Admin role
produces:
  - Service Integration API key (si_...) with Insights Read scope. In the PubNub MCP this is stored in the existing PUBNUB_API_KEY environment variable — there is no separate INSIGHTS_API_KEY. Either add Insights Read to the Service Integration backing your current PUBNUB_API_KEY, or create a new Service Integration with Insights Read and rotate PUBNUB_API_KEY to it.
---

# How to Get Insights API Access

> **Prerequisites**
>
> - A PubNub account on the [Starter or Pro plan](https://www.pubnub.com/pricing/) with **Insights Premium** enabled
> - Owner or Account Admin role in the [Admin Portal](https://admin.pubnub.com/)

PubNub Insights API access is available only to **Insights Premium** customers. The API uses Service Integration API keys for authentication — the same mechanism used by the Admin API and Illuminate.

## Step 1: Verify Your Plan

Insights Premium is required for API access.

| Plan | Insights Tier | API Access |
|---|---|---|
| Starter | Premium (included) | Yes |
| Pro (new customers) | Premium (included) | Yes |
| Pro (existing customers) | Standard (default) | No — upgrade to Premium first |

To upgrade, open the [Admin Portal](https://admin.pubnub.com/#/insights), navigate to **Insights**, and select **Upgrade**.

## Step 2: Create or Update a Service Integration API Key

The PubNub MCP uses a single Service Integration key (`PUBNUB_API_KEY`) for all admin
tools (`manage_illuminate`, `insights`, etc.). You have two options:

**Option A — Add Insights Read to your existing key (recommended).** Open the Service
Integration that backs your current `PUBNUB_API_KEY` and add an Account-level
**Insights — Read** permission row. The key value does not change.

**Option B — Create a new Service Integration with Insights Read.** Then update
`PUBNUB_API_KEY` (and any other places that store the key) to the new value.

To create a new key:

1. Sign in to the [Admin Portal](https://admin.pubnub.com/).
2. Navigate to **Service Integrations** (account-level settings).
3. Create a new API key.
4. Grant the **Insights — Read** permission scope (plus any other scopes you also
   need, e.g. Illuminate Read & Write for `manage_illuminate`).
5. Copy the generated API key (`si_...` format). Store it securely as `PUBNUB_API_KEY`
   in your environment or secrets manager — it cannot be retrieved after creation.

| Permission Scope | Level | Access |
|---|---|---|
| Insights | Account | Read — list and view which subscribe keys have the most messages, unique channels, and users |

## Step 3: Required Headers

Every Insights API request must include these three headers:

```bash
-H "Authorization: YOUR_API_KEY_HERE" \
-H "PubNub-Version: 2026-03-01" \
-H "Content-Type: application/json"
```

| Header | Value | Notes |
|---|---|---|
| `Authorization` | Your Service Integration API key | `si_...` format |
| `PubNub-Version` | `2026-03-01` | Date-based minor version (ISO 8601 `YYYY-MM-DD`) |
| `Content-Type` | `application/json` | Required on all Admin API requests |

## Base URL

All Insights API requests use the Admin API base URL:

```
https://admin-api.pubnub.com/v2
```

Two endpoints are available:

| Endpoint | Purpose | Example Metrics |
|---|---|---|
| `GET /v2/insights` | Aggregated metrics | `unique_channels`, `unique_users`, `messages`, `new_vs_recurring_users` |
| `GET /v2/insights/top` | Ranked/top-N metrics | `top_20_channels`, `top_1000_channels`, `top_20_users`, `top_1000_users` |

## Step 4: Verify Access

Test your API key with a simple request:

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=unique_channels&period=daily&start_date=2026-04-01&end_date=2026-04-07" \
  -H "Authorization: YOUR_API_KEY_HERE" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

A successful response returns JSON with your channel data. If you receive an authentication error, verify that:

1. The API key has the **Insights Read** permission
2. The `PubNub-Version` header is included and uses a valid date
3. Your account has Insights Premium enabled

## Common Query Parameters

All Insights API requests accept these parameters:

| Parameter | Required | Values | Notes |
|---|---|---|---|
| `subscribe_key` | Yes | `sub-c-...` | The keyset subscribe key to query |
| `metric` | Yes | See individual how-to guides | The specific metric to retrieve |
| `period` | Yes | `hourly`, `daily`, `weekly`, `monthly` | Time granularity; not all metrics support all periods |
| `start_date` | Yes | ISO 8601 date (`YYYY-MM-DD`) | Start of the date range (UTC) |
| `end_date` | Yes | ISO 8601 date (`YYYY-MM-DD`) | End of the date range (UTC) |
| `category` | Conditional | `by_messages`, `by_subscribers`, `all`, etc. | Required for top metrics (`/insights/top`) |
| `filter` | No | Filter expression | For `channel_patterns` metric |
| `limit` | No | Integer | Number of results to return |
| `orderBy` | No | Field name + direction | Sort order for results |

> **All timestamps and dates are in UTC.** The Insights API returns all metrics in the UTC timezone.

## Common Errors

| HTTP | Symptom | Cause | Fix |
|---|---|---|---|
| `401` | Unauthorized | Missing or invalid API key | Check the `Authorization` header value |
| `403` | Forbidden | API key lacks Insights Read permission | Update the Service Integration key scope in Admin Portal |
| `403` | Forbidden | Account does not have Insights Premium | Upgrade to Insights Premium in Admin Portal |
| `400` | Invalid metric | Unsupported `metric` value | Check the metric name spelling against the how-to guides |
| `400` | Invalid period | Metric does not support the requested period | See period restriction tables in each how-to guide |

## Next Steps

- [how_to_query_insights_channels.md](how_to_query_insights_channels.md) — channel metrics and top channels
- [how_to_query_insights_users.md](how_to_query_insights_users.md) — user metrics, growth tracking, top users
- [how_to_query_insights_messages.md](how_to_query_insights_messages.md) — message volume and message types
- [how_to_query_insights_user_behavior_and_devices.md](how_to_query_insights_user_behavior_and_devices.md) — session duration and device analytics

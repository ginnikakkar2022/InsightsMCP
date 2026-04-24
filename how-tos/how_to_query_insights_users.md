---
resource: users
base_url: https://admin-api.pubnub.com/v2/insights
triggers:
  - unique users
  - new users
  - recurring users
  - new vs recurring
  - user growth
  - top users
  - top 20 users
  - top 1000 users
  - users by country
  - users with messages
  - user engagement
  - how many users
  - daily active users
  - user analytics
requires:
  - insights api key (see how_to_get_insights_api_access.md)
  - subscribe key for the keyset to query
produces:
  - user counts, growth data, rankings, and geographic distribution (no resource IDs — read-only analytics)
---

# How to Query Insights User Metrics

> **Prerequisites**
>
> - An Insights API key with **Insights Read** permission (see [how_to_get_insights_api_access.md](how_to_get_insights_api_access.md))
> - A subscribe key (`sub-c-...`) for the keyset you want to query
> - Insights Premium plan

The Users dashboard in PubNub Insights shows analytics for unique users in your Pub/Sub API. Through the API, you can track user counts over time, identify growth trends (new vs. recurring), see geographic distribution, and find your most active users.

User metrics span two endpoints:

| Endpoint | Metrics |
|---|---|
| `GET /v2/insights` | `unique_users`, `unique_users_combination`, `new_vs_recurring_users`, `percent_unique_users_with_messages`, `unique_users_by_country` |
| `GET /v2/insights/top` | `top_20_users`, `top_1000_users` |

## Using the insights Tool

### Unique users per day

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "unique_users",
  "period": "daily",
  "start_date": "2026-04-01",
  "end_date": "2026-04-07"
}
```

### New vs. recurring users per day

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "new_vs_recurring_users",
  "period": "daily",
  "start_date": "2026-04-01",
  "end_date": "2026-04-07"
}
```

### New vs. recurring users per week

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "new_vs_recurring_users",
  "period": "weekly",
  "start_date": "2026-03-01",
  "end_date": "2026-04-07"
}
```

### New vs. recurring users per month

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "new_vs_recurring_users",
  "period": "monthly",
  "start_date": "2026-01-01",
  "end_date": "2026-04-07"
}
```

### Top 20 users by messages

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "top_20_users",
  "period": "daily",
  "start_date": "2026-04-01",
  "end_date": "2026-04-07",
  "category": "by_messages"
}
```

### Top 20 users by subscribed channels

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "top_20_users",
  "period": "daily",
  "start_date": "2026-04-01",
  "end_date": "2026-04-07",
  "category": "by_subscribed_channels"
}
```

### Users by country

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "unique_users_by_country",
  "period": "daily",
  "start_date": "2026-04-01",
  "end_date": "2026-04-07"
}
```

---

## Metric Reference

### `unique_users`

Returns the number of unique users (UUIDs) for each time period in the date range.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=unique_users&period=daily&start_date=2026-04-01&end_date=2026-04-07" \
  -H "Authorization: YOUR_API_KEY" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

**Sample response:**

```json
{
  "data": [
    { "timestamp_value": "2026-04-01T00:00:00Z", "unique_users": 3842 },
    { "timestamp_value": "2026-04-02T00:00:00Z", "unique_users": 4105 },
    { "timestamp_value": "2026-04-03T00:00:00Z", "unique_users": 3956 }
  ]
}
```

**Supported periods:** `hourly`, `daily`, `weekly`, `monthly`

---

### `unique_users_combination`

Returns unique users alongside unique users with messages and unique users with message chats. Useful for understanding how many users are actively sending messages vs. just connected.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=unique_users_combination&period=daily&start_date=2026-04-01&end_date=2026-04-07" \
  -H "Authorization: YOUR_API_KEY" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

**Sample response:**

```json
{
  "data": [
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "unique_users": 3842,
      "unique_users_with_messages": 2156,
      "unique_users_with_chats": 1834
    }
  ]
}
```

The `unique_users_with_chats` field appears when the keyset's use case includes **Chat**. Chat messages are text messages as defined by PubNub's payload type conventions.

**Supported periods:** `hourly`, `daily`, `weekly`, `monthly`

---

### `new_vs_recurring_users`

Returns the number of new unique users and returning unique users, compared with the preceding period. This is the key metric for tracking user growth.

- **New users** — UUIDs seen in the current period but not in the preceding equivalent period
- **Recurring users** — UUIDs seen in both the current period and the preceding equivalent period

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=new_vs_recurring_users&period=daily&start_date=2026-04-01&end_date=2026-04-07" \
  -H "Authorization: YOUR_API_KEY" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

**Sample response:**

```json
{
  "data": [
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "new_users": 412,
      "recurring_users": 3430
    },
    {
      "timestamp_value": "2026-04-02T00:00:00Z",
      "new_users": 389,
      "recurring_users": 3716
    }
  ]
}
```

> **Not available with `hourly` period.** Insights compares UUIDs against the prior equivalent period (yesterday, last week, or last month), which requires at least daily granularity.

**Supported periods:** `daily`, `weekly`, `monthly` only

---

### `percent_unique_users_with_messages`

Returns the percentage of unique users who published at least one message out of all unique users.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=percent_unique_users_with_messages&period=daily&start_date=2026-04-01&end_date=2026-04-07" \
  -H "Authorization: YOUR_API_KEY" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

**Sample response:**

```json
{
  "data": [
    { "timestamp_value": "2026-04-01T00:00:00Z", "percent_unique_users_with_messages": 56.1 }
  ]
}
```

**Supported periods:** `hourly`, `daily`, `weekly`, `monthly`

---

### `unique_users_by_country`

Returns unique user counts broken down by country for geographic distribution analysis.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=unique_users_by_country&period=daily&start_date=2026-04-01&end_date=2026-04-07" \
  -H "Authorization: YOUR_API_KEY" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

**Sample response:**

```json
{
  "data": [
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "country": "US",
      "unique_users": 1842
    },
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "country": "GB",
      "unique_users": 523
    },
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "country": "DE",
      "unique_users": 312
    }
  ]
}
```

**Supported periods:** `hourly`, `daily` only

---

### `top_20_users`

Returns the top 20 users ranked by a selected category. Use the `/insights/top` endpoint.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights/top?subscribe_key=sub-c-YOUR-KEY&metric=top_20_users&period=daily&start_date=2026-04-01&end_date=2026-04-07&category=by_messages" \
  -H "Authorization: YOUR_API_KEY" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

#### Categories

| Category | Ranks users by |
|---|---|
| `all` | All available categories combined |
| `by_messages` | Number of messages published |
| `by_chats` | Number of chat (text) messages published |
| `by_subscribed_channels` | Number of channels the user subscribed to |
| `by_users_with_messages` | (Channel-scoped — not typically used for user ranking) |

#### Response Fields

| Field | Description |
|---|---|
| `count_messages` | Number of messages published by this user |
| `count_chat` | Number of chat (text) messages published by this user |
| `count_channels_subscribed_to` | Number of channels the user subscribed to |
| `timestamp_value` | UTC timestamp of the hour or day |

**Sample response:**

```json
{
  "data": [
    {
      "user": "user-alice-9f3a",
      "count_messages": 2847,
      "count_chat": 2341,
      "count_channels_subscribed_to": 45,
      "timestamp_value": "2026-04-01T00:00:00Z"
    },
    {
      "user": "user-bob-7c2d",
      "count_messages": 1923,
      "count_chat": 1756,
      "count_channels_subscribed_to": 32,
      "timestamp_value": "2026-04-01T00:00:00Z"
    }
  ]
}
```

> **Top 20 users are unique per time period and cannot be summed across hours or days.** Select a single hour or date for accurate rankings.

**Supported periods:** `hourly`, `daily` only

---

### `top_1000_users`

Same as `top_20_users` but returns the top 1000 users. Available to Insights Premium users for expanded data download.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights/top?subscribe_key=sub-c-YOUR-KEY&metric=top_1000_users&period=daily&start_date=2026-04-01&end_date=2026-04-07&category=by_messages" \
  -H "Authorization: YOUR_API_KEY" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

Uses the same categories and response fields as `top_20_users`.

**Supported periods:** `hourly`, `daily` only

---

## Period Restrictions

| Metric | `hourly` | `daily` | `weekly` | `monthly` |
|---|---|---|---|---|
| `unique_users` | Yes | Yes | Yes | Yes |
| `unique_users_combination` | Yes | Yes | Yes | Yes |
| `new_vs_recurring_users` | No | Yes | Yes | Yes |
| `percent_unique_users_with_messages` | Yes | Yes | Yes | Yes |
| `unique_users_by_country` | Yes | Yes | No | No |
| `top_20_users` | Yes | Yes | No | No |
| `top_1000_users` | Yes | Yes | No | No |

> **`new_vs_recurring_users` requires at least `daily` granularity** because it compares UUIDs against the preceding equivalent period.

## Common Errors

| HTTP | Symptom | Cause | Fix |
|---|---|---|---|
| `400` | Invalid period for metric | Using `hourly` with `new_vs_recurring_users` | Use `daily`, `weekly`, or `monthly` |
| `400` | Invalid period for metric | Using `weekly`/`monthly` with `top_20_users` | Use `hourly` or `daily` |
| `400` | Invalid category | Missing `category` for top user metrics | Include a valid category (`by_messages`, `by_subscribed_channels`, etc.) |
| Empty `data` array | No data for range | No user activity in the date range or wrong subscribe key | Verify subscribe key and widen the date range |

## Best Practices

- Use `new_vs_recurring_users` with `period=daily` over a week to see day-by-day growth trends.
- For weekly or monthly growth comparisons, use `new_vs_recurring_users` with `period=weekly` or `period=monthly`.
- Combine `unique_users` and `unique_users_combination` to compute engagement rates (users with messages / total users).
- Use `unique_users_by_country` to identify geographic concentration and plan regional infrastructure.
- Top 20 user counts are unique per time period — do not sum values across multiple hours or days.
- To export a wider user list, use `top_1000_users` for deeper analysis.

## Exporting to BizOps

If you have BizOps Workspace access and App Context enabled, you can export the top 20 users from the Insights dashboard to User Management in BizOps. Exported users get:

- Name equal to the user ID from Insights
- `type` set to `imported`
- `sent_messages` set to the count at export time

This is a dashboard feature — the API does not trigger exports directly.

## Related Guides

- [how_to_get_insights_api_access.md](how_to_get_insights_api_access.md) — authentication setup
- [how_to_query_insights_channels.md](how_to_query_insights_channels.md) — channel metrics and top channels
- [how_to_query_insights_messages.md](how_to_query_insights_messages.md) — message volume and types
- [how_to_query_insights_user_behavior_and_devices.md](how_to_query_insights_user_behavior_and_devices.md) — duration and device analytics

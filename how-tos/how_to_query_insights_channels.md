---
resource: channels
base_url: https://admin-api.pubnub.com/v2/insights
triggers:
  - top channels
  - top 20 channels
  - top 1000 channels
  - unique channels
  - channels with messages
  - channel patterns
  - channels by messages
  - channels by subscribers
  - channel activity
  - channel analytics
  - channel engagement
  - how many channels
requires:
  - insights api key (see how_to_get_insights_api_access.md)
  - subscribe key for the keyset to query
produces:
  - channel counts, rankings, and engagement data (no resource IDs — read-only analytics)
---

# How to Query Insights Channel Metrics

> **Prerequisites**
>
> - An Insights API key with **Insights Read** permission (see [how_to_get_insights_api_access.md](how_to_get_insights_api_access.md))
> - A subscribe key (`sub-c-...`) for the keyset you want to query
> - Insights Premium plan

The Channels dashboard in PubNub Insights shows analytics for unique channels in your Pub/Sub API. Through the API, you can retrieve channel counts, identify your most active channels, and analyze channel patterns — all programmatically.

> **Channel groups are excluded.** The Channels dashboard and its API metrics cover individual channels only. Channel group data is not included.

Channel metrics span two endpoints:

| Endpoint | Metrics |
|---|---|
| `GET /v2/insights` | `unique_channels`, `unique_channels_combination`, `percent_unique_channels_with_messages`, `channel_patterns` |
| `GET /v2/insights/top` | `top_20_channels`, `top_1000_channels` |

## Using the insights Tool

### Unique channels per day

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "unique_channels",
  "period": "daily",
  "start_date": "2026-04-01",
  "end_date": "2026-04-07"
}
```

### Unique channels per week

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "unique_channels",
  "period": "weekly",
  "start_date": "2026-03-01",
  "end_date": "2026-04-07"
}
```

### Top 20 channels by messages in the last week

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "top_20_channels",
  "period": "daily",
  "start_date": "2026-04-01",
  "end_date": "2026-04-07",
  "category": "by_messages"
}
```

### Top 20 channels by subscribers

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "top_20_channels",
  "period": "daily",
  "start_date": "2026-04-01",
  "end_date": "2026-04-07",
  "category": "by_subscribers"
}
```

### Top 1000 channels by messages (for expanded download)

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "top_1000_channels",
  "period": "daily",
  "start_date": "2026-04-01",
  "end_date": "2026-04-07",
  "category": "by_messages"
}
```

### Channel patterns (filtered and sorted)

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "channel_patterns",
  "period": "daily",
  "start_date": "2026-04-01",
  "end_date": "2026-04-07",
  "filter": "startsWith:group.",
  "orderBy": "count_messages:desc",
  "limit": 50
}
```

---

## Metric Reference

### `unique_channels`

Returns the number of unique channels for each time period in the date range.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=unique_channels&period=daily&start_date=2026-04-01&end_date=2026-04-07" \
  -H "Authorization: YOUR_API_KEY" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

**Sample response:**

```json
{
  "data": [
    { "timestamp_value": "2026-04-01T00:00:00Z", "unique_channels": 1245 },
    { "timestamp_value": "2026-04-02T00:00:00Z", "unique_channels": 1302 },
    { "timestamp_value": "2026-04-03T00:00:00Z", "unique_channels": 1198 }
  ]
}
```

**Supported periods:** `hourly`, `daily`, `weekly`, `monthly`

---

### `unique_channels_combination`

Returns unique channels alongside unique channels with messages and unique channels with message chats (text messages). Useful for understanding what fraction of channels are actively used for messaging vs. just existing.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=unique_channels_combination&period=daily&start_date=2026-04-01&end_date=2026-04-07" \
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
      "unique_channels": 1245,
      "unique_channels_with_messages": 892,
      "unique_channels_with_chats": 734
    }
  ]
}
```

The `unique_channels_with_chats` field appears when the keyset's use case includes **Chat**. Chat messages are text messages as defined by PubNub's payload type conventions.

**Supported periods:** `hourly`, `daily`, `weekly`, `monthly`

---

### `percent_unique_channels_with_messages`

Returns the percentage of channels that had messages out of all unique channels.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=percent_unique_channels_with_messages&period=daily&start_date=2026-04-01&end_date=2026-04-07" \
  -H "Authorization: YOUR_API_KEY" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

**Sample response:**

```json
{
  "data": [
    { "timestamp_value": "2026-04-01T00:00:00Z", "percent_unique_channels_with_messages": 71.6 }
  ]
}
```

**Supported periods:** `hourly`, `daily`, `weekly`, `monthly`

---

### `channel_patterns`

Returns channel activity and performance data. Supports filtering by channel name, sorting, and limiting results. Use this to analyze engagement and activity across channel groups or naming conventions.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=channel_patterns&period=daily&start_date=2026-04-01&end_date=2026-04-07&filter=startsWith:group.&orderBy=count_messages:desc&limit=20" \
  -H "Authorization: YOUR_API_KEY" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

#### Parameters

| Parameter | Description | Example |
|---|---|---|
| `filter` | Filter by channel name. Operators: `startsWith`, `eq` | `startsWith:group.` |
| `limit` | Number of results to return | `20` |
| `orderBy` | Sort by field in ascending or descending order | `count_messages:desc`, `timestamp_value:asc` |

**Sample response:**

```json
{
  "data": [
    {
      "channel_pattern": "group.*",
      "count_messages": 45230,
      "count_subscribers": 1820,
      "timestamp_value": "2026-04-01T00:00:00Z"
    }
  ]
}
```

---

### `top_20_channels`

Returns the top 20 channels ranked by a selected category. Use the `/insights/top` endpoint.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights/top?subscribe_key=sub-c-YOUR-KEY&metric=top_20_channels&period=daily&start_date=2026-04-01&end_date=2026-04-07&category=by_messages" \
  -H "Authorization: YOUR_API_KEY" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

#### Categories

| Category | Ranks channels by |
|---|---|
| `all` | All available categories combined |
| `by_messages` | Number of messages published |
| `by_chats` | Number of chat (text) messages published |
| `by_subscribers` | Number of subscribers |
| `by_users_with_messages` | Number of unique users who published messages |
| `by_users_with_chats` | Number of unique users who published chat messages |

#### Response Categories

The response includes these fields for each channel:

| Field | Description |
|---|---|
| `count_messages` | Number of messages published |
| `count_subscribers` | Number of subscribers for the channel |
| `count_users_with_messaging` | Number of unique users publishing messages |
| `count_chat` | Number of chat (text) messages published |
| `count_users_with_chat` | Number of unique users publishing chat messages |
| `timestamp_value` | UTC timestamp of the hour or day |

**Sample response:**

```json
{
  "data": [
    {
      "channel": "group.general",
      "count_messages": 8923,
      "count_subscribers": 342,
      "count_users_with_messaging": 287,
      "count_chat": 7651,
      "count_users_with_chat": 265,
      "timestamp_value": "2026-04-01T00:00:00Z"
    },
    {
      "channel": "group.support",
      "count_messages": 5412,
      "count_subscribers": 198,
      "count_users_with_messaging": 156,
      "count_chat": 4890,
      "count_users_with_chat": 142,
      "timestamp_value": "2026-04-01T00:00:00Z"
    }
  ]
}
```

> **Top 20 channels are unique per time period and cannot be summed across hours or days.** Select a single hour or date for accurate rankings.

**Supported periods:** `hourly`, `daily` only

---

### `top_1000_channels`

Same as `top_20_channels` but returns the top 1000 channels. Available to Insights Premium users for expanded data download.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights/top?subscribe_key=sub-c-YOUR-KEY&metric=top_1000_channels&period=daily&start_date=2026-04-01&end_date=2026-04-07&category=by_messages" \
  -H "Authorization: YOUR_API_KEY" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

Uses the same categories and response fields as `top_20_channels`.

**Supported periods:** `hourly`, `daily` only

---

## Period Restrictions

| Metric | `hourly` | `daily` | `weekly` | `monthly` |
|---|---|---|---|---|
| `unique_channels` | Yes | Yes | Yes | Yes |
| `unique_channels_combination` | Yes | Yes | Yes | Yes |
| `percent_unique_channels_with_messages` | Yes | Yes | Yes | Yes |
| `channel_patterns` | Yes | Yes | Yes | Yes |
| `top_20_channels` | Yes | Yes | No | No |
| `top_1000_channels` | Yes | Yes | No | No |

> **Top channel rankings (`top_20_channels`, `top_1000_channels`) are only available with `hourly` or `daily` periods.** Use `unique_channels` for weekly and monthly channel counts.

## Common Errors

| HTTP | Symptom | Cause | Fix |
|---|---|---|---|
| `400` | Invalid metric | Typo in metric name | Use exact metric names from this guide |
| `400` | Invalid period for metric | Using `weekly`/`monthly` with `top_20_channels` | Use `hourly` or `daily` for top channel metrics |
| `400` | Invalid category | Missing or wrong `category` for top metrics | Include a valid category (`by_messages`, `by_subscribers`, etc.) |
| `401` | Unauthorized | Invalid API key | Check `Authorization` header |
| Empty `data` array | No data for the requested range | No channel activity in the date range, or wrong subscribe key | Verify subscribe key and widen the date range |

## Best Practices

- Use `daily` period for most channel ranking queries — it gives a full-day view without the noise of hourly fluctuations.
- For "top channels this week," query `top_20_channels` with `period=daily` over a 7-day range. Each day's response shows that day's top 20.
- Use `channel_patterns` with `filter=startsWith:` to analyze channel groups (e.g., `group.*`, `direct.*`, `system.*`).
- To track channel growth over time, query `unique_channels` with `period=weekly` or `period=monthly`.
- Top 20 channel counts are unique per time period — do not sum values across multiple hours or days.

## Related Guides

- [how_to_get_insights_api_access.md](how_to_get_insights_api_access.md) — authentication setup
- [how_to_query_insights_users.md](how_to_query_insights_users.md) — user metrics and top users
- [how_to_query_insights_messages.md](how_to_query_insights_messages.md) — message volume and types
- [how_to_query_insights_user_behavior_and_devices.md](how_to_query_insights_user_behavior_and_devices.md) — duration and device analytics

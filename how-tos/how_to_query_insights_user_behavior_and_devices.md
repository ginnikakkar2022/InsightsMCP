---
resource: user-behavior-devices
base_url: https://admin-api.pubnub.com/v2/insights
triggers:
  - user duration
  - avg duration
  - average duration
  - connected time
  - session length
  - device types
  - unique devices
  - publishes by device
  - subscribers by device
  - users by device
  - iOS users
  - Android users
  - device analytics
  - top channels with duration
  - how long users stay connected
requires:
  - insights api key (see how_to_get_insights_api_access.md)
  - subscribe key for the keyset to query
produces:
  - user duration metrics, device type breakdowns, and channel duration rankings (no resource IDs — read-only analytics)
---

# How to Query Insights User Behavior & Device Metrics

> **Prerequisites**
>
> - An Insights API key with **Insights Read** permission (see [how_to_get_insights_api_access.md](how_to_get_insights_api_access.md))
> - A subscribe key (`sub-c-...`) for the keyset you want to query
> - Insights Premium plan (User Behavior & Devices dashboard is Premium-only)

The User Behavior & Devices dashboard provides insights into how users engage with your application: how long they stay connected, how many users stay for different durations, and what device types they use.

These metrics span two endpoints:

| Endpoint | Metrics |
|---|---|
| `GET /v2/insights` | `avg_user_duration`, `unique_users_by_duration_timeframe`, `publishes_by_device_type`, `subscribers_by_device_type`, `unique_users_by_device_type` |
| `GET /v2/insights/top` | `top_20_channels_with_user_duration`, `top_1000_channels_with_user_duration` |

## Using the query_insights Tool

### Average user duration (hourly)

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "avg_user_duration",
  "period": "hourly",
  "start_date": "2026-04-07",
  "end_date": "2026-04-07"
}
```

### Unique users by duration timeframe

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "unique_users_by_duration_timeframe",
  "period": "hourly",
  "start_date": "2026-04-07",
  "end_date": "2026-04-07"
}
```

### Unique users by device type (daily)

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "unique_users_by_device_type",
  "period": "daily",
  "start_date": "2026-04-01",
  "end_date": "2026-04-07"
}
```

### Unique users by device type (weekly)

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "unique_users_by_device_type",
  "period": "weekly",
  "start_date": "2026-03-01",
  "end_date": "2026-04-07"
}
```

### Publishes by device type

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "publishes_by_device_type",
  "period": "daily",
  "start_date": "2026-04-01",
  "end_date": "2026-04-07"
}
```

### Subscribers by device type

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "subscribers_by_device_type",
  "period": "daily",
  "start_date": "2026-04-01",
  "end_date": "2026-04-07"
}
```

### Top 20 channels with user duration (by messages)

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "top_20_channels_with_user_duration",
  "period": "hourly",
  "start_date": "2026-04-07",
  "end_date": "2026-04-07",
  "category": "by_messages"
}
```

---

## Metric Reference — User Duration

### `avg_user_duration`

Returns the average time users stay connected to all channels per hour. For users with multiple connections to a channel, the API uses the longest session.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=avg_user_duration&period=hourly&start_date=2026-04-07&end_date=2026-04-07" \
  -H "Authorization: YOUR_API_KEY" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

**Sample response:**

```json
{
  "data": [
    { "timestamp_value": "2026-04-07T00:00:00Z", "avg_user_duration": 18.4 },
    { "timestamp_value": "2026-04-07T01:00:00Z", "avg_user_duration": 12.7 },
    { "timestamp_value": "2026-04-07T02:00:00Z", "avg_user_duration": 8.3 },
    { "timestamp_value": "2026-04-07T08:00:00Z", "avg_user_duration": 24.6 },
    { "timestamp_value": "2026-04-07T12:00:00Z", "avg_user_duration": 31.2 }
  ]
}
```

> Duration values represent minutes. Use this to identify peak engagement hours.

**Supported periods:** `hourly` only

---

### `unique_users_by_duration_timeframe`

Returns the number of unique users bucketed by how long they stay connected in each hour. Timeframe buckets show engagement distribution.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=unique_users_by_duration_timeframe&period=hourly&start_date=2026-04-07&end_date=2026-04-07" \
  -H "Authorization: YOUR_API_KEY" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

**Sample response:**

```json
{
  "data": [
    {
      "timestamp_value": "2026-04-07T12:00:00Z",
      "user_duration_0_5_min": 842,
      "user_duration_5_10_min": 523,
      "user_duration_10_15_min": 312,
      "user_duration_15_20_min": 198,
      "user_duration_20_30_min": 156,
      "user_duration_30_40_min": 89,
      "user_duration_40_50_min": 45,
      "user_duration_50_60_min": 23
    }
  ]
}
```

#### Duration Buckets

| Field | Duration range |
|---|---|
| `user_duration_0_5_min` | 0–5 minutes |
| `user_duration_5_10_min` | 5–10 minutes |
| `user_duration_10_15_min` | 10–15 minutes |
| `user_duration_15_20_min` | 15–20 minutes |
| `user_duration_20_30_min` | 20–30 minutes |
| `user_duration_30_40_min` | 30–40 minutes |
| `user_duration_40_50_min` | 40–50 minutes |
| `user_duration_50_60_min` | 50–60 minutes |

**Supported periods:** `hourly` only

---

### `top_20_channels_with_user_duration`

Returns the top 20 channels with average user duration and the number of users by duration timeframe. Uses the `/insights/top` endpoint. Requires a `category` parameter.

#### Categories

| Category | Ranks channels by |
|---|---|
| `all` | All available categories combined |
| `by_messages` | Number of messages published |
| `by_subscribers` | Number of subscribers |
| `by_users_with_messages` | Number of unique users who published messages |

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights/top?subscribe_key=sub-c-YOUR-KEY&metric=top_20_channels_with_user_duration&period=hourly&start_date=2026-04-07&end_date=2026-04-07&category=by_messages" \
  -H "Authorization: YOUR_API_KEY" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

**Sample response:**

```json
{
  "data": [
    {
      "channel": "group.general",
      "avg_user_duration": 28.5,
      "user_duration_0_5_min": 120,
      "user_duration_5_10_min": 89,
      "user_duration_10_15_min": 67,
      "user_duration_15_20_min": 45,
      "user_duration_20_30_min": 34,
      "user_duration_30_40_min": 21,
      "user_duration_40_50_min": 12,
      "user_duration_50_60_min": 8
    },
    {
      "channel": "group.support",
      "avg_user_duration": 15.2,
      "user_duration_0_5_min": 245,
      "user_duration_5_10_min": 134,
      "user_duration_10_15_min": 78,
      "user_duration_15_20_min": 32,
      "user_duration_20_30_min": 18,
      "user_duration_30_40_min": 9,
      "user_duration_40_50_min": 4,
      "user_duration_50_60_min": 2
    }
  ]
}
```

Each channel entry includes the `avg_user_duration` plus all eight duration bucket counts, showing the full distribution of how long users stay connected to that channel.

**Supported periods:** `hourly` only

---

### `top_1000_channels_with_user_duration`

Same as `top_20_channels_with_user_duration` but returns the top 1000 channels. Available for expanded data download. Uses the same categories.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights/top?subscribe_key=sub-c-YOUR-KEY&metric=top_1000_channels_with_user_duration&period=hourly&start_date=2026-04-07&end_date=2026-04-07&category=by_messages" \
  -H "Authorization: YOUR_API_KEY" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

Uses the same response fields as `top_20_channels_with_user_duration`.

**Supported periods:** `hourly` only

---

## Metric Reference — Device Types

### `publishes_by_device_type`

Returns the number of publish calls grouped by device type (iOS, Android, Windows, Web, etc.).

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=publishes_by_device_type&period=daily&start_date=2026-04-01&end_date=2026-04-07" \
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
      "device_type": "iOS",
      "publishes": 45230
    },
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "device_type": "Android",
      "publishes": 38120
    },
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "device_type": "Web",
      "publishes": 22450
    },
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "device_type": "Windows",
      "publishes": 3280
    }
  ]
}
```

**Supported periods:** `hourly`, `daily`, `weekly`, `monthly`

---

### `subscribers_by_device_type`

Returns the number of subscribe calls grouped by device type.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=subscribers_by_device_type&period=daily&start_date=2026-04-01&end_date=2026-04-07" \
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
      "device_type": "iOS",
      "subscribers": 12450
    },
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "device_type": "Android",
      "subscribers": 10820
    },
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "device_type": "Web",
      "subscribers": 8340
    }
  ]
}
```

**Supported periods:** `hourly`, `daily`, `weekly`, `monthly`

---

### `unique_users_by_device_type`

Returns unique user counts grouped by device type. This is the primary metric for answering "how many unique devices" or "what devices are my users on."

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=unique_users_by_device_type&period=daily&start_date=2026-04-01&end_date=2026-04-07" \
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
      "device_type": "iOS",
      "unique_users": 1823
    },
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "device_type": "Android",
      "unique_users": 1456
    },
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "device_type": "Web",
      "unique_users": 892
    },
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "device_type": "Windows",
      "unique_users": 234
    }
  ]
}
```

**Supported periods:** `hourly`, `daily`, `weekly`, `monthly`

---

## Period Restrictions

| Metric | `hourly` | `daily` | `weekly` | `monthly` |
|---|---|---|---|---|
| `avg_user_duration` | Yes | No | No | No |
| `unique_users_by_duration_timeframe` | Yes | No | No | No |
| `top_20_channels_with_user_duration` | Yes | No | No | No |
| `top_1000_channels_with_user_duration` | Yes | No | No | No |
| `publishes_by_device_type` | Yes | Yes | Yes | Yes |
| `subscribers_by_device_type` | Yes | Yes | Yes | Yes |
| `unique_users_by_device_type` | Yes | Yes | Yes | Yes |

> **All duration metrics (`avg_user_duration`, `unique_users_by_duration_timeframe`, and channels with user duration) are `hourly` only.** Duration is measured per hour — there is no daily, weekly, or monthly aggregation for these metrics.
>
> **Device type metrics (`publishes_by_device_type`, `subscribers_by_device_type`, `unique_users_by_device_type`) support all periods.**

## Common Errors

| HTTP | Symptom | Cause | Fix |
|---|---|---|---|
| `400` | Invalid period for metric | Using `daily`/`weekly`/`monthly` with `avg_user_duration` | Use `hourly` only for duration metrics |
| `400` | Invalid period for metric | Using `daily`/`weekly`/`monthly` with `top_20_channels_with_user_duration` | Use `hourly` only |
| `403` | Forbidden | User Behavior & Devices is Premium-only | Upgrade to Insights Premium |
| Empty `data` array | No data for range | No activity in the date range or wrong subscribe key | Verify subscribe key and check date range |

## Best Practices

- **Duration metrics are hourly:** Query `avg_user_duration` and `unique_users_by_duration_timeframe` with `period=hourly` over a single day to see engagement patterns across hours.
- **Combine duration with user counts:** Query `avg_user_duration` alongside `unique_users` (from the users how-to) to correlate engagement depth with audience size.
- **Device type analysis:** Use `unique_users_by_device_type` with `period=daily` for platform distribution trends. Use `publishes_by_device_type` to see which platforms generate the most traffic.
- **Tailor features by device:** Compare `publishes_by_device_type` against `subscribers_by_device_type` to identify platforms that consume more than they produce (read-heavy) vs. produce more than they consume (write-heavy).
- **Top channels with duration:** Use `top_20_channels_with_user_duration` to find which channels keep users engaged longest — useful for identifying sticky content or features.
- **Duration bucket analysis:** The 8 duration buckets in `unique_users_by_duration_timeframe` reveal whether users are briefly checking in (0-5 min) or deeply engaged (50-60 min). A healthy engagement distribution depends on your use case.

## Related Guides

- [how_to_get_insights_api_access.md](how_to_get_insights_api_access.md) — authentication setup
- [how_to_query_insights_channels.md](how_to_query_insights_channels.md) — channel metrics and top channels
- [how_to_query_insights_users.md](how_to_query_insights_users.md) — user metrics and top users
- [how_to_query_insights_messages.md](how_to_query_insights_messages.md) — message volume and types

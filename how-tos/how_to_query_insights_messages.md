---
resource: messages
base_url: https://admin-api.pubnub.com/v2/insights
triggers:
  - message count
  - message volume
  - messages per day
  - messages per week
  - top message types
  - top 10 message types
  - message types
  - messages by country
  - message analytics
  - how many messages
  - message type breakdown
  - chat messages
requires:
  - insights api key (see how_to_get_insights_api_access.md)
  - subscribe key for the keyset to query
produces:
  - message counts, type breakdowns, and geographic distribution (no resource IDs — read-only analytics)
---

# How to Query Insights Message Metrics

> **Prerequisites**
>
> - An Insights API key with **Insights Read** permission (see [how_to_get_insights_api_access.md](how_to_get_insights_api_access.md))
> - A subscribe key (`sub-c-...`) for the keyset you want to query
> - Insights Premium plan

The Messages dashboard in PubNub Insights shows message data across your channels. Through the API, you can track message volume over time, identify top message types, and see geographic distribution of messaging activity.

All message metrics use the `GET /v2/insights` endpoint.

| Endpoint | Metrics |
|---|---|
| `GET /v2/insights` | `messages`, `top_10_message_types`, `message_by_country` |

## Using the query_insights Tool

### Total messages per day

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "messages",
  "period": "daily",
  "start_date": "2026-04-01",
  "end_date": "2026-04-07"
}
```

### Total messages per week

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "messages",
  "period": "weekly",
  "start_date": "2026-03-01",
  "end_date": "2026-04-07"
}
```

### Total messages per month

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "messages",
  "period": "monthly",
  "start_date": "2026-01-01",
  "end_date": "2026-04-07"
}
```

### Top 10 message types (daily)

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "top_10_message_types",
  "period": "daily",
  "start_date": "2026-04-01",
  "end_date": "2026-04-07"
}
```

### Top 10 message types (hourly)

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "top_10_message_types",
  "period": "hourly",
  "start_date": "2026-04-07",
  "end_date": "2026-04-07"
}
```

### Messages by country

```json
{
  "subscribe_key": "sub-c-...",
  "metric": "message_by_country",
  "period": "daily",
  "start_date": "2026-04-01",
  "end_date": "2026-04-07"
}
```

---

## Metric Reference

### `messages`

Returns the total number of messages published for each time period in the date range.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=messages&period=daily&start_date=2026-04-01&end_date=2026-04-07" \
  -H "Authorization: YOUR_API_KEY" \
  -H "PubNub-Version: 2026-03-01" \
  -H "Content-Type: application/json"
```

**Sample response:**

```json
{
  "data": [
    { "timestamp_value": "2026-04-01T00:00:00Z", "messages": 145230 },
    { "timestamp_value": "2026-04-02T00:00:00Z", "messages": 152847 },
    { "timestamp_value": "2026-04-03T00:00:00Z", "messages": 138912 }
  ]
}
```

**Supported periods:** `hourly`, `daily`, `weekly`, `monthly`

---

### `top_10_message_types`

Returns the top 10 message types and their counts for the selected period. Message types are determined by the JSON path configured in **Messages Configuration** in the Insights dashboard settings.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=top_10_message_types&period=daily&start_date=2026-04-01&end_date=2026-04-07" \
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
      "message_type": "text",
      "count": 98450
    },
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "message_type": "image",
      "count": 23100
    },
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "message_type": "reaction",
      "count": 15820
    },
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "message_type": "file",
      "count": 4230
    }
  ]
}
```

**Supported periods:** `hourly`, `daily` only

### Message Type Configuration

Message types are tracked based on a JSON path in your message payload. There are two ways this works:

1. **Automatic (Chat use case):** If "In-app Chat" is selected as a use case and your messages follow [PubNub's payload type conventions](https://www.pubnub.com/docs/general/messages/type), the chart fills in automatically with:
   - **Top 10 Message Types** — breakdown by message type
   - **Count of Message Type that is Chat** — text message count

2. **Custom JSON path:** If your implementation does not follow PubNub's default schema, configure a custom JSON path in **Insights > Dashboard Settings > Messages Configuration** to point to the field in your message payload that indicates the message type.

> **If `top_10_message_types` returns empty data**, check that either: (a) your messages follow PubNub's payload type conventions, or (b) you have configured a custom JSON path in Messages Configuration.

---

### `message_by_country`

Returns message counts broken down by country, with timestamps.

```bash
curl -s -X GET "https://admin-api.pubnub.com/v2/insights?subscribe_key=sub-c-YOUR-KEY&metric=message_by_country&period=daily&start_date=2026-04-01&end_date=2026-04-07" \
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
      "messages": 67230
    },
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "country": "GB",
      "messages": 18450
    },
    {
      "timestamp_value": "2026-04-01T00:00:00Z",
      "country": "IN",
      "messages": 12840
    }
  ]
}
```

**Supported periods:** `hourly`, `daily` only

---

## Period Restrictions

| Metric | `hourly` | `daily` | `weekly` | `monthly` |
|---|---|---|---|---|
| `messages` | Yes | Yes | Yes | Yes |
| `top_10_message_types` | Yes | Yes | No | No |
| `message_by_country` | Yes | Yes | No | No |

> **`top_10_message_types` and `message_by_country` are only available with `hourly` or `daily` periods.** Use `messages` for weekly and monthly aggregate message counts.

## Common Errors

| HTTP | Symptom | Cause | Fix |
|---|---|---|---|
| `400` | Invalid period for metric | Using `weekly`/`monthly` with `top_10_message_types` | Use `hourly` or `daily` |
| `400` | Invalid period for metric | Using `weekly`/`monthly` with `message_by_country` | Use `hourly` or `daily` |
| Empty `data` for `top_10_message_types` | No message types tracked | Messages don't follow PubNub's payload conventions and no custom JSON path is configured | Configure a JSON path in Messages Configuration |
| Empty `data` array | No data for range | No message activity in the date range or wrong subscribe key | Verify subscribe key and widen the date range |

## Best Practices

- Use `messages` with `period=daily` for a week-over-week volume comparison.
- Use `messages` with `period=monthly` for long-term trend analysis.
- To get a full picture of messaging activity, query `messages` alongside `unique_users` (from the users how-to) to compute messages-per-user ratios.
- If `top_10_message_types` returns empty data, check the JSON path configuration in Insights Dashboard Settings.
- Use `message_by_country` to understand geographic distribution and optimize infrastructure placement.
- For hourly message volume analysis, use `period=hourly` over a single day to identify peak usage times.

## Related Guides

- [how_to_get_insights_api_access.md](how_to_get_insights_api_access.md) — authentication setup
- [how_to_query_insights_channels.md](how_to_query_insights_channels.md) — channel metrics and top channels
- [how_to_query_insights_users.md](how_to_query_insights_users.md) — user metrics and top users
- [how_to_query_insights_user_behavior_and_devices.md](how_to_query_insights_user_behavior_and_devices.md) — duration and device analytics

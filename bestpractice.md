## 1) Apps, keysets and environments

### App and Keysets and environment separation

Best practice:

- Use distinct keysets per environment: **dev**, **staging**, **production**.
- Keep keys out of source control; manage them as secrets.
- Never expose secret keys to clients.

MCP tool pointers:

- Use **`manage_apps`** to list, create, inspect, and update apps.
- Use **`manage_keysets`** to list, create, inspect, and update keysets.

---

## 2) Define scope and choose the right documentation tool

Checklist:

- Define required real-time features (chat, presence, live feed, IoT telemetry, notifications).
- Set measurable requirements (latency, concurrency, message rate, offline behavior, retention).

MCP tool pointers:

- For chat/messaging apps, use **`get_chat_sdk_documentation`**.
- For non-chat real-time apps (IoT, state sync, notifications, analytics), use **`get_sdk_documentation`**.
- For conceptual, step-by-step guides and integrations, use **`how_to`**.
- For best practices across architecture, security, reliability, and performance, use **`write_pubnub_app`**.

---

## 3) Architecture and project setup

Best practice:

- Client: real-time UI/UX.
- Server: authentication, permissions, and issuing Access Manager tokens.
- Separate configs by environment to change timeouts and retry behavior without new app releases.

Key guidance:

- Use PubNub for low-latency fan-out and orchestration.
- Keep payloads small; for large blobs (media/docs), publish references and store separately (or use PubNub Files where appropriate).

MCP tool pointers:

- Use **`write_pubnub_app`** to validate architecture and production assumptions.
- Use **`get_sdk_documentation`** (core) or **`get_chat_sdk_documentation`** (chat) for implementation details.

---

## 4) UI/UX design for real time

Checklist:

- Design around real-time events (delivery, updates, presence, errors).
- Include accessibility (keyboard navigation, screen readers).
- Handle reconnection and retry flows gracefully.

Platform specifics:

- Mobile: use push providers for background wakeups/alerts; cache minimal data locally to resume quickly.
- Web: manage tab lifecycle; for background toasts across tabs, consider a Service Worker approach.

MCP tool pointers:

- Use **`how_to`** for platform-specific integration guidance.
- Use **`get_chat_sdk_documentation`** for chat UX features (typing indicators, receipts, etc.).
- Use **`get_sdk_documentation`** (core) for non-chat real-time apps.

---

## 5) Channel and data modeling

### Channel naming

Best practice:

- Use deterministic, path-like names (dot segments).
- Avoid PII in channel names unless encrypted; prefer opaque identifiers.

Examples:

- `app.tenant.<tenantId>.room.<roomId>`
- `user.<userId>.dm`
- `order.<orderId>.status`

### Message schema and envelopes

Best practice:

- Use structured JSON envelopes with:

  - schema version
  - client-generated message ID (for idempotency/dedupe)
  - explicit message type (chat/event/cmd/status)

- Store server timetokens on receive if you need ordering/replay semantics.

Ordering rule:

- Rely on per-channel ordering only; never assume cross-channel ordering.

Illuminate note:

- Illuminate ingests PubNub messages and wraps them as `{ "message": { "body": <your_pubnub_message> } }`. All Business Object field JSONPath expressions must use the `$.message.body.{field}` prefix (e.g., `$.message.body.user_id`).

MCP tool pointers:

- Use **`write_pubnub_app`** for channel and schema guidance.
- Use **`get_sdk_documentation`** for core patterns and API behavior.
- Use **`get_chat_sdk_documentation`** for chat-specific modeling patterns.
- Use **`manage_illuminate`** to create and manage Business Objects once your channel and message schema are defined.

---

## 6) Security and access control

Core rules:

- User Access Manager to secure and enforce access to channels, channel groups, and other resources.
- Never ship secret keys.
- Clients use publish/subscribe keys only.
- Issue Access Manager tokens and grants server-side.
- Enforce least privilege: deny by default, grant only what is needed.

PII hygiene:

- Keep PII out of channel names and payloads unless encrypted.
- Use user IDs or opaque references.

MCP tool pointers:

- Use **`write_pubnub_app`** for security best practices.
- Use **`get_sdk_documentation`** for Access Manager implementation reference.
- Use **`how_to`** for configuration-oriented guidance.

---

## 7) Publish/Subscribe implementation and reliability

Checklist:

- Use Publish to send messages and Subscribe to receive them.
- Handle status events and network transitions explicitly.

Reliability patterns:

- Reconnect with backoff and jitter.
- On publish failure, queue locally, retry with bounded attempts, and surface a clear “Try again” UX.
- Use idempotent publishing: include a message ID in every message and dedupe on the consumer side.
- Unsubscribe only from channels you are leaving; avoid unnecessary churn.

MCP tool pointers:

- Use **`send_pubnub_message`** for development, testing, and troubleshooting.
- Use **`subscribe_and_receive_pubnub_messages`** to validate delivery and subscribe behavior.
- Use **`get_sdk_documentation`** for SDK-level connection management.
- Use **`manage_keyset`** to change keyset configuration.

---

## 8) History (Storage & Playback) and replay

Best practice:

- Use History for recent context and offline catch-up.
- Align retention with product needs and cost.
- Paginate with timetokens using bounded page sizes to avoid UI stalls.
- Do not treat History as a long-term data lake; forward events to analytics/storage if needed.

MCP tool pointers:

- Use **`get_pubnub_messages`** to retrieve historical messages for validation and debugging.
- Use **`get_sdk_documentation`** for History/Storage & Playback details.
- Use **`manage_keyset`** to change history configuration.

---

## 9) Presence and user state

Best practice:

- Enable Presence where it improves UX (rooms, lobbies).
- Keep presence state small (role/device/version).
- Limit presence-enabled channels in high-scale systems.

MCP tool pointers:

- Use **`get_pubnub_presence`** to inspect occupancy and where-now behavior.
- Use **`get_sdk_documentation`** for Presence behavior and implementation details.
- Use **`how_to`** for configuration and integration guidance.
- Use **`manage_keyset`** to change presence configuration.

---

## 10) App Context (users, channels, memberships)

Best practice:

- Use App Context as a lightweight directory of user/channel metadata and memberships.
- Keep it lean (names, avatars, roles, mute flags, basic channel labels).
- Store deep domain data in your own database.

MCP tool pointers:

- Use **`manage_app_context`** to manage user profiles, channel metadata, and memberships.
- Use **`get_sdk_documentation`** for Objects/App Context reference and patterns.
- Use **`manage_keyset`** to change App Context configuration.

---

## 11) Functions and edge logic

Best practice:

- Validate at the edge (schema, size, and rate limits).
- For control/command paths, verify authorization, log, and publish ACK/ERR on response channels.
- Use Functions for moderation and routing when it reduces backend complexity.

MCP tool pointers:

- Use **`write_pubnub_app`** for edge patterns and guardrails.
- Use **`how_to`** for conceptual recipes.
- Use **`get_sdk_documentation`** for low-level references.

---

## 12) Observability, performance, testing, deployment

Observability:

- Log and correlate channel, message ID, user ID, and timetoken on send and receive.

Performance and cost:

- Prefer many small messages over one large one.
- Coalesce bursty updates (for example typing indicators).
- Avoid fan-out storms by publishing once to a shared channel where possible.
- Choose regions aligned with user geography and compliance.

Testing checklist:

- Unit tests for schema validation, idempotency, and connection lifecycle.
- Integration tests for real-time UX, offline recovery, and retry behavior.
- Load tests that ramp gradually and track p95/p99 end-to-end latency and token expiry failures.

Illuminate note:

- Use Illuminate Dashboards to visualize real-time metrics and overlay decision trigger events for live observability.
- Use Illuminate Decisions with `PUBNUB_PUBLISH` or `WEBHOOK_EXECUTION` actions to emit alerts when thresholds are crossed, replacing manual polling.

MCP tool pointers:

- Use **`write_pubnub_app`** to cross-check ops and cost hygiene.
- Use **`send_pubnub_message`**, **`subscribe_and_receive_pubnub_messages`**, **`get_pubnub_messages`**, and **`get_pubnub_presence`** during testing and incident triage.
- Use **`manage_illuminate`** to create metrics, decisions, and dashboards for real-time observability.

---

---

## 13) Illuminate overview

### What is Illuminate

Illuminate is PubNub's real-time analytics and automation layer. It ingests data from your PubNub channels, lets you define logic on that data, and triggers actions automatically — without writing backend code.

There are five core resource types, built in dependency order:

| Resource | Purpose |
|---|---|
| Business Object | Defines the schema — which fields to extract from incoming messages |
| Metric | Aggregates Business Object fields over a time window (count, sum, avg, etc.) |
| Query | Flexible pipeline for selecting, filtering, and joining Business Object data |
| Decision | Evaluates conditions against a Metric, Business Object, or Query and fires actions |
| Dashboard | Visualizes Metrics and overlays Decision triggers |

### When to use Illuminate

- Automate trust and safety responses (mute users, publish alerts, update App Context) without a backend
- Track engagement KPIs (message counts, session durations, top users) in real time
- Trigger business logic when thresholds are crossed (patient wait-time alerts, spending limits, spam detection)
- Visualize live event activity and operational health across keysets

MCP tool pointers:

- Use **`manage_illuminate`** to create and manage all Illuminate resource types.
- See `how_to` guides for end-to-end Illuminate setup walkthroughs.

---

## 14) Illuminate authentication and API access

### Service Integration setup

Illuminate uses the PubNub Admin API (`https://admin-api.pubnub.com/v2/illuminate/`). All requests require:

- `Authorization: <api_key>` header
- `PubNub-Version: 2026-02-09` header

API keys come from **Service Integrations** in the Admin Portal:

1. Log in to [Admin Portal](https://admin.pubnub.com).
2. Click your account name → **My Account** → **Organization Settings** → **API Management**.
3. Click **Create Service Integration** and give it a descriptive name (e.g., "Illuminate Automation").
4. Add permission rows at the **Account** level and select **Illuminate** as the resource with **Read & write** access.
5. Click **Create**, then click **+ Generate API Key** and copy it immediately — it is shown only once.
6. Store the key in an environment variable (`ILLUMINATE_API_KEY`) or secrets manager. Never commit it to source control.

### What you also need for resource creation

- **Subscribe key** (`sub-c-...`): Required to activate a Business Object (so Illuminate knows which channel data to ingest) and for `PUBNUB_PUBLISH` Decision actions.
- **Publish key** (`pub-c-...`): Required when configuring `PUBNUB_PUBLISH` actions in Decisions.

Best practice:

- Follow least privilege — create a separate Service Integration for each environment (dev, staging, production).
- Set the shortest practical expiration and rotate keys regularly.
- A single Service Integration can have up to three active API keys, making rotation zero-downtime.

MCP tool pointers:

- Use **`manage_illuminate`** with your API key to create and manage resources.

---

## 15) Illuminate Business Objects

### What they are

Business Objects define the schema for data Illuminate will ingest from your PubNub channels. Each field maps a JSONPath expression to a typed value extracted from incoming messages.

### Message wrapping

Illuminate wraps every PubNub message as:

```json
{ "message": { "body": <your_pubnub_message> } }
```

All JSONPath expressions must therefore start with `$.message.body.` — for example, `$.message.body.user_id`.

### Field types

| Type | Use for |
|---|---|
| `TEXT` | String values; max 256 characters; use for dimensions (group-by fields) |
| `TEXT_LONG` | Strings up to 1,000 characters; limited to 5 per Business Object |
| `NUMERIC` | Numbers; required for AVG, SUM, MIN, MAX metrics |
| `TIMESTAMP` | ISO 8601 timestamps; used in TIME_DIFF derived fields |
| `BOOLEAN` | True/false values |

### Activation sequence

1. Create the Business Object with `isActive: false` and define all fields (omit field `id` on create — the API auto-generates them).
2. Add at least one subscribe key to the `subkeys` array.
3. Set `isActive: true` to begin data collection.

Best practice:

- To add or remove fields, set `isActive: false` first. You cannot modify fields while active.
- Deactivating pauses data collection immediately — deactivate any dependent Decisions first.
- Deleting a Business Object **cascades**: all associated Metrics, Decisions, Dashboards, and Queries are permanently deleted.
- Maximum 100 fields per Business Object.

MCP tool pointers:

- Use **`manage_illuminate`** to create, update, activate, and delete Business Objects.

---

## 16) Illuminate Metrics

### What they are

Metrics define aggregations applied to Business Object fields over a fixed time window. They are the data source for Decisions (threshold-based) and Dashboard charts.

### Aggregation functions

| Function | `measureId` required? | Field type |
|---|---|---|
| `COUNT` | No | Any |
| `COUNT_DISTINCT` | No | Any |
| `AVG` | Yes | `NUMERIC` |
| `SUM` | Yes | `NUMERIC` |
| `MIN` | Yes | `NUMERIC` |
| `MAX` | Yes | `NUMERIC` |

### Evaluation windows

Only these values (seconds) are accepted: `60`, `300`, `600`, `900`, `1800`, `3600`, `86400`.

### Dimensions vs measures

- **Dimensions** — `TEXT` fields used for grouping (e.g., user, region, event type). Referenced in `dimensionIds`.
- **Measures** — `NUMERIC` fields that are aggregated. Referenced in `measureId`.

Best practice:

- Add `filters` to scope the Metric to only relevant events (e.g., `event_type STRING_EQUALS purchase`).
- Deactivate all referencing Decisions before updating a Metric — the API rejects updates otherwise.
- Deleting a Metric **cascades** to all referencing Decisions.

MCP tool pointers:

- Use **`manage_illuminate`** to create, update, and delete Metrics.

---

## 17) Illuminate Decisions

### What they are

Decisions evaluate conditions against a Metric, Business Object, or Query and automatically fire actions (publish a message, call a webhook, update App Context metadata) when rules match.

### Source types and inputFields

For all source types, `inputFields` must be **manually specified** in the POST body — they are not auto-populated from the metric or query. Each inputField generates an auto-assigned `id` in the response that rule `inputValues` must reference.

| `sourceType` | `inputFields` pattern | `executionFrequency` |
|---|---|---|
| `METRIC` — aggregation (SUM/AVG/MIN/MAX) | One `MEASURE` field (`sourceId` = metric's `measureId`) + one `DIMENSION` per dimension field | Required |
| `METRIC` — count (COUNT/COUNT_DISTINCT) | One `BUSINESSOBJECT` field (`sourceId` = BO ID, `dataType: "NUMERIC"`) + one `DIMENSION` per dimension field | Required |
| `BUSINESSOBJECT` | One `FIELD` per BO field to evaluate (`sourceId` = BO field ID) | Omit entirely — do not send `null` |
| `QUERY` | One `QUERYFIELD` per query output field (`sourceId` = query field ID from `/queries/{id}/fields`) | Required |

**inputField schema** (fields with auto-generated IDs on POST response):

```json
{ "name": "...", "sourceType": "FIELD|MEASURE|DIMENSION|BUSINESSOBJECT|QUERYFIELD", "sourceId": "...", "dataType": "NUMERIC|TEXT", "order": 1 }
```

> `order` controls the column display order in the Illuminate UI. `dataType` is `NUMERIC` for aggregation/count fields and `TEXT` for dimension fields.

**COUNT metric decision — inputFields example:**

```json
"inputFields": [
  { "name": "Count of My Events", "sourceType": "BUSINESSOBJECT", "sourceId": "<bo-id>",      "dataType": "NUMERIC", "order": 1 },
  { "name": "User ID",             "sourceType": "DIMENSION",      "sourceId": "<user-field>", "dataType": "TEXT",    "order": 2 },
  { "name": "Event Type",          "sourceType": "DIMENSION",      "sourceId": "<type-field>", "dataType": "TEXT",    "order": 3 }
]
```

### Required fields on decision POST

`activeFrom` and `activeUntil` (ISO 8601 UTC) are **required** on every decision creation POST, even though they are documented as optional. Omitting them returns a 500 error.

```json
"activeFrom": "2026-01-01T00:00:00Z",
"activeUntil": "2027-12-31T23:59:59Z"
```

### Action types

| `actionType` | What it does |
|---|---|
| `PUBNUB_PUBLISH` | Publishes a message to a PubNub channel |
| `WEBHOOK_EXECUTION` | POSTs a payload to an external URL |
| `APPCONTEXT_SET_USER_METADATA` | Sets custom fields on a PubNub user object |
| `APPCONTEXT_SET_CHANNEL_METADATA` | Sets custom fields on a PubNub channel object |
| `APPCONTEXT_SET_MEMBERSHIP_METADATA` | Sets custom fields on a user-channel membership |

### Condition operations

`ANY`, `NUMERIC_EQUALS`, `NUMERIC_NOT_EQUALS`, `NUMERIC_GREATER_THAN`, `NUMERIC_GREATER_THAN_EQUALS`, `NUMERIC_LESS_THAN`, `NUMERIC_LESS_THAN_EQUALS`, `NUMERIC_INCLUSIVE_BETWEEN` (argument: `"low,high"`), `STRING_EQUALS`, `STRING_NOT_EQUALS`, `STRING_CONTAINS`.

### Execution limit types

Valid values for `executionLimitType` in `actionValues`:

`ALWAYS` | `ONCE` | `ONCE_PER_INTERVAL` | `ONCE_PER_CONDITION_GROUP` | `ONCE_PER_INTERVAL_PER_CONDITION_GROUP`

> Note: `ONCE_PER_INTERVAL_PER_CONDITION` is **not** a valid value despite appearing in some docs.

### 4-step creation workflow

Decisions require multiple API calls because rules reference auto-generated IDs:

1. **POST** — create with `enabled: false`, `rules: []`. Include all `inputFields`, `outputFields`, and `actions` without `id` fields — they are auto-generated.
2. **Read the response** — extract auto-generated `inputFields[].id`, `outputFields[].id`, and `actions[].id`.
3. **PUT** — send the full body with `rules` referencing those IDs. Every inputField **must** appear in every rule's `inputValues` (use `operation: "ANY"` for don't-care fields).
4. **PUT** — set `enabled: true` to activate.

### Required fields on every Decision POST

The following fields are not properly validated by the API — omitting any of them bypasses input validation and triggers an unhandled database exception, returning `500 Internal Server Error` instead of a descriptive `400`:

| Field | Required value |
|---|---|
| `activeFrom` | ISO 8601 UTC string — e.g. `"2026-01-01T00:00:00Z"` |
| `activeUntil` | ISO 8601 UTC string — e.g. `"2027-12-31T23:59:59Z"` |
| `hitType` | Always `"SINGLE"` |
| `executeOnce` | Always `false` |

### Decision body rules by source type

**BUSINESSOBJECT decisions:**
- Require both `"sourceId": "<bo-id>"` **and** `"businessObjectId": "<bo-id>"` at the top level (set to the same BO ID). Omitting `sourceId` returns `400: "sourceId must be a UUID"`.
- `inputFields` must use `"sourceType": "FIELD"` (not `"DIMENSION"`).
- **Completely omit** `executionFrequency` from PUT bodies — sending `null` triggers a plan error.

**METRIC decisions (COUNT/COUNT_DISTINCT):**
- Use `"sourceType": "BUSINESSOBJECT"` with `sourceId` = the BO ID for the count inputField (there is no `measureId`).
- Use `"sourceType": "DIMENSION"` for each grouped dimension inputField.

**METRIC decisions (SUM/AVG/MIN/MAX):**
- Use `"sourceType": "MEASURE"` with `sourceId` = the metric's `measureId` for the aggregated value.
- Use `"sourceType": "DIMENSION"` for each grouped dimension inputField.

**QUERY decisions:**
- Use `"sourceType": "QUERYFIELD"` for all inputFields.
- Get `sourceId` values from `GET /v2/queries/{id}/fields`.

### Decision action and output field format

- Action objects use `"actionType"` (not `"type"`) — e.g. `"actionType": "WEBHOOK_EXECUTION"`.
- `outputFields` require a `"variable"` field (camelCase identifier used in template references) and a `"name"` field — not a `"type"` field.

### Best practice

- Always create Decisions with `enabled: false` and verify rule logic before activating.
- Active Decisions are immutable for structural fields (`inputFields`, `outputFields`, `actions`) — set `enabled: false` first.
- Every rule's `inputValues` must include an entry for every `inputField` — partial coverage returns `"Number of inputValues (N) does not match number of inputFields (M)"`.
- Template variables support `${outputVariable}` syntax. `PUBNUB_PUBLISH` actions require a valid publish key and subscribe key in the template.
- PUT on Decisions is a **full replacement** — always include the complete body when updating.

### Account limits

| Decision type | Limit | Error |
|---|---|---|
| `METRIC` decisions | 3 per account | `400: "A business object cannot have more than 3 associated decisions."` |
| `QUERY` decisions | ~10–11 per account | `500 Internal Server Error` (no descriptive message) |
| `BUSINESSOBJECT` decisions | No enforced limit | — |

Before creating a new METRIC or QUERY decision, list existing decisions of that type. If at or near the limit, ask the user which existing decision to delete before retrying. Never delete without explicit confirmation.

MCP tool pointers:

- Use **`manage_illuminate`** for the full 4-step creation workflow.

---

## 18) Illuminate Queries

### What they are

Queries define flexible data pipelines over Business Object fields — supporting aggregation, filtering, joins, deduplication, and more. Unlike Metrics (which are fixed aggregations), Queries give full control over data shaping. Saved Queries can be used as Decision sources or in Dashboard charts.

### Pipeline model

```
Sources → Transforms (optional) → Output
```

- **Sources** — reference a Business Object and select fields with a time range.
- **Transforms** — `aggregate`, `window`, `join`, `dedupe`, `calculate`, `unnest`, `filter_join`. Each transform references a source or previous transform by `id`.
- **Output** — specifies which stage to return from, which fields to `select`, `orderBy`, `limit`, and `offset`.

### Query Builder templates

The Illuminate Admin Portal includes four pre-built templates for common use cases:

| Template | Use case |
|---|---|
| Cross-Posting Spam | Detect users posting identical content to multiple channels |
| Chat Flooding Spam | Detect users sending an abnormally high message volume |
| Top N Rankings | Rank the top N users or items by a numeric metric |
| Bottom N Rankings | Rank the bottom N users or items by a numeric metric |

### Ad-hoc vs. saved query format

The `POST /queries/execute` (ad-hoc) endpoint and `POST /queries` (save) endpoint use **different pipeline formats**:

| | Ad-hoc (`POST /queries/execute`) | Saved (`POST /queries`) |
|---|---|---|
| Wrapper | Top-level `version` + `pipeline` | `definition: { version, pipeline }` |
| GroupBy transform type | `"groupBy"` | `"aggregate"` |
| Transform input ref | `"from": "src"` | `"input": "src"` |
| GroupBy structure | Direct `groupBy` + `aggregations` fields | Nested under `"aggregate": { groupBy, aggregations }` |
| Function names | Any case | Lowercase — `"count"`, `"sum"`, `"avg"` |

Always test a pipeline ad-hoc first, then rewrite it to the saved format before calling `POST /queries`.

### Using Queries as Decision sources

1. Create and save a Query.
2. Call `GET /v2/queries/{id}/fields` to retrieve output field IDs.
3. Create a Decision with `sourceType: "QUERY"` and `sourceId: <queryId>`, using the field IDs as `sourceId` values in `inputFields` with `sourceType: "QUERYFIELD"`.

> **Note:** `GET /queries/{id}/predefined-decisions` only works for **Query Builder template** queries (Cross-Posting, Chat Flooding, Top N, Bottom N). It returns `404 Not Found` for custom user-created queries — build the Decision manually for those.

### Best practice

- Use `version: "2.0"` for all queries.
- Test with the ad-hoc execute endpoint (`POST /v2/queries/execute`) before saving.
- Changing a Query's output schema (field names or types) while a Decision references it can break rule references — deactivate the Decision first.
- Deleting a Query does not delete referencing Dashboards or Decisions, but they may stop functioning correctly.
- Accounts have a maximum of ~10 saved Queries. If that limit is reached, the API returns `"You have reached the maximum number of queries allowed. Contact PubNub Support to upgrade."` List the existing queries and ask the user which one to delete before retrying. Never delete without explicit confirmation.

MCP tool pointers:

- Use **`manage_illuminate`** to create, execute, and manage Queries.

---

## 19) Illuminate Dashboards

### What they are

Dashboards group one or more charts, each displaying a Metric over time. Charts can overlay Decision trigger events so you can visually correlate rule firings with metric spikes.

### Chart types

| `viewType` | Description |
|---|---|
| `LINE` | Time-series line chart — best for trend monitoring |
| `BAR` | Bar chart — best for comparing dimensions at a point in time |
| `STACKED` | Stacked bar chart — best for composition breakdowns |

Chart `size` options: `FULL` (full width) or `HALF` (half width, two per row).

### Date ranges

`30 minutes`, `1 hour`, `24 hours`, `3 days`, `1 week`, `30 days`, `3 months`, or `Custom date` (requires `startDate` and `endDate` in ISO 8601).

### Updating dashboards

The `charts` array is a **full replacement** on PUT. Always include all existing charts with their `charts[].id` to avoid accidental deletion.

Best practice:

- Overlay Decision `decisionIds` on charts to visually validate when rules fire against metric changes.
- Use `dimensionIds` on charts to break down metrics by the most operationally relevant dimension (e.g., user, region, event type).
- Deleting a Dashboard only removes the visualization — underlying Metrics and Decisions are not affected.

MCP tool pointers:

- Use **`manage_illuminate`** to create and manage Dashboards and charts.

---

## 20) Insights overview

### What is Insights

PubNub Insights gives you turnkey aggregated metrics and actionable analytics built from your PubNub data and usage. It is read-only — you query it with a metric name, period, and date range and get back analytics data without writing or storing anything.

There are two endpoint families:

| Endpoint | Purpose | Example metrics |
|---|---|---|
| `GET /v2/insights` | Aggregated metrics over time | `unique_channels`, `unique_users`, `messages`, `new_vs_recurring_users`, `publishes_by_device_type` |
| `GET /v2/insights/top` | Ranked / top-N metrics | `top_20_channels`, `top_1000_channels`, `top_20_users`, `top_1000_users`, `top_20_channels_with_user_duration` |

Metrics are organized into five logical groups, mirroring the dashboards in the Admin Portal:

| Group | Examples |
|---|---|
| Channels | `unique_channels`, `unique_channels_combination`, `top_20_channels`, `channel_patterns` |
| Users | `unique_users`, `new_vs_recurring_users`, `top_20_users`, `unique_users_by_country` |
| Messages | `messages`, `top_10_message_types`, `message_by_country` |
| User Behavior | `avg_user_duration`, `unique_users_by_duration_timeframe`, `top_20_channels_with_user_duration` |
| Devices | `publishes_by_device_type`, `subscribers_by_device_type`, `unique_users_by_device_type` |

### When to use Insights

- Track product KPIs (DAU/WAU/MAU, message volume, channel growth) without building a custom analytics pipeline
- Identify your most active channels, users, message types, and device platforms
- Measure user growth via new vs. recurring user counts
- Analyze session duration and engagement depth per channel
- Surface geographic distribution of users and messages
- Audit account health and spot anomalies (sudden drops in unique users, spikes in publishes by device type)

### API access requires Insights Premium

Insights API access is limited to **Insights Premium** customers:

- Starter plan — Premium included
- Pro plan, new customers — Premium included
- Pro plan, existing customers — Standard by default; upgrade to Premium for API access
- Free plan — no API access

Standard tier provides dashboard-only views; the API is Premium-only.

MCP tool pointers:

- Use **`insights`** to query all Insights metrics.
- See `how_to` guides for end-to-end query walkthroughs (channels, users, messages, user behavior & devices).

---

## 21) Insights authentication and API access

### Service Integration setup

Insights uses the PubNub Admin API base URL `https://admin-api.pubnub.com/v2`. All requests require these headers:

| Header | Value |
|---|---|
| `Authorization` | Service Integration API key (starts with `si_`) |
| `PubNub-Version` | Date-based minor version, for example `2026-03-01` |
| `Content-Type` | `application/json` |

API keys come from **Service Integrations** in the Admin Portal:

1. Log in to [Admin Portal](https://admin.pubnub.com).
2. Click your account name → **My Account** → **Organization Settings** → **API Management**.
3. Click **Create Service Integration** and give it a descriptive name (e.g., "Insights Analytics").
4. Add a permission row at the **Account** level and select **Insights** as the resource with **Read** access.
5. Click **Create**, then click **+ Generate API Key** and copy it immediately — it is shown only once.
6. Store the key in the existing `PUBNUB_API_KEY` environment variable (the same Service Integration key used by other admin tools such as `manage_illuminate`) or in a secrets manager. There is **no** separate `INSIGHTS_API_KEY` — Insights reuses `PUBNUB_API_KEY`. Never commit the key to source control.

### Two endpoints, one auth pattern

Both endpoints use the same auth, headers, and base URL. The only difference is the path:

```
GET https://admin-api.pubnub.com/v2/insights        (regular metrics)
GET https://admin-api.pubnub.com/v2/insights/top    (top-N metrics)
```

### What you also need

- **Subscribe key** (`sub-c-...`) — every request must include the keyset's subscribe key as a query parameter (`subscribe_key`). Insights returns analytics for that keyset only.

Best practice:

- Follow least privilege — create a separate Service Integration for each environment (dev, staging, production).
- Use **Insights Read** scope only — write access does not exist for Insights and granting broader scopes increases blast radius if a key leaks.
- Rotate keys regularly; a single Service Integration can have up to three active API keys for zero-downtime rotation.
- All Insights timestamps and date parameters are in **UTC** — convert to/from your application's timezone in the client.

MCP tool pointers:

- Use **`insights`** with your API key to query metrics. The tool resolves the key from the `api_key` argument or the `PUBNUB_API_KEY` env var (the same key used by `manage_illuminate`).

---

## 22) Querying Insights metrics

### Common query parameters

| Parameter | Required | Notes |
|---|---|---|
| `subscribe_key` | Yes | Keyset to query (`sub-c-...`) |
| `metric` | Yes | Metric name (see metric reference in §20) |
| `period` | Yes | `hourly`, `daily`, `weekly`, or `monthly` — not all metrics support all periods |
| `start_date` | Yes | ISO 8601 date (`YYYY-MM-DD`), UTC |
| `end_date` | Yes | ISO 8601 date (`YYYY-MM-DD`), UTC |
| `category` | Conditional | Required for top metrics — `by_messages`, `by_subscribers`, `by_chats`, `by_users_with_messages`, `by_users_with_chats`, `by_subscribed_channels`, or `all` |
| `filter` | No | Filter expression for `channel_patterns` (`startsWith:`, `eq:`) |
| `orderBy` | No | Sort field + direction (`count_messages:desc`) |
| `limit` | No | Number of results to return |

### Period restrictions

Each metric supports a specific subset of periods. Trying to use an unsupported combination returns a 400 error.

| Group | Metrics | `hourly` | `daily` | `weekly` | `monthly` |
|---|---|---|---|---|---|
| Channels | `unique_channels`, `unique_channels_combination`, `percent_unique_channels_with_messages`, `channel_patterns` | Yes | Yes | Yes | Yes |
| Channels | `top_20_channels`, `top_1000_channels` | Yes | Yes | No | No |
| Users | `unique_users`, `unique_users_combination`, `percent_unique_users_with_messages` | Yes | Yes | Yes | Yes |
| Users | `new_vs_recurring_users` | No | Yes | Yes | Yes |
| Users | `unique_users_by_country`, `top_20_users`, `top_1000_users` | Yes | Yes | No | No |
| Messages | `messages` | Yes | Yes | Yes | Yes |
| Messages | `top_10_message_types`, `message_by_country` | Yes | Yes | No | No |
| User Duration | `avg_user_duration`, `unique_users_by_duration_timeframe`, `top_20_channels_with_user_duration`, `top_1000_channels_with_user_duration` | Yes | No | No | No |
| Devices | `publishes_by_device_type`, `subscribers_by_device_type`, `unique_users_by_device_type` | Yes | Yes | Yes | Yes |

### Categories for top metrics

Top metrics (`top_20_channels`, `top_1000_channels`, `top_20_users`, `top_1000_users`) require a `category` parameter that picks the ranking dimension:

| Category | Use to rank by |
|---|---|
| `by_messages` | Number of messages published |
| `by_chats` | Number of chat (text) messages |
| `by_subscribers` | Number of subscribers (channels only) |
| `by_users_with_messages` | Unique users who published messages (channels only) |
| `by_users_with_chats` | Unique users who published chat messages (channels only) |
| `by_subscribed_channels` | Number of channels subscribed to (users only) |
| `all` | All available categories combined |

### Best practice

- Default to `period=daily` for most queries. It gives a clean trend view without the noise of hourly fluctuations and supports the widest set of metrics.
- Use `period=hourly` only when you need intra-day granularity, or for duration metrics where hourly is the only valid period.
- For growth tracking, use `new_vs_recurring_users` with `period=daily`, `weekly`, or `monthly` — the metric explicitly compares against the prior equivalent period and is not available with `hourly`.
- **Top-N counts are unique per time period and cannot be summed across multiple hours or days.** If a user asks for "top channels this week" with `period=daily`, return one ranking per day rather than summing 7 days of counts.
- Use `top_1000_channels` and `top_1000_users` for expanded data download analysis. For typical dashboards or LLM responses, `top_20_*` is sufficient and faster.
- For channel pattern analysis (e.g., all channels starting with `group.`), use the `channel_patterns` metric with `filter=startsWith:group.` rather than fetching `top_1000_channels` and post-filtering.
- Wrap every response interpretation with the period and date range — Insights timestamps are in UTC and unambiguous date framing prevents user confusion.
- For empty data responses, first verify the subscribe key matches the keyset you expect, then widen the date range. Empty data is not always an error — it can mean no activity in the window.

### Common errors

| HTTP | Cause | Fix |
|---|---|---|
| `400` | Invalid `period` for the chosen `metric` | Check the period restriction table above |
| `400` | Missing `category` for a top metric | Add `category=by_messages` (or another valid category) |
| `400` | Both `start_date` and `end_date` missing | Provide an explicit ISO 8601 date range |
| `401` | Invalid or missing API key | Check the `Authorization` header value |
| `403` | API key lacks Insights Read permission | Update the Service Integration scope |
| `403` | Account does not have Insights Premium | Upgrade to Premium in the Admin Portal |

MCP tool pointers:

- Use **`insights`** for all metric queries. The tool routes regular metrics to `/v2/insights` and top metrics to `/v2/insights/top` automatically based on the metric name.
- See `how_to_query_insights_*` guides for per-group walkthroughs with full curl and tool-call examples.

---

## MCP tool pointer summary

- Admin Portal automation: **`manage_apps`**, **`manage_keysets`**
- Docs:

  - Chat: **`get_chat_sdk_documentation`**
  - Core: **`get_sdk_documentation`**
  - Conceptual guides: **`how_to`**
  - Best practices: **`write_pubnub_app`**

- Runtime testing / troubleshooting:

  - **`send_pubnub_message`**, **`subscribe_and_receive_pubnub_messages`**
  - **`get_pubnub_messages`**, **`get_pubnub_presence`**

- App Context (Objects): **`manage_app_context`**
- Illuminate: **`manage_illuminate`** (Business Objects, Metrics, Decisions, Queries, Dashboards)
- Insights: **`insights`** (Channels, Users, Messages, User Behavior & Devices)

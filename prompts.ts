const generateHandler = (text: string) => {
  return () => ({
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text,
        },
      },
    ],
  });
};

// ─── Existing PubNub MCP prompts ─────────────────────────────────────────────

const hipaaChatShort = {
  name: "hipaa-chat-short",
  definition: {
    title: "Create a HIPAA Compliant Chat app",
    description:
      "Example of how to prompt PubNub MCP to create a HIPAA compliant chat application - short version",
  },
  handler: generateHandler(
    "Act as a senior software engineer and use PubNub MCP server to create a chat application for healthcare that is HIPAA compliant."
  ),
};

const hipaaChatLong = {
  name: "hipaa-chat-long",
  definition: {
    title: "Create a HIPAA Compliant Chat app",
    description:
      "Example of how to prompt PubNub MCP to create a HIPAA compliant chat application - long version",
  },
  handler: generateHandler(
    "Act as a senior software engineer and use PubNub MCP server to create a chat application for healthcare that is HIPAA compliant, with Pub/Sub messaging for real-time chat, Presence for patient/doctor availability, and App Context for roles."
  ),
};

const reactAppShort = {
  name: "react-app-short",
  definition: {
    title: "Scaffold React App with PubNub",
    description:
      "Example of how to scaffold a React application with PubNub Pub/Sub and Presence - short version",
  },
  handler: generateHandler(
    "Act as a frontend developer and use PubNub MCP server to scaffold a React app with Pub/Sub messaging and Presence."
  ),
};

const reactAppLong = {
  name: "react-app-long",
  definition: {
    title: "Scaffold React App with PubNub",
    description:
      "Example of how to scaffold a React application with PubNub Pub/Sub and Presence - long version",
  },
  handler: generateHandler(
    "Act as a frontend developer and use PubNub MCP server to scaffold a React app with Pub/Sub messaging for real-time updates, Presence to show when users are online or typing, and App Context to handle user metadata. Include sample React components for subscribing to a channel, publishing messages, and displaying presence indicators for active participants."
  ),
};

const gamelobbyShort = {
  name: "gamelobby-short",
  definition: {
    title: "Build Multiplayer Game Lobby",
    description:
      "Example of how to build a multiplayer game lobby with chat and presence - short version",
  },
  handler: generateHandler(
    "Act as a game developer and use PubNub MCP server to build a multiplayer lobby with chat and Presence indicators."
  ),
};

const gamelobbyLong = {
  name: "gamelobby-long",
  definition: {
    title: "Build Multiplayer Game Lobby",
    description:
      "Example of how to build a multiplayer game lobby with chat and presence - long version",
  },
  handler: generateHandler(
    "As a game developer, use PubNub MCP server to build a multiplayer game lobby that supports real-time chat using Pub/Sub, Presence for tracking when players come online or leave, and App Context for managing team assignments (e.g., red vs. blue team)."
  ),
};

const oemClientManagement = {
  name: "oem-client-management",
  definition: {
    title: "OEM Client Management",
    description: "Example of how to create apps and configure keysets for OEM clients",
  },
  handler: generateHandler(
    "[OEM (building resources used by someone else)] As a developer, use PubNub MCP to create a new app, configure and assign keysets to clients."
  ),
};

const multiTenantOnboardingShort = {
  name: "multi-tenant-onboarding-short",
  definition: {
    title: "Implement Multi-Tenant Onboarding",
    description:
      "Example of how to implement automated tenant onboarding for multi-tenant applications - short version",
  },
  handler: generateHandler(
    "[OEM] Act as a senior developer and use PubNub MCP server to implement automated tenant onboarding for a multi-tenant chat application in SaaS or healthcare industries."
  ),
};

const multiTenantOnboardingLong = {
  name: "multi-tenant-onboarding-long",
  definition: {
    title: "Implement Multi-Tenant Onboarding",
    description:
      "Example of how to implement automated tenant onboarding for multi-tenant applications - long version",
  },
  handler: generateHandler(
    "Act as a senior developer and use PubNub MCP (which leverages Admin API for Keysets and Usage & Monitoring) to implement a multi-tenant chat application with automated tenant onboarding. The tenant Application will use: pubsub, History, App-Context, Presence For every new tenant or end-customer the application should: Create a new App (if required by your OEM model). Create and configure a new Keyset to ensure data isolation Make sure publish and subscribe keys are properly retrieved and propagated to the tenant's application as configuration variables The implementation should be fully automated, idempotent, and include error handling, and retries."
  ),
};

// ─── Illuminate prompts ───────────────────────────────────────────────────────

const illuminateSpamDetection = {
  name: "illuminate-spam-detection",
  definition: {
    title: "Set Up Illuminate Spam Detection",
    description:
      "Guided setup of a complete Illuminate spam detection pipeline (message flooding and cross-posting)",
  },
  handler: generateHandler(
    "Act as a community moderator and use PubNub MCP to set up Illuminate spam detection. Start by asking: Is the concern chat flooding (one user sending too many messages in one channel), cross-posting (the same message sent to many channels), or both? For each pattern, use the predefined Illuminate Query Builder template — do NOT recreate the query logic manually. For chat spam use cases, the Business Object fields User, Channel, Message, and Message Type are automatically created by Illuminate — do not ask the user to define them. Before creating anything, describe the detection approach in 1–2 sentences in plain English. Then show an escalating decision table with three severity rows: Low → notify moderator (quiet alert); Medium → notify + mute user in channel; High → notify + mute + ban user from channel. Ask the user to confirm: (a) the time window (default: 60 seconds), (b) the message count or channel count thresholds for each severity level, and (c) which actions to enable per row. After confirmation: create the Business Object if not already active, use the Query Builder template for the selected spam pattern(s), create the Decision with the confirmed escalating rules, and activate. Publish fake test data to verify the Decision fires correctly. Show the action log to confirm."
  ),
};

const illuminateUseCase = {
  name: "illuminate-use-case",
  definition: {
    title: "Set Up an Illuminate Use Case",
    description:
      "Guided setup of a new Illuminate analytics and automation use case",
  },
  handler: generateHandler(
    "Act as a product manager and use PubNub MCP to set up a complete Illuminate use case. Follow this guided flow: Step 0 — Identify the goal. Ask: (1) What outcome do you want? Choose from: reward and incentivize desired behavior (e.g. most engaged users, high spenders, poll participants); prevent spam or abuse; alert when operational metrics like wait time or failure rates exceed normal; or automate live event or auction actions. (2) What should Illuminate do when the condition is met? Options: notify via webhook or channel message, reward or badge a user, mute or moderate a user, or trigger an external workflow. (3) How quickly should it react? Immediately on each event, near real-time every 1–5 minutes, or trend-based every 10–60 minutes. Step 1 — Choose the simplest implementation path: if the goal is spam (flooding or cross-posting) or ranking (Top N / Bottom N), use the Query Builder predefined templates. Otherwise use Metrics + Dashboard + Decision. Step 2 — Confirm data. Ask for one of: a sample event (JSON), a list of fields already in the payload, or where the data currently lives. Step 3 — Preview before building. Describe the automation in 1–2 sentences in plain English. Present the decision logic as a conditions → actions table with one rule per row. Ask for confirmation and threshold adjustments before creating any Illuminate resources. Step 4 — Build: create the Business Object (or confirm the existing one is active), create 1–3 Metrics for KPI visibility and tuning, create a Dashboard chart, then create and activate the Decision using the confirmed thresholds. Step 5 — Validate: publish fake test data, check the dashboard and action log, and suggest threshold or rate-limit adjustments based on results."
  ),
};

const illuminateRewardEngagement = {
  name: "illuminate-reward-engagement",
  definition: {
    title: "Reward Engagement in Live Events",
    description:
      "Guided setup of an Illuminate engagement reward pipeline for live events and gaming",
  },
  handler: generateHandler(
    "Act as a live events manager and use PubNub MCP to set up Illuminate engagement rewards. Start by asking which participation behaviors to reward: poll answers, chat messages, reactions, or re-engaging low-engagement users (or a combination). For ranking rewards (Top N most chatty, Top N by reactions, Bottom N by engagement), use the predefined Illuminate Query Builder templates — do NOT recreate the ranking logic manually. Before creating anything, describe the reward approach in 1–2 sentences in plain English. Then show a decision table: Poll answered → reward points or badge; Top N most chatty → Incentive A; Top N by reactions → Incentive B; Bottom N by engagement → Incentive C (re-engagement nudge). Ask the user to confirm: (a) which rows to enable, (b) the reward or incentive for each, (c) the evaluation window, and (d) a per-rule rate limit (default: once per day per user) to prevent duplicate rewards. After confirmation: create the Business Object capturing poll, chat, and reaction events (fields: user, channel, event type). Create COUNT metrics — one per behavior being measured. Create a Dashboard with an engagement trend chart and active vs inactive user breakdown. Create the Decision(s) with the confirmed rules and rate limits, and activate. Optionally: if the user wants an engagement drop alert, add a rule that fires when overall channel activity drops below a threshold and notifies moderators. Publish fake test data to verify rewards fire correctly. Show the action log to confirm."
  ),
};

const illuminateTestVerify = {
  name: "illuminate-test-verify",
  definition: {
    title: "Test and Verify Illuminate Setup",
    description:
      "Step-by-step test and verification workflow for an existing Illuminate configuration",
  },
  handler: generateHandler(
    "Act as a developer and use PubNub MCP to test and verify my existing Illuminate setup. 1. List all Business Objects and confirm the relevant one is active. 2. Check which fields are populated using a field-health query — flag any fields returning empty strings as potential JSONPath mismatches. 3. Publish a small set of fake test messages (generic scenario) to the subscribe key. Wait 30 seconds for Illuminate ingestion. 4. Run a raw-snapshot query to confirm messages are being captured. 5. Check the action log for any active Decisions to confirm they are evaluating data. Report any issues found and suggest fixes. If Decisions are firing too frequently or not at all, suggest adjustments to time window, thresholds, filters, and execution rate limits."
  ),
};

// ─── Insights prompts ────────────────────────────────────────────────────────

const insightsSnapshot = {
  name: "insights-snapshot",
  definition: {
    title: "Insights Account Snapshot",
    description:
      "Quick high-level analytics snapshot for a date range — unique channels, unique users, message volume, and top channels",
  },
  handler: generateHandler(
    "Act as an analytics engineer and use PubNub MCP to produce an Insights snapshot for my account. Step 0 — Confirm inputs: (1) the subscribe key to query, (2) the date range (default: last 7 days, ISO 8601 in UTC), and (3) the time grain (default: daily). If the user does not have an Insights API key, point them to the how-to guide for getting Insights API access. Step 1 — Use the `insights` tool to query four metrics in parallel for the confirmed date range and grain: `unique_channels`, `unique_users`, `messages`, and `top_20_channels` with `category=by_messages`. Note that `top_20_channels` requires `period=hourly` or `period=daily` only — never `weekly` or `monthly`. Step 2 — Present the results in this order: (a) a one-line headline with the date range and the trend in unique users (e.g. \"+12% week-over-week\"), (b) a table of daily unique users / unique channels / messages, (c) the top 20 channels by message volume with their counts. Step 3 — Call out anomalies: any day with more than ±30% deviation from the period average, any channel that appears in the top 20 with more than 50% of total volume, or any drop in unique users greater than 20% day-over-day. Step 4 — Suggest 2–3 follow-up queries the user might want to run (e.g. \"Want to see new vs recurring user breakdown?\" or \"Want to see the top message types?\"). Always include the date range and timezone (UTC) in the response so the user has unambiguous framing."
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
    "Act as a product analyst and use PubNub MCP to analyze top channels in detail. Step 0 — Confirm inputs: (1) subscribe key, (2) date range (default: last 7 days, UTC), (3) time grain (`hourly` or `daily` only — top metrics do not support weekly or monthly), and (4) which ranking categories to include (default: `by_messages`, `by_subscribers`, and `by_users_with_messages`). Step 1 — Use the `insights` tool to query `top_20_channels` for each requested category. Step 2 — Cross-reference the rankings: list channels that appear in all three categories (high engagement and high reach), channels that have many messages but few subscribers (chatty but small), and channels that have many subscribers but few messages (broadcast-style). Step 3 — If the user asks about a channel naming pattern (e.g. \"channels starting with team.\" or \"all room.* channels\"), use the `channel_patterns` metric with a `filter=startsWith:` expression instead of post-filtering top-N results. Step 4 — Optionally query `unique_channels_combination` to show overlap between message-publishing channels and chat-publishing channels, and `percent_unique_channels_with_messages` to show how many of the keyset's channels actually had messages in the period. Step 5 — Present results as: (a) a unified ranking table with all categories side-by-side, (b) the cross-category insights from step 2, (c) any pattern-based subtotals from step 3, and (d) 2–3 follow-up actions (e.g. \"Want to look at user duration on these channels?\"). Important: top-N counts cannot be summed across periods — when showing daily rankings, present one ranking per day rather than aggregating."
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
    "Act as a growth analyst and use PubNub MCP to track user growth on my PubNub account. Step 0 — Confirm inputs: (1) subscribe key, (2) date range (default: last 30 days, UTC), and (3) trend grain (`daily`, `weekly`, or `monthly` — note that `new_vs_recurring_users` does NOT support `hourly`). Step 1 — Use the `insights` tool to query in parallel: `unique_users` for the chosen grain, `new_vs_recurring_users` for the chosen grain, and `unique_users_by_country` (which only supports `hourly` or `daily`). Step 2 — Compute and present: (a) the headline week-over-week or month-over-month change in unique users, (b) the new-user count and the recurring-user count per period with a small chart-style table, (c) the new-to-recurring ratio (a healthy product typically has 20–40% new users in any given period), and (d) the top 10 countries by unique user count from `unique_users_by_country`. Step 3 — Call out: any period where new users dropped more than 30% from the prior period (acquisition issue), any period where recurring users dropped more than 20% (retention issue), and any geography that suddenly appears or disappears in the top 10 (potential market change or fraud). Step 4 — Optionally query `top_20_users` with `category=by_messages` to identify your most active users (whales), and `percent_unique_users_with_messages` to show the publish-vs-subscribe-only user split. Step 5 — Suggest 2–3 follow-up queries (e.g. \"Want to see what channels new users are joining?\"). Always frame results with the date range and UTC timezone."
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
    "Act as a product analyst and use PubNub MCP to do an engagement and device deep dive. Step 0 — Confirm inputs: (1) subscribe key, (2) date range (default: last 24 hours for duration metrics, last 7 days for device metrics, all UTC), (3) for duration metrics, use `period=hourly` (the ONLY supported period for duration). For device metrics, use `period=daily` by default. Step 1 — Use the `insights` tool to query duration metrics: `avg_user_duration` (hourly), `unique_users_by_duration_timeframe` (hourly — bucketizes users by session length), and `top_20_channels_with_user_duration` (hourly, top channels ranked by total user time spent). Step 2 — Use the `insights` tool to query device metrics: `publishes_by_device_type`, `subscribers_by_device_type`, and `unique_users_by_device_type`. Step 3 — Present results in this order: (a) average user duration trend across the chosen window, (b) duration bucket histogram (e.g. < 1 min, 1–5 min, 5–30 min, 30+ min), (c) top 20 channels ranked by total user-minutes, (d) device-type table with publishes / subscribers / unique users side-by-side and percent share for each device type. Step 4 — Insight callouts: channels with high user-duration but low message volume (lurker / read-only channels), unusual device-mix shifts (e.g. mobile share dropping or web share spiking week-over-week), and the channel with the highest engagement-per-user ratio (total duration / unique users). Step 5 — Suggest 2–3 follow-up queries (e.g. \"Want to see device split for top channels only?\"). Always frame results with the time window and UTC timezone, and remind the user that duration metrics are only available at hourly grain."
  ),
};

export const prompts = [
  hipaaChatShort,
  hipaaChatLong,
  reactAppShort,
  reactAppLong,
  gamelobbyShort,
  gamelobbyLong,
  oemClientManagement,
  multiTenantOnboardingShort,
  multiTenantOnboardingLong,
  illuminateSpamDetection,
  illuminateRewardEngagement,
  illuminateUseCase,
  illuminateTestVerify,
  insightsSnapshot,
  insightsChannelAnalysis,
  insightsUserGrowth,
  insightsEngagementDeepDive,
];

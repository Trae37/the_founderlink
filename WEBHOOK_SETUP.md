# Beehiiv/Zapier Webhook Integration

This document explains how to set up the webhook integration for sending assessment data to Beehiiv for email automation.

## Overview

The system sends webhooks to Beehiiv/Zapier in three scenarios:
1. **Free Snapshot** - User completes assessment and chooses free option
2. **Paid Blueprint ($49)** - User purchases PRD/SOW Blueprint
3. **Waitlist** - User joins Full-Stack or Mobile Dev waitlist

## Webhook Payload Structure

All webhooks send the following JSON payload:

```json
{
  "email": "founder@company.com",
  "name": "Sarah Johnson",
  "dev_role": "no-code-builder",
  "project_type": "landing-page",
  "timeline": "4-6-weeks",
  "budget_range": "under-3000",
  "top_features": ["contact-form", "animations"],
  "route": "no-code",
  "complexity": "low",
  "event_type": "paid",
  "stripe_session_id": "cs_test_...",
  "product_type": "prd-sow-tripwire",
  "timestamp": "2025-12-07T02:45:00.000Z"
}
```

### Field Descriptions

| Field | Type | Description | Example Values |
|-------|------|-------------|----------------|
| `email` | string | User's email address | `"founder@company.com"` |
| `name` | string | User's full name | `"Sarah Johnson"` |
| `dev_role` | string | Recommended developer role | `"no-code-builder"`, `"hybrid-developer"`, `"fullstack-developer"` |
| `project_type` | string | Type of project | `"landing-page"`, `"web-app"`, `"dashboard"` |
| `timeline` | string | Project timeline | `"4-6-weeks"`, `"6-8-weeks"`, `"8-12-weeks"` |
| `budget_range` | string | Budget range | `"under-3000"`, `"3000-7000"`, `"7000-15000"`, `"over-15000"` |
| `top_features` | array | Key features needed | `["auth", "payments", "dashboard"]` |
| `route` | string | Assessment route | `"no-code"`, `"hybrid"`, `"custom"` |
| `complexity` | string | Project complexity | `"low"`, `"medium"`, `"high"` |
| `event_type` | string | Type of event | `"free"`, `"paid"`, `"waitlist"` |
| `stripe_session_id` | string | Stripe session ID (paid only) | `"cs_test_abc123"` |
| `product_type` | string | Product purchased (paid only) | `"prd-sow-tripwire"`, `"nocode-matches"` |
| `timestamp` | string | ISO 8601 timestamp | `"2025-12-07T02:45:00.000Z"` |

## Setup Instructions

### 1. Get Webhook URL from Zapier

1. Go to [Zapier](https://zapier.com) and create a new Zap
2. Choose "Webhooks by Zapier" as the trigger
3. Select "Catch Hook" as the event
4. Copy the webhook URL (looks like `https://hooks.zapier.com/hooks/catch/...`)

### 2. Add Webhook URL to Environment Variables

In the Manus Management UI:
1. Go to **Settings** → **Secrets**
2. Add a new secret:
   - Key: `BEEHIIV_WEBHOOK_URL`
   - Value: Your Zapier webhook URL

### 3. Configure Beehiiv Automation

In your Beehiiv account:

#### For Paid Customers ($49 Blueprint)
1. Create a new automation triggered by Zapier webhook
2. Filter by `event_type == "paid"`
3. Add subscriber to "7-Day Smart Sprint" email sequence
4. Use these merge tags in your emails:
   - `{{name}}` - Customer name
   - `{{dev_role}}` - Recommended developer role
   - `{{project_type}}` - Project type
   - `{{timeline}}` - Timeline
   - `{{budget_range}}` - Budget range
   - `{{top_features}}` - Top features (array)

#### For Free Customers
1. Create a new automation triggered by Zapier webhook
2. Filter by `event_type == "free"`
3. Send single guidance email
4. Add to main newsletter list

#### For Waitlist Signups
1. Create a new automation triggered by Zapier webhook
2. Filter by `event_type == "waitlist"`
3. Send waitlist confirmation email
4. Tag subscriber based on `route` field

## Testing

### Test Webhook Locally

1. Use a tool like [webhook.site](https://webhook.site) to get a test URL
2. Add the test URL as `BEEHIIV_WEBHOOK_URL` in your local `.env`
3. Complete the assessment flow
4. Check webhook.site to see the payload

### Test in Production

1. Complete a test assessment with a real email
2. Choose "Free Snapshot" or purchase the $49 Blueprint
3. Check Zapier dashboard for webhook delivery
4. Verify email was sent from Beehiiv

## Troubleshooting

### Webhook Not Firing

1. Check that `BEEHIIV_WEBHOOK_URL` is set in environment variables
2. Check server logs for webhook errors: `[Stripe] Webhook delivery error`
3. Verify the webhook URL is accessible (test with curl)

### Missing Data in Emails

1. Verify all fields are present in webhook payload (check Zapier history)
2. Ensure Beehiiv merge tags match the field names exactly
3. Check that assessment data is being stored in database

### Duplicate Webhooks

1. Webhooks are sent once per assessment completion
2. If user completes assessment multiple times, multiple webhooks will fire
3. Use `email` + `timestamp` as unique identifier in Beehiiv

## Database Schema

Assessment responses are stored in the `assessmentResponses` table:

```sql
CREATE TABLE assessmentResponses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  name VARCHAR(255),
  route ENUM('no-code', 'hybrid', 'custom') NOT NULL,
  complexity ENUM('low', 'medium', 'high') NOT NULL,
  devRole VARCHAR(255),
  projectType VARCHAR(255),
  timeline VARCHAR(100),
  budgetRange VARCHAR(100),
  topFeatures TEXT,
  responses TEXT NOT NULL,
  completedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  webhookSent TINYINT DEFAULT 0,
  eventType ENUM('paid', 'free', 'waitlist'),
  stripeSessionId VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Support

For questions or issues with webhook integration:
1. Check server logs for error messages
2. Test webhook URL manually with curl
3. Verify Beehiiv automation is active
4. Contact support at help.manus.im

# Stripe Webhook Setup Guide

This guide walks you through setting up Stripe webhooks to confirm payments server-side.

## What Webhooks Do

When a customer completes payment via Stripe Checkout, Stripe sends a webhook event to your server. Your server then:
1. Verifies the webhook signature (security)
2. Updates the intake submission's payment status from "pending" to "completed"
3. Sends a confirmation email to the customer

## Webhook Endpoint

Your webhook endpoint is:
```
POST https://your-domain.com/api/webhooks/stripe
```

For local testing, you can use:
```
http://localhost:3000/api/webhooks/stripe
```

## Setup Steps

### 1. Go to Stripe Dashboard

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Developers** in the left sidebar
3. Click **Webhooks**

### 2. Add Endpoint

1. Click **Add endpoint**
2. In the URL field, enter your webhook endpoint:
   - **Production:** `https://your-domain.com/api/webhooks/stripe`
   - **Testing:** Use [Stripe CLI](#using-stripe-cli-for-local-testing) for local development

### 3. Select Events

Click **Select events** and enable:
- ✅ `checkout.session.completed` — Fires when payment succeeds
- ✅ `charge.refunded` — Fires when payment is refunded

### 4. Copy Signing Secret

After creating the endpoint:
1. Click on the endpoint to view details
2. Copy the **Signing secret** (starts with `whsec_`)
3. Add it to your environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

### 5. Test the Webhook

Click **Send test event** to verify everything works.

## Using Stripe CLI for Local Testing

For development, use the Stripe CLI to forward webhook events to your local machine.

### Install Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux
curl https://files.stripe.com/stripe-cli/install.sh -o install.sh && sudo bash install.sh

# Windows
choco install stripe
```

### Login to Stripe

```bash
stripe login
```

### Forward Webhooks

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will output:
```
> Ready! Your webhook signing secret is: whsec_test_abc123...
```

Copy this secret to your `.env` file:
```
STRIPE_WEBHOOK_SECRET=whsec_test_abc123...
```

### Trigger Test Events

In another terminal:
```bash
stripe trigger checkout.session.completed
```

## How It Works

1. **Customer completes payment** → Stripe Checkout redirects to `/payment-success`
2. **Stripe sends webhook** → POST to `/api/webhooks/stripe`
3. **Server verifies signature** → Ensures it's really from Stripe
4. **Server updates database** → Sets `paymentStatus = "completed"`
5. **Server sends email** → Confirmation email to customer

## Webhook Event Flow

```
Stripe Checkout
    ↓
Payment Complete
    ↓
Stripe sends webhook event
    ↓
Your server receives POST /api/webhooks/stripe
    ↓
Verify signature with STRIPE_WEBHOOK_SECRET
    ↓
Find intake submission by session ID
    ↓
Update paymentStatus to "completed"
    ↓
Send confirmation email
    ↓
Return success response
```

## Troubleshooting

### Webhook Not Firing

1. Check that endpoint URL is correct and publicly accessible
2. Verify `STRIPE_WEBHOOK_SECRET` is set in environment
3. Check server logs for errors
4. In Stripe Dashboard, click endpoint → **Logs** to see delivery attempts

### Signature Verification Failed

1. Ensure `STRIPE_WEBHOOK_SECRET` matches the signing secret in Stripe Dashboard
2. Check that the webhook is using the correct signing secret (test vs. live)

### Payment Status Not Updating

1. Check database logs to see if update query ran
2. Verify intake submission exists with matching `stripeSessionId`
3. Check server logs for database errors

## Testing Checklist

- [ ] Webhook endpoint is publicly accessible
- [ ] `STRIPE_WEBHOOK_SECRET` is set in environment
- [ ] Stripe CLI is forwarding events (for local testing)
- [ ] Test event triggers payment status update
- [ ] Confirmation email is sent
- [ ] Admin dashboard shows updated payment status

## Security Notes

- ✅ Webhook signature is verified using `STRIPE_WEBHOOK_SECRET`
- ✅ Only Stripe can send valid webhooks
- ✅ Webhook endpoint is public (no authentication required)
- ✅ Never log the signing secret
- ✅ Always verify signature before processing

## Next Steps

1. Set up the webhook endpoint in Stripe Dashboard
2. Copy the signing secret to your environment
3. Test with Stripe CLI locally
4. Deploy to production
5. Update production webhook endpoint in Stripe Dashboard

# Ship Tonight: The Founder Link Launch Guide

**Goal:** Get thefounderlink.com live with the $149 Blueprint offer by tomorrow.

**What's Working:**
- Landing page
- Assessment (32 questions)
- Results page with route/complexity determination
- Stripe checkout integration
- DOCX document generation
- Email templates

**What's Blocking:**
- No database connected
- Missing API keys (Resend, Stripe webhook secret)
- No deployment configuration

---

## PHASE 1: Database Setup (30 minutes)

### Option A: PlanetScale (Recommended - Free Tier)
1. Go to https://planetscale.com and create account
2. Create new database: `founder-link`
3. Get connection string from "Connect" button
4. Choose "Node.js" driver

```bash
# Your DATABASE_URL will look like:
DATABASE_URL=mysql://xxxxxx:pscale_pw_xxxxx@aws.connect.psdb.cloud/founder-link?ssl={"rejectUnauthorized":true}
```

### Option B: Railway MySQL (Simple, $5/mo)
1. Go to https://railway.app
2. New Project → Add MySQL
3. Copy `DATABASE_URL` from Variables tab

### After Database Setup:
```bash
# Run from project root:
npm run db:push
```

This creates all 9 tables from the schema.

---

## PHASE 2: Environment Variables (15 minutes)

### Update `.env` file:

```bash
# 1. DATABASE_URL (from Phase 1)
DATABASE_URL=<your-connection-string>

# 2. STRIPE_WEBHOOK_SECRET
# Go to: https://dashboard.stripe.com/webhooks
# Click "Add endpoint" if needed, or use existing
# Endpoint URL: https://thefounderlink.com/api/webhooks/stripe
# Events to listen: checkout.session.completed, charge.refunded
# Copy the "Signing secret" (starts with whsec_)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# 3. RESEND_API_KEY
# Go to: https://resend.com/api-keys
# Create new key, copy it
RESEND_API_KEY=re_xxxxxxxxxxxxx

# 4. JWT_SECRET (generate a random string)
JWT_SECRET=<run: openssl rand -hex 32>

# 5. Keep existing STRIPE_SECRET_KEY (already has test key)
# For production, get live key from Stripe Dashboard → API Keys
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
```

### Verify Resend Domain
1. Go to https://resend.com/domains
2. Add `thefounderlink.com`
3. Add DNS records (MX, TXT) to your domain registrar
4. Wait for verification (usually 5-15 minutes)

---

## PHASE 3: Test Core Flow Locally (30 minutes)

### Start the app:
```bash
npm run dev
```

### Test checklist:
- [ ] Landing page loads at http://localhost:5000
- [ ] Click "Start Assessment" → goes to /assessment
- [ ] Complete all 32 questions
- [ ] Results page shows route + complexity
- [ ] Click "$149 Blueprint" → Stripe checkout opens
- [ ] Use test card: 4242 4242 4242 4242, any future date, any CVC
- [ ] Payment succeeds → redirects to success page
- [ ] Check database for `assessmentResponses` entry
- [ ] Check email (if Resend configured)

### If Stripe webhook doesn't fire locally:
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

---

## PHASE 4: Deployment (45 minutes)

### Option A: Railway (Recommended - Simple)

1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Select your repo
4. Railway auto-detects Node.js

**Add environment variables in Railway dashboard:**
- `DATABASE_URL` (use Railway's MySQL or external)
- `STRIPE_SECRET_KEY` (live key for production)
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `JWT_SECRET`
- `NODE_ENV=production`

**Add custom domain:**
1. Settings → Domains → Add `thefounderlink.com`
2. Add CNAME record in your DNS:
   - Name: `@` or empty
   - Value: `<your-railway-app>.up.railway.app`

### Option B: Vercel + Railway (Split Deploy)

**Frontend (Vercel):**
```bash
npm install -g vercel
vercel
```
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist/public`

**Backend (Railway):**
- Deploy server only to Railway
- Update frontend API calls to point to Railway URL

---

## PHASE 5: Production Checklist (20 minutes)

### Stripe Configuration:
- [ ] Switch from test keys to live keys in production env
- [ ] Create production webhook endpoint at `https://thefounderlink.com/api/webhooks/stripe`
- [ ] Add webhook events: `checkout.session.completed`, `charge.refunded`
- [ ] Test with real $1 charge (refund immediately)

### Domain/SSL:
- [ ] thefounderlink.com points to deployment
- [ ] HTTPS working (Railway/Vercel auto-provision SSL)
- [ ] www redirect to non-www (or vice versa)

### Email:
- [ ] Resend domain verified
- [ ] Test email sends from production
- [ ] Check spam folder on first send

### Database:
- [ ] All tables created (`npm run db:push` ran on production)
- [ ] Test assessment saves to production DB

---

## PHASE 6: Smoke Test Production (15 minutes)

Run through complete flow on production:

1. [ ] Visit https://thefounderlink.com
2. [ ] Complete assessment
3. [ ] View results
4. [ ] Click download free Clarity Brief (if implemented)
5. [ ] Click $149 upgrade
6. [ ] Complete Stripe checkout (use real card, refund after)
7. [ ] Verify success page shows
8. [ ] Verify email received with documents
9. [ ] Download documents from email link

---

## Known Issues That WON'T Block Launch

| Issue | Impact | Workaround |
|-------|--------|------------|
| PDF generation not implemented | Low | DOCX works fine |
| Some tests failing | Low | Production flow works |
| $497 matching product | None | Not launching yet |
| Admin dashboard incomplete | Low | Check DB directly |
| Vertical templates not connected | Low | Generic templates work |

---

## Quick Reference: File Locations

| What | Where |
|------|-------|
| Environment vars | `.env` |
| Database schema | `drizzle/schema.ts` |
| Route logic | `client/src/lib/assessmentData.ts` |
| Stripe checkout | `server/routers/payment.ts` |
| Webhook handler | `server/webhooks/stripe.ts` |
| Document generation | `server/services/prd-generator.ts` |
| Email templates | `server/services/blueprint-delivery.ts` |

---

## Commands Cheat Sheet

```bash
# Development
npm run dev                    # Start dev server
npm run test                   # Run all tests
npm run check                  # TypeScript type check

# Database
npm run db:push               # Push schema to database

# Build
npm run build                 # Build for production
npm run start                 # Start production server

# Stripe CLI (local webhook testing)
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

---

## If Something Breaks

### "Database not available"
- Check `DATABASE_URL` is set correctly
- Run `npm run db:push`
- Check database is accessible (not behind firewall)

### "Stripe webhook signature verification failed"
- Verify `STRIPE_WEBHOOK_SECRET` matches dashboard
- Make sure you're using the secret from the correct webhook endpoint

### "Email not sending"
- Check `RESEND_API_KEY` is set
- Verify domain in Resend dashboard
- Check Resend logs for errors

### "Assessment not saving"
- Check database connection
- Look at server console for errors
- Verify `assessmentResponses` table exists

---

## Tonight's Priority Order

1. **Database** - Nothing works without it
2. **Stripe webhook secret** - Payments won't confirm without it
3. **Test local flow** - Make sure it works before deploying
4. **Deploy** - Get it on thefounderlink.com
5. **Production Stripe** - Switch to live keys
6. **Smoke test** - Run through complete flow

Good luck! You've got this.

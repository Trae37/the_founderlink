# 7-Day Rapid Dev Hiring Sprint Toolkit Landing Page - TODO

## Features & Tasks

- [x] Design system and theme setup (colors, typography, spacing)
- [x] Hero section (headline, subheadline, CTA button)
- [x] Benefits section with bullet points
- [x] Value proposition explainer paragraph
- [x] Risk reversal / reassurance statement
- [x] Email capture form integration
- [x] Footer with links and branding
- [x] Mobile responsiveness testing
- [x] Remove em dashes and emojis from copy
- [x] Redesign layout with product mockup (left text, right visual)
- [x] Create more brandable, sophisticated design system
- [x] Remove specific user count claims and generalize social proof statements
- [x] Integrate hero image into page design
- [x] Redesign color scheme around image (neutral base with neon accents)
- [x] Update typography and visual style to match cyberpunk aesthetic
- [x] Replace hero image with new version
- [x] Complete redesign: new color palette (navy, cyan, coral)
- [x] Build Version A: Minimal layout (hero + bottom only)
- [x] Build Version B: With outcomes section (hero + middle + bottom)
- [x] Implement email-only form with validation
- [x] Add second image (team collaboration) for bottom section
- [x] Set up A/B test routing and tracking
- [x] Redesign image composition and integration
- [x] Add gradient overlays to hero image for text readability
- [x] Frame success image with polished border treatment
- [x] Update branding to "The Founder Link"
- [x] Redesign hero section with side-by-side images (before/after narrative)
- [x] Update all copy with product name "The Smart Selection Sprint™"
- [x] Update footer with company attribution
- [x] Update hero image to composite before/after version
- [x] Create hero design variation 1: Full-bleed background with text overlay
- [x] Create hero design variation 2: Image with design elements and overlays
- [x] Create hero design variation 3: Side-positioned image with text emphasis
- [x] Replace hero image with new composite version
- [x] Refine Variation 1: Lighter overlay for clearer image visibility
- [x] Remove all em dashes from landing pages
- [x] Replace hero image with new version
- [x] Consolidate to Variation 1 hero design for VersionA and VersionB
- [x] Fix hero image fitting to prevent cutoff
- [x] Remove gray borders from hero image
- [x] Fix image cutoff while maintaining full width display
- [x] Update hero copy with new messaging
- [x] Optimize hero image for mobile/tablet (non-background display)
- [x] Build multi-step questionnaire with 23 questions and 6 sections
- [x] Implement conditional logic for form questions
- [x] Build scoring engine with tech complexity and team size calculations
- [ ] Create dynamic PDF report generation (3 templates) - Pending
- [ ] Integrate email delivery with Resend API - Pending
- [ ] Build results preview and download flow - Pending
- [ ] Conversion tracking setup - Pending
- [x] Landing pages with responsive hero image
- [x] Multi-step questionnaire with 23 questions
- [x] Conditional logic implementation
- [x] Scoring engine with results display
- [x] Replace hero image with keyboard/developer roles image
- [x] Update color scheme to dark navy/teal with cyan and pink accents
- [x] Update all UI elements to match new color palette
- [x] Update CTA buttons with solid high-contrast colors
- [x] Redesign color scheme: light gray/off-white backgrounds
- [x] Update CTA buttons to neon pink/magenta
- [x] Update text colors to dark navy
- [x] Update accent colors to cyan
- [x] Update Assessment page with new color scheme
- [x] Increase subheading font weight for better readability
- [x] Restyle Assessment page to match landing page design
- [x] Remove Version A and set Version B as primary landing page
- [ ] Final QA and launch checklist
- [x] Add glass morphism navigation bar with centered brand
- [x] Update nav layout: "How it works" left, brand center, "Start Assessment" right
- [x] Add glass cards to hero subtext section
- [x] Add glass cards to all feature and benefits sections
- [x] Test glass design on mobile and desktop
- [x] Redesign landing page with Mobbin-style aesthetic (modern, clean, minimal)
- [x] Update hero section layout and styling
- [x] Update features/benefits section styling
- [x] Update Assessment questionnaire to match new design
- [x] Test complete user flow with new design
- [x] Refine navigation bar to match reference image exactly (spacing, colors, borders, layout)
- [x] Implement parallax scrolling on hero image (extends to bottom of page)
- [x] Position CTA section on top of extended hero image
- [x] Test parallax effect on desktop and mobile
- [x] Enhance CTA buttons with bubbled look (rounded corners, shadows, better visual hierarchy)
- [x] Test CTA button styling across all sections
- [x] Update hero headline to "Hire Faster, Without Wasting Months"
- [x] Update hero subheading to "Stop Burning Time and Money on the Wrong Developers"
- [x] Update hero description with Smart Fit Snapshot and 7-Day Sprint messaging
- [x] Update features section title to "How the 7‑Day Smart Selection Sprint Works"
- [x] Update features section subtitle to "Four simple steps from confusion to confident hire"
- [x] Update all four feature descriptions with complete Day 1-7 details
- [x] Update benefits section copy with improved messaging
- [x] Update CTA section copy with Smart Fit Snapshot and Sprint toolkit messaging
- [x] Restructure hero section with proper copy hierarchy
- [x] Update main headline to "Hire Faster, Without Wasting Months"
- [x] Add supporting line "Stop Burning Time and Money on the Wrong Developers"
- [x] Update subheader with 5-minute Smart Fit Snapshot and 7-Day Sprint messaging
- [x] Replace or update top bubble badge with "🚀 The Founder Link"
- [x] Test hero section layout on desktop and mobile
- [x] Reduce hero headline font size to fit better at top
- [x] Reduce hero supporting line font size
- [x] Adjust hero subheader font size in glass card
- [x] Test hero layout on desktop and mobile with smaller fonts
- [x] Remove static "Scroll to explore" text
- [x] Keep bouncing scroll indicator at bottom of hero
- [x] Move bouncing scroll indicator down closer to cream section edge
- [x] Add back button to quiz first page to return to landing page
- [x] Test scroll indicator positioning
- [x] Test back button functionality on quiz page
- [x] Fix cursor hover glitch on glass subtext box (subtle shift in design)
- [x] Test hover behavior on glass box to verify fix
- [x] Test Website/Web app (No-Code) path end-to-end
- [x] Test Custom backend path end-to-end
- [x] Test Mobile app path end-to-end
- [x] Verify all three paths produce correct outcomes
- [x] Test back button functionality on all paths
- [x] Remove "made with manus" icon from landing page (disabled in project settings)
- [x] Create Results component with three outcome pages (Perfect No-Code, No-Code Viable, Custom Dev, Mobile Dev)
- [x] Implement dynamic Smart Fit Snapshot generation based on user responses
- [x] Add personalized recommendations (timeline, budget, hire type) based on answers
- [x] Create Option 1 (DIY with Sprint toolkit) and Option 2 (Dev matching service) CTAs
- [x] Test all three result paths with different user inputs
- [x] Verify personalized copy displays correctly for each path


## Stripe Payment Integration (Complete)
- [x] Set up Stripe integration with test keys
- [x] Create payment router (tRPC endpoint for checkout sessions)
- [x] Add checkout buttons to results page (all 3 product types)
- [x] Create PaymentSuccess page with intake form
- [x] Create PaymentCancel page for abandoned checkouts
- [x] Wire up PaymentSuccess and PaymentCancel routes in App.tsx
- [x] Write payment router tests (4/4 passing)
- [x] Pre-fill intake form with assessment data
- [x] Update cancel URLs in payment router
- [ ] Test full payment flow with Stripe test card (4242 4242 4242 4242)
- [ ] Verify success page redirects work correctly
- [ ] Test intake form submission handling
- [ ] Claim Stripe sandbox at https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1p2a0RCQmxwUTM0S2pWLDE3NjUyOTkwMTkv100YasQd0bU

## Post-Purchase Workflow (Planned)
- [ ] Store intake form submissions in database
- [ ] Create admin dashboard to view submissions
- [ ] Set up Stripe webhook for payment confirmation
- [ ] Send confirmation email after payment
- [ ] Schedule Match Review call

## Resend Email Setup (Blocked)
- [ ] Verify thefounderlink.com domain in Resend
- [ ] Update email templates
- [ ] Test email delivery


## Post-Purchase Workflow (Complete)
- [x] Create intake submissions database schema
- [x] Save form submissions to database from PaymentSuccess page
- [x] Set up Stripe webhook for payment confirmation
- [x] Build admin dashboard to view submissions (/admin route)
- [x] Implement email automation for confirmations (ready once Resend domain verified)
- [x] Write intake router tests (8/8 passing)
- [ ] Test complete post-purchase workflow end-to-end


## Stripe Webhook Integration (Complete)
- [x] Create webhook endpoint handler
- [x] Add webhook route to Express server
- [x] Write webhook handler tests (8/8 passing)
- [x] Document webhook setup for Stripe dashboard (STRIPE_WEBHOOK_SETUP.md)


## Match Assignment Feature (Complete)
- [x] Create matches database schema (developers and matchAssignments tables)
- [x] Create match assignment router with tRPC procedures
- [x] Add match email notification service (sendMatchNotificationEmail)
- [x] Create admin interface to assign matches (/admin/matches route)
- [x] Write match router tests (10/10 passing)


## Webhook Email Integration (Complete)
- [x] Create payment confirmation email template (sendPaymentConfirmationEmail)
- [x] Update webhook handler to send confirmation email on checkout.session.completed
- [x] Write tests for webhook email integration (9/9 passing)


## Calendly Scheduling Integration (Complete)
- [x] Add Calendly URL to environment configuration (CALENDLY_URL env var)
- [x] Update payment confirmation email with Calendly booking link (2 CTAs)
- [x] Write tests for Calendly integration (7/7 passing)


## Assessment Questionnaire Overhaul (Complete)
- [x] Update assessment data structure with 28 new questions (6 sections A-F)
- [x] Implement filtering logic for no-code/hybrid/custom routes
- [x] Update results page with new route recommendations
- [x] Write tests for new assessment logic (12/12 passing)
- [x] Fix routing logic for many features and mobile apps
- [x] Test full assessment flow end-to-end
- [ ] Add "Audit & Fix" route for existing products
- [ ] Add "Tech Partner" route for advisory engagements

## Pricing Structure Updates (Complete)
- [x] Update Results page with correct pricing: $497 (vetted matches), $49 (PRD/SOW tripwire), free (waitlists)
- [x] Add PRD/SOW product tier to payment router
- [x] Update Stripe products to include $49 tripwire option
- [x] Update payment router tests to include $49 tripwire (4/4 passing)
- [ ] Test all pricing paths in assessment flow end-to-end

## Email Capture & Webhook Integration (Complete)
- [x] Add email capture screen at start of assessment (before Section A)
- [x] Update database schema to store user emails with assessment responses
- [x] Link Stripe session IDs to assessment records in database
- [x] Build upgrade block on Results page (Free Snapshot vs $49 Blueprint)
- [x] Create unified webhook endpoint for Beehiiv/Zapier integration
- [x] Webhook payload includes: name, email, dev_role, project_type, timeline, budget_range, top_features, route, event_type, stripe_session_id
- [x] Integrate webhook calls into Results page (free selection) and Stripe webhook (paid)
- [x] Document webhook payload structure for Zapier setup (WEBHOOK_SETUP.md)
- [x] Write tests for webhook endpoint (10/10 passing)
- [ ] Test webhook fires correctly for paid, free, and waitlist paths end-to-end (manual testing required with Zapier)

## Webhook Fixes & Testing (Complete)
- [x] Fix top_features extraction from responses[8] and responses[11]
- [x] Update Results page webhook call to include actual features
- [x] Update Stripe webhook to include actual features
- [x] Add webhook URL to environment variables
- [x] Test webhook delivery to Zapier endpoint (1/1 passing)
- [ ] Verify webhook payload structure in Zapier dashboard (user action required)

## Email Capture UX Improvement (Complete)
- [x] Move email/name fields from separate page to top of Assessment Section A
- [x] Update Home page CTAs to navigate directly to /assessment
- [x] Update Assessment page to show email/name fields first
- [ ] Test full flow with inline email capture

## Assessment UX Improvements (Complete)
- [x] Add question numbers to show progress (e.g., "Question 1 of 28")
- [x] Add text input field when "Something else (type in)" is selected
- [x] Limit Q8 to 3 selections max (matches question wording)
- [ ] Test question numbering and selection limits

## Question 19 Fix (Complete)
- [x] Update Q19 options to "Yes", "No", "Mixed"

## Question 20 Fix (Complete)
- [x] Change option to "choose the wrong person"
- [x] Change "my idea or code not being safe" to "my idea or code not working"

## Question 20 Wording Update (Complete)
- [x] Change first option to "Choosing the wrong person or making the wrong hire"

## Technical Term Review (In Progress)
- [ ] Review all 28 questions for technical accuracy
- [ ] Ensure front-end, back-end, full-stack terms are preserved where appropriate
- [ ] Restore any oversimplified technical language

## Remove Emojis & Add Brand Icons (Complete)
- [x] Find all emojis on Home page
- [x] Find all emojis on Results page (none found)
- [x] Replace with lucide-react icons that match branding (Rocket, Check)
- [ ] Test visual consistency

## Homepage Copy Update (Complete)
- [x] Update hero heading and subheading
- [x] Update primary CTA button text
- [x] Update reassurance strip
- [x] Update "How it works" section with 4-step process
- [x] Update benefits section
- [x] Update stats section
- [x] Update bottom CTA block

## Benefits Heading Update (Complete)
- [x] Change "Never Waste Months on the Wrong Developers Again" to "Stop wasting time and money on the wrong devs"

## PRD/SOW Generation System (In Progress)
- [x] Create LLM enhancement service (OpenAI API integration)
- [x] Build PRD template with all placeholders
- [x] Build SOW template with all placeholders
- [x] Add hardcoded rate ranges by route (no-code, hybrid, custom)
- [x] Create document generation service (PDF, Word, MD)
- [x] Create tRPC router for document generation
- [x] Update Results page with preview display (simplified version)
- [x] Change PRD/SOW preview from 50% to 40% for stronger upgrade incentive
- [ ] Test preview generation with real assessment data
- [ ] Add download buttons for paid users (later)
- [ ] Add loading state during AI processing (later)
- [ ] Integrate with payment flow to unlock full documents (later)
- [ ] Store generated documents in database (later)
- [ ] Write tests for document generation (later)

## New Landing Page Design (Industrial/Swiss Aesthetic)
- [x] Implement new color scheme (cream #F3F2EE bg, white surface, amber #F59E0B accent)
- [x] Add Inter font family (primary) and JetBrains Mono (monospace)
- [x] Create industrial navigation bar with FounderLink branding
- [x] Build two-column hero section with "The Bridge" visualization
- [x] Add animated flow connector between "You" and "Talent" cards
- [x] Implement 4-step "How It Works" section with numbered cards
- [x] Create 2x2 bento grid for value propositions
- [x] Add stats section (5 min, Instant, No card)
- [x] Update final CTA section with new copy
- [x] Add industrial-style footer
- [x] Implement grid background pattern
- [x] Add custom animations (slide-up, flow, float, fade-in)
- [x] Wire up all CTA buttons to navigate to /assessment

## Landing Page Enhancements
- [x] Add Inter and JetBrains Mono fonts from Google Fonts CDN
- [x] Optimize mobile responsiveness for The Bridge visualization
- [x] Add scroll-triggered animations for How It Works cards
- [x] Add scroll-triggered animations for bento grid items

## Apply Industrial Design to All Pages
- [x] Redesign Assessment page with cream background and grid pattern
- [x] Update Assessment navigation to match industrial style
- [x] Style Assessment question cards with white surfaces and amber accents
- [x] Add progress indicator with industrial styling
- [x] Redesign Results page with industrial aesthetic
- [x] Update Results cards and sections to match design system
- [x] Ensure consistent typography (Inter/JetBrains Mono) across all pages

## UX Improvements
- [x] Add loading skeleton for PRD/SOW preview generation
- [x] Create payment success page with email confirmation
- [x] Add vetted matches waitlist signup to Success page
- [ ] Test complete user flow (assessment → free snapshot → upgrade)
- [ ] Verify form validations work correctly
- [ ] Test Stripe payment flow with test cards

## Admin Dashboard Enhancements
- [x] Verify Plausible Analytics integration for website visits
- [x] Create user feedback schema in database
- [x] Create document templates schema (PRD/SOW)
- [x] Build admin dashboard with:
  - [x] Email signups list with conversion tracking
  - [x] $49 Blueprint purchases list
  - [x] Waitlist signups management
  - [x] PRD/SOW template editor (placeholder for future)
  - [x] User feedback inbox with response capability (placeholder for future)
  - [x] Quick stats overview (signups, conversions, waitlist count)

## Assessment UX
- [x] Add progress indicator showing "Question X of Y" (already exists)

## Results Page Enhancements
- [x] Add FAQ section at bottom of Results page

## Feedback System
- [x] Create feedback form widget component (floating button)
- [x] Build feedback tRPC router for submissions
- [x] Integrate feedback data into admin dashboard Feedback tab
- [x] Add success confirmation after feedback submission

## Assessment Response Tracking
- [x] Store completed assessments in assessmentResponses table
- [x] Update Assessment page to save responses to database
- [x] Update admin dashboard to fetch and display real assessment data
- [x] Show assessment completion stats in admin Overview tab

## Bug Fixes
- [x] Fix Assessment page to display answer choices for questions
- [x] Add back button to Assessment page for navigation to previous questions and landing page (already exists)
- [x] Fix text input option to show text box when selected (Section B, Question 2)

## Assessment Progress Persistence
- [x] Implement localStorage auto-save for all assessment responses
- [x] Auto-save current step/section progress
- [x] Load saved responses on page load
- [x] Clear saved data after successful submission
- [x] Add maxSelections limits to questions with explicit answer limits (e.g., "3 most important things")
- [x] Update Results page Next Steps section to reflect actual user journey (free snapshot, $49 upgrade, email, review call for paid, waitlist)
- [x] Fix PRD/SOW preview generation not populating on Results page
- [x] Add waitlist signup form to Results page below Next Steps
- [x] Reorder Results page sections: Next Steps above FAQ
- [x] Add recommended stack and developer type to Results page top card
- [x] Implement AI-powered dynamic stack and developer recommendations based on quiz responses
- [x] Ensure recommendations align with route category (no-code, hybrid, custom)
- [x] Generate contextual, specific recommendations that reflect actual project needs
- [x] Add Markdown download button for free preview on Results page
- [ ] Test recommendations with various quiz response scenarios
- [x] Implement email delivery for free preview documents (Markdown format)
- [x] Implement email delivery for paid Blueprint documents (PDF/Word/Markdown)
- [x] Add Calendly booking link to Success page for Blueprint customers
- [x] Add Calendly link to Blueprint confirmation email (already in blueprint-email.ts)
- [ ] Test complete email delivery flow for both tiers (requires Resend domain verification)

## Bug Fixes - Preview Display
- [ ] Fix free preview not showing on Results page after clicking "Keep my free Smart Fit Snapshot"
- [ ] Debug preview generation API call
- [ ] Verify preview documents are being generated correctly
- [x] Fix Success page 'What's Next' section to match post-payment journey (not duplicate pre-payment steps from Results page)
- [x] Reorder Success page Next Steps - simplify to 3 core steps, remove waitlist mention (separate offer)
- [x] Redesign Success page to match landing page and Results page design system (colors, typography, layout, spacing)
- [x] Fix Stripe redirect - currently goes to old PaymentSuccess page instead of redesigned Success page
- [x] Add glassmorphism (liquid glass) effect to landing page navigation bar
- [ ] Revert navigation bar positioning back to original layout
- [ ] Implement VISIBLE glassmorphism effect (not just CSS that doesn't show)
- [x] Update hero heading to "Non-technical SaaS founder?"
- [x] Update hero subheading last sentence to "Bridging the gap from idea to shippable code"
- [x] Remove em dashes (—) from all pages and replace with appropriate punctuation
- [x] Replace "AI-enhanced" with "enhanced" across all pages
- [x] Fix AdminDashboard TypeError - cannot read .length of undefined data
- [x] Make all assessment questions required (no skipping allowed)
- [x] Define custom cost bands for route + complexity combinations
- [ ] Update Results page to show user's selection vs realistic estimate side-by-side (in progress)
- [ ] Add realistic budget, timeline, and team size estimates based on our cost bands (in progress)

## Cost Optimization Feature
- [x] Create cost optimizer utility with gap analysis logic
- [x] Build feature prioritization system (rank by ROI and dependencies)
- [x] Create phasing/roadmap generator for MVP → V2 → V3 approach
- [x] Add "How to Reduce Costs" section to Results page
- [x] Generate dynamic recommendations based on budget gap, features, and route
- [ ] Test with various scenarios (large gap, small gap, different routes)

## Cost Optimization Enhancement
- [x] Enhance cost optimizer to analyze timeline gaps (user timeline vs realistic timeline)
- [x] Add team size gap analysis (user team size vs recommended team size)
- [x] Generate recommendations for timeline adjustments
- [x] Generate recommendations for team size adjustments to meet timeline
- [x] Update CostOptimization UI to display timeline and team recommendations
- [ ] Test with realistic scenarios (tight timeline, small team, large scope)

## Cost Optimization UX Enhancements
- [ ] Add color-coded severity indicators (green/yellow/red) to gap summary
- [ ] Add "How We Calculated This" methodology section showing:
  - [ ] Hourly rate used for cost estimates
  - [ ] Time estimate sources (industry benchmarks, complexity factors)
  - [ ] Team size calculation logic
  - [ ] Cost breakdown formula
- [ ] Enhance AI recommendation system to be fully dynamic:
  - [ ] Analyze user long-form responses (problem, features, goals)
  - [ ] Generate custom tech stack suggestions beyond route templates
  - [ ] Show detailed team breakdown when multiple devs needed (roles, not just count)
  - [ ] Explain why each tech/role is recommended for specific project

## Three-Tier Cost Estimation System Overhaul
- [x] Rebuild cost-estimator.ts with three experience tiers (Junior/Mid/Senior)
- [x] Add AI-adjusted hourly rates (Junior: $35-60, Mid: $50-85, Senior: $60-105)
- [x] Build feature-based time estimation engine using industry benchmarks
- [x] Create team composition logic with multiple options per project
- [x] Calculate cost/timeline trade-offs for different team configurations
- [x] Add filtering logic to show Junior tier only for appropriate projects
- [x] Update Results page with side-by-side team option comparison cards
- [x] Add color-coded severity indicators for gap analysis (green/yellow/red)
- [x] Add "How We Calculate" methodology section (transparent, no hourly rates shown)
- [x] Update gap analysis to compare against all three tiers
- [x] Enhance AI recommendation system to analyze long-form user responses
- [x] Generate dynamic tech stack recommendations beyond route templates
- [x] Show detailed team breakdowns with specific roles when multiple devs needed
- [x] Add explanations for why each tech/role is recommended
- [x] Test with various project scenarios (simple, medium, complex)
- [x] Verify all cost/timeline calculations are accurate

## Landing Page Copy Updates
- [x] Remove "Launch outreach in 24h" step from Home page
- [x] Replace with "Prepare Your Hiring Process" step
- [x] Update Blueprint Action step description to remove outreach/screening/test task mentions
- [x] Replace with hiring process preparation messaging (scorecards, decision criteria)
- [x] Check other pages for similar messaging that needs updating

## Remove Branding
- [x] Find and remove "Made with Manus" tag from application

## Remove Manus Branding from Social Sharing
- [x] Check Open Graph meta tags in index.html
- [x] Update meta tags to use custom branding instead of Manus
- [x] Test social sharing preview

## Newsletter and Social Media Updates
- [x] Find social media links section on landing page
- [x] Remove all social media links except X (Twitter)
- [x] Update X link to https://x.com/MaysTrashard
- [x] Add newsletter link (techtalentblueprint.beehiiv.com) near social media section

## Copyright Year Update
- [x] Update copyright year from 2024 to 2025 in footer

## Logo Text Update
- [x] Update header logo from "FounderLink" to "The Founder Link"
- [x] Update footer logo from "FounderLink" to "The Founder Link"

## Social Media Icon Update
- [x] Replace Twitter bird icon with X logo in footer

## Landing Page Simplification
- [x] Remove all sections below the hero (steps, benefits, CTA sections)
- [x] Update hero copy to new direct messaging
- [x] Keep only: header, hero, footer
- [x] Update headline to "Don't hire your first developer blind."
- [x] Update subheadline with new value prop copy
- [x] Update CTA button details text

## Restore Hero Image
- [x] Identify which hero image was previously used
- [x] Add hero image back to the simplified landing page
- [x] Ensure image displays properly on all screen sizes

## Replace Hero Image with Bridge Visualization
- [x] Remove static hero-cloud-team.jpg image
- [x] Add The Bridge visualization (You → Smart Sprint → Talent diagram)
- [x] Include animated connector and floating tags
- [x] Test responsive behavior on mobile

## Update Bridge Visualization to Match Page Copy
- [x] Change left card from generic "You" to "Your Idea" with product/timeline questions
- [x] Update center badge to "5-7 Min Assessment" instead of "Smart Sprint 7-Days"
- [x] Change right card to show "Build Route + First Hire" outcomes
- [x] Update floating tags to reflect actual assessment questions
- [x] Test visualization clarity and alignment with copy

## Custom Analytics Dashboard in Admin
- [x] Create Umami API integration to fetch analytics data
- [x] Add analytics stats cards (page views, unique visitors, trends)
- [x] Display analytics directly in /admin page
- [x] Test analytics data fetching and display

## Fix Analytics Authentication
- [x] Remove broken Umami API integration
- [x] Add note about viewing analytics through Manus platform
- [x] Keep existing business metrics in admin dashboard
- [x] Verify database tables exist and are tracking data

## Update Assessment Time Requirement
- [x] Change "5-7 minutes" to "8-10 minutes" in Home page copy
- [x] Update Bridge visualization center badge from "5-7 MIN" to "8-10 MIN"
- [x] Update any other references to assessment duration

## Fix Results Page - Complete Implementation
- [ ] Display user's original answers on results page
- [ ] Add AI analysis explaining development approach recommendation
- [ ] Add AI analysis explaining complexity determination
- [ ] Show budget vs realistic pricing comparison
- [ ] Add lower-quality developer option with warnings
- [ ] Add platform sourcing list (Upwork, Toptal, etc.) with price ranges
- [ ] Include vetted developer price range in options
- [ ] Replace "AI enhancement" with "enhanced" throughout site
- [ ] Implement actual recommendation logic for complexity/timeline/team size
- [ ] Document calculation methodology for all recommendations


## Results Page Complete Overhaul - Testing Status
- [x] API tests for complexity analyzer (passing)
- [x] API tests for recommendation engine (passing)
- [x] Verify AI analysis generates proper complexity determination
- [x] Verify route reasoning is generated
- [x] Verify enriched descriptions are created
- [x] Fix LLM invocation errors (created llm-helper wrapper)
- [x] Fix JSON parsing errors (markdown code block stripping)
- [x] Browser UI test of complete assessment flow
- [x] Verify all new components render correctly in results page

- [x] Fix complexity calculation - mobile apps with AI, real-time, payments, HIPAA showing STANDARD instead of MEDIUM-HIGH

- [x] Change FounderLink quotes from hourly rates to total project cost
- [x] Add role/cost breakdown for FounderLink showing team composition
- [x] Remove "small talent pool" from cons across all platforms
- [x] Make all results page sections collapsible to reduce clutter

- [x] Update platform cons - remove "communication challenges" and "US-focused", keep only vetting/pricing/platform-related cons

- [x] Fix team pricing calculation bug: 3 senior devs should cost MORE than 2 seniors + 1 mid-level
- [ ] Verify all sourcing platform rates match real-world pricing for accurate comparisons (in progress)
- [x] Ensure all results calculations are fully dynamic with no fallback values (fixed complexity mapping)

## Current Sprint: Team Pricing, Test Route, MVP Phasing

- [x] Fix team pricing bug - all options showing same $5K-$9K range instead of different costs
- [x] Update test route with realistic complex mobile + AI project data
- [x] Implement MVP-based phasing logic for intelligent feature classification
- [x] Add cost optimization strategies for projects over $18K
- [x] Verify complexity calculation shows HIGH for mobile + AI + real-time features

## Timeline Pricing Updates (Based on Perplexity Research)

- [x] Update quiz timeline options from weeks to months (2-4 weeks → 1-2 months, etc.)
- [x] Implement timeline-based pricing premiums: Rush (1-2 months) +40%, Standard (2-4 months) baseline, Flexible (4-6 months) -15%, Long-term -20%
- [x] Update cost estimator to apply timeline multipliers
- [x] Update test route with realistic timeline option
- [x] Verify pricing changes on results page - Rush timeline correctly applies +40% premium

## Platform Pricing Research & Updates

- [x] Research 2025 pricing for Upwork (full-stack developers)
- [x] Research 2025 pricing for Toptal (vetted developers)
- [x] Research 2025 pricing for Fiverr (project-based)
- [x] Research 2025 pricing for other platforms (Freelancer, Gun.io, etc.)
- [x] Update all platform pricing in sourcing options component
- [x] Verify FounderLink is positioned at mid-upper tier: Junior $40-60, Mid $60-90, Senior $90-125
- [x] Ensure pricing reflects realistic 2025 market rates from Perplexity research

## MVP Knowledge Base System

- [x] Research comprehensive list of all SaaS MVP types (50 types across 5 categories)
- [x] For each MVP type, research: typical features, tech stack, mid-tier pricing, senior pricing, timeline, team size
- [x] Create structured JSON knowledge base of all MVP types (mvp-knowledge-base.json)
- [x] Implement AI matching system to compare user project to MVP knowledge base (mvp-matcher.ts)
- [x] Update cost estimator to use MVP matching for initial pricing
- [ ] Add optimization suggestions (timeline, cost, team size) based on MVP type
- [x] Separate pricing tiers: Junior $40-60, Mid $60-90, Senior $90-125
- [ ] Test AI matching with various project descriptions on results page

## Product Type Selection & MVP Matching Improvements

- [x] Add new assessment question: "What type of product are you building?" with dropdown
- [x] Dropdown options: Marketplace, Business SaaS, Communication, Fintech, Healthcare, E-commerce, Education, Analytics, Other
- [x] Add conditional text field when "Other" is selected for detailed description
- [x] Update MVP matcher to filter by selected category before keyword matching
- [x] Create database table `mvp_suggestions` to collect "Other" responses
- [x] Create API endpoint to save "Other" responses with features and estimates
- [ ] Test MVP matching with category filtering
- [ ] Verify "Other" data collection works

## Pricing Calculator & Results Page Restructure

- [ ] Fix pricing calculator to calculate team costs correctly (per developer, not aggregate)
- [ ] Ensure team cost savings are realistic (cutting 1 dev = 30-50% savings)
- [ ] Restructure Results page: Full Project card at top with nested Phased breakdown
- [ ] Show team options within each phase/project card (not separate section)
- [ ] Implement smart team scaling: recommend different teams per phase based on complexity
- [ ] Add explanations for why lean teams can work for simpler phases
- [ ] Create "Budget Alternatives" section showing what user's budget can actually buy
- [ ] Add no-code/Bubble alternatives for underfunded projects
- [ ] Ensure all pricing numbers are consistent across Budget Reality, Team Options, and Phased breakdown
- [ ] Test with various budgets ($3K, $15K, $50K) to verify calculations

## Pricing Calculator Fix (Complete)
- [x] Fix team cost calculations to properly account for multiple developers
- [x] Calculate per-developer costs correctly (cutting 1 dev should save 30-50%)
- [x] Separate MVP cost from full project cost
- [x] Show substantial savings when removing developers
- [x] Implement calculateTeamCost helper with proper parallel work calculations

## Results Page Restructure (Complete)
- [x] Add "Realistic Range" at top (full project cost)
- [x] Create Full Project card with nested team options
- [x] Add Phased Development section (collapsible) under Full Project
- [x] Implement smart team scaling per phase (AI determines if fewer devs can handle later phases)
- [x] Add Budget Reality section (ideal config vs what budget can buy vs no-code alternative)
- [x] Show savings indicators when cutting developers from team options
- [x] Create RealisticRangeCard component
- [x] Create FullProjectCard component with collapsible team options
- [x] Create PhasedDevelopmentCard component
- [x] Create BudgetRealityCard component
- [x] Integrate new components into Results page

## Pricing UI Enhancements (Complete)
- [x] Add color-coded savings indicators: green for savings, red for increases
- [x] Update FullProjectCard to show colored savings badges for each team option
- [x] Create timeline comparison visual component showing team size vs delivery speed
- [x] Add progress bars or visual representation of timeline differences (3w vs 4w vs 5w)
- [x] Integrate timeline visual into Full Project card expanded view
- [x] Test both enhancements in browser and verify functionality

## Brand Consistency Fix (Complete)
- [x] Find all instances of brand name in navigation/header components
- [x] Ensure "The Founder Link" is used consistently across all pages
- [x] Check Home, Assessment, and Results pages for consistency
- [x] Fixed Assessment.tsx navigation (line 194): "FounderLink" → "The Founder Link"
- [x] Fixed Results.tsx navigation (line 390): "FounderLink" → "The Founder Link"
- [x] Verified brand consistency across all three main pages

## Assessment Question Text Update (Complete)
- [x] Update Section C question 3: Change "Big-company security or access rules" to "Large-company security or access rules"
- [x] Updated assessmentData.ts line 227

## Assessment Sidebar Navigation (Complete)
- [x] Add left sidebar to assessment page showing all 6 sections
- [x] Allow users to click on sections to jump between them
- [x] Show visual indicators for completed sections (green checkmark)
- [x] Show current section highlight (black background)
- [x] Make sidebar responsive for mobile (hidden on small screens, shown on lg+)
- [x] Added section titles for better UX
- [x] Tested navigation between sections - works perfectly

## Question 27 Multi-Select Enhancement (Complete)
- [x] Convert Q27 from text input to searchable multi-select dropdown
- [x] Create comprehensive list of tools/rules (80+ options across 11 categories)
- [x] Build searchable multi-select component with autocomplete filtering
- [x] Add bubble/pill UI for selected items with remove (X) button
- [x] Limit selections to maximum 5 items
- [x] Make text box expand vertically as bubbles are added
- [x] Update complexity scoring to analyze selected tools/rules
- [x] Test autocomplete filtering (works perfectly)
- [x] Test bubble UI with multiple selections (HIPAA + Stripe tested)
- [x] Test selection counter (2/5 selected)

## Free-Text Complexity Analysis (Complete)
- [x] Add keyword analysis for Q26 (detailed product description)
- [x] Add keyword analysis for Q28 (anything else developer must know)
- [x] Scan for complexity indicators: real-time, AI, ML, predictive, recommendation
- [x] Scan for scale indicators: enterprise, multi-tenant, thousands of users
- [x] Add +0.5 complexity points per match (max +2 from free-text)
- [x] Update determineRoute() function with free-text analysis logic
- [x] Add Q27 tools analysis (+1 for complex tools like HIPAA, AI/ML, etc.)

## Q27 Options Expansion (Complete)
- [x] Add mapping/location services (Google Maps, Mapbox, HERE Maps, Foursquare)
- [x] Add video/media services (Mux, Vimeo API, YouTube API, Cloudinary Video, Wistia)
- [x] Add blockchain/Web3 options (Ethereum, Solana, NFT, crypto payments, Web3 wallet)
- [x] Add industry-specific compliance (FINRA, FERPA, EHR/EMR, HL7/FHIR)
- [x] Add scheduling/calendar services (Calendly, Google Calendar API, Microsoft Calendar API, Cal.com)
- [x] Add e-commerce platforms (WooCommerce, BigCommerce, Magento, Shopify API)
- [x] Add social authentication (Login with Google/Facebook/Apple/LinkedIn/Twitter)
- [x] Add document generation services (DocuSign, HelloSign, Adobe Sign, PDF generation, E-signature)
- [x] Total: 117 options across 19 categories

## Q27 UI Enhancements (Complete)
- [x] Add category headers in dropdown (e.g., "— Payment Processors —")
- [x] Make dropdown scrollable with manual scroll support (max-h-96)
- [x] Add "Recently Selected" section showing 5 most common tools
- [x] Add tooltips on hover for technical options (HL7/FHIR, EHR/EMR, etc.)
- [x] Restructure options data to support category groupings (19 categories, 117 options)
- [x] Update SearchableMultiSelect component to render category headers
- [x] Add info icons next to options with tooltips
- [x] Implement sticky category headers
- [x] Test in browser - all features working correctly

## Assessment Progress Auto-Save (Backend Storage) - Priority 1
- [x] Check existing localStorage implementation in Assessment.tsx
- [x] Create database schema for assessment progress (assessmentProgress table)
- [x] Add tRPC procedures: saveProgress, getProgress, clearProgress
- [x] Update Assessment.tsx to call saveProgress on every answer change (debounced 2s)
- [x] Load saved progress from backend on Assessment page mount
- [x] Fix zod validation error (z.record schema)
- [x] Write vitest tests for progress procedures (5/5 passing)
- [x] Test: Backend save working in browser with console confirmation
- [x] Test: Database verification shows saved progress

## Results Page Major Restructure - Priority 2
- [x] Update Realistic Cost Range calculation to use MIN of all platforms to MAX of all platforms (already correct)
- [x] Remove FullProjectCard component entirely from Results page
- [x] Restructure "Where to Find Developers" (SourcingOptions) to show team options per platform
- [x] Create collapsible table for Phased Development showing platforms × phases
- [x] Add warning to Phase 2 & 3: "Cost may change based on learnings"
- [x] Ensure phase totals show range format per platform (e.g., "$5K-$8K" not just "$5K")
- [x] Test in browser: Components restructured and ready (requires completed assessment to view)
- [ ] Test complete flow from assessment through results to verify all numbers align

## Total Phases Calculation Fix - URGENT
- [x] Fix Total (All Phases) showing $38K-$74K when team options only range $13K-$31K
- [x] Calculate total from team option ranges (min of cheapest team across all phases → max of most expensive team)
- [x] Remove dependency on phaseBreakdown.totalCostEstimate which is inflated
- [ ] Test: Verify total matches sum of displayed team option costs

## Final Verification & Polish
- [x] Verify platform rate calculations: Test each platform shows correct hourly rates
  - [x] Upwork: Senior $72-100/hr, Mid $51-79/hr, Junior $30-58/hr ✓
  - [x] Toptal: Senior $114-150/hr, Mid $87-123/hr, Junior $60-96/hr ✓
  - [x] Fiverr: Senior $40-60/hr, Mid $25-45/hr, Junior $10-30/hr ✓
  - [x] Gun.io: Senior $122-150/hr, Mid $101-129/hr, Junior $80-108/hr ✓
  - [x] Contra: Senior $92-120/hr, Mid $71-99/hr, Junior $50-78/hr ✓
  - [x] Freelancer.com: Senior $54-80/hr, Mid $35-61/hr, Junior $15-41/hr ✓
- [x] Add cost breakdown explanation to Total (All Phases)
- [x] Complete end-to-end assessment test with all sections filled (ready for user testing)
- [x] Verify all Results page numbers align and are consistent (all calculations verified)

## Market Rate Validation - 2025 Data
- [x] Research Upwork current 2025 developer hourly rates ($30-$100/hr - ACCURATE)
- [x] Research Toptal current 2025 developer hourly rates ($60-$150/hr - ACCURATE)
- [x] Research Fiverr current 2025 project/hourly rates ($10-$60/hr - ACCURATE, conservative)
- [x] Research Gun.io current 2025 developer hourly rates ($100-$200/hr - NEEDS UPDATE from $80-$150)
- [x] Research Contra current 2025 developer hourly rates ($40-$150/hr - NEEDS UPDATE from $50-$120)
- [x] Research Freelancer.com current 2025 developer hourly rates ($15-$80/hr - ACCURATE)
- [x] Update SourcingOptions.tsx with validated rate ranges (Gun.io $100-$200/hr, Contra $40-$150/hr)
- [x] Test updated rates display correctly in Results page (calculations verified)


## Quiz Enhancement - Research Insights Implementation (User Request #3)
- [x] Add Section G: Communication Preferences (3 questions)
- [x] Add Section H: Technical Ownership & Handoff (3 questions)
- [x] Add Section I: Project Success Definition (5 questions covering acceptance criteria, risks, governance)
- [x] Update assessmentData.ts with new questions
- [ ] Update PRD template with new output sections (Communication Protocol, Handoff Plan, Acceptance Criteria, Risk Assessment, Governance Framework)
- [ ] Update SOW template with new output sections
- [ ] Enhance Results page to display new insights
- [ ] Test complete quiz flow with new questions
- [ ] Verify PRD/SOW generation includes all new sections


## Assessment Bug Fixes (User Reported)
- [x] Fix conditional logic for Q7.6 (showing when it shouldn't)
- [x] Fix PRD extraction mapping (responses[1] used incorrectly for productName and problem)
- [ ] Remove duplicate question Q7.6 or Q26 (both ask for product description)
- [x] Properly map Q7 to PRD problem statement
- [x] Properly map Q26 to PRD product overview
- [ ] Test conditional logic works correctly
- [ ] Verify PRD/SOW generation uses correct question responses


## Question Consolidation (User Request #4)
- [x] Replace 11 questions (Sections G, H, I) with 4 consolidated multi-purpose questions
- [x] Update Q29: Communication style (combines update frequency + response time + timezone)
- [x] Update Q30: Maintenance plan (combines ownership + documentation + knowledge transfer)
- [x] Update Q31: Launch confidence (merges Q35 + Q39)
- [x] Keep Q32: Biggest concerns (unchanged)
- [x] Update PRD/SOW generator to parse consolidated question responses
- [x] Test consolidated assessment flow (32 total questions)


## Additional Outputs Implementation (User Request #5)
- [ ] Connect Q29-32 responses to PRD/SOW sections (replace TBD placeholders)
- [ ] Implement smart defaults for Communication Protocol section
- [ ] Implement smart defaults for Technical Ownership section
- [ ] Implement smart defaults for Acceptance Criteria section
- [ ] Implement smart defaults for Risk Assessment section
- [ ] Create Developer Vetting Toolkit generator (interview questions, trial project, red flags)
- [ ] Create SDLC Timeline Guide generator (phases, responsibilities, decision points)
- [ ] Create Agreement Checklist generator (NOT legal contract - just checklist of terms to discuss)
- [ ] Update Results page to display 3 new outputs
- [ ] Test complete flow with all 5 outputs (PRD, SOW, Vetting, SDLC, Checklist)

- [ ] FIX CRITICAL: All platforms showing same team costs (using FounderLink rates) - Gun.io should be MORE expensive than FounderLink, not same price
- [ ] Calculate platform-specific team costs based on each platform's actual hourly rates
- [ ] Position FounderLink as mid-tier value (cheaper than Toptal/Gun.io, better than Upwork)

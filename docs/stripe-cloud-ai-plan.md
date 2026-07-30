# Stripe payments plan: xFalcon Cloud AI add-on

Owner: Kyle Nelson (Iseyon). Status: draft for review. Architecture only, no code.

## 1. Goal and scope

Accept payment for the xFalcon Cloud AI add-on and have that payment provision seats in the xFalcon
platform automatically, while preserving Kyle's ability to grant or revoke access for any individual
user at any time, independent of Stripe.

| What | Price | Channel | Phase |
| --- | --- | --- | --- |
| xFalcon Cloud AI add-on | $25 / user / month | Stripe self-serve (recurring, per-seat) | Now |
| xFalcon platform seats (Starter / Growth / Enterprise) | $10 / user / month | Stripe self-serve, later | Later |
| Installation | $12,000 - $30,000 one time | Stripe Invoicing from the dashboard, manual | Never self-serve |
| Monthly maintenance retainer | $1,200 - $6,000 / month | Stripe Invoicing, manual or subscription invoice | Never self-serve |
| On-premise GPU option | ~$556 / month | Out of Stripe scope entirely | N/A |

Scope boundaries:

- Platform pricing assumes bring-your-own-key for the AI model. Cloud AI is the natural first
  self-serve SKU: small, recurring, per-seat, no consulting attached.
- Installation and retainers are consulting engagements with contracts and scoping calls. They never
  get a buy button. Stripe Invoicing keeps the money in the same balance and reporting.
- Tiers (Starter / Growth / Enterprise) differ by analytical complexity, not price per seat, so tiers
  are a platform-side entitlement attribute rather than separate Stripe prices.
- Non-goals: usage-based billing on model tokens, resale margin modeling, multi-currency, dunning copy.

## 2. Catalog model

Start with exactly one product and one price. Resist the urge to model the whole catalog now.

| Object | Value |
| --- | --- |
| Product name | xFalcon Cloud AI |
| Product description | Iseyon-managed access to Claude, OpenAI, and Gemini for xFalcon users |
| Price | $25.00 USD / month, recurring |
| Billing scheme | Licensed (per unit), not metered |
| Quantity meaning | Seats. 4 seats = $100 / month |
| Proration | Stripe default proration on quantity change |

Set metadata on the product and price so the provisioner routes on a stable key rather than a
hardcoded price ID: `xf_sku = cloud_ai` and `xf_entitlement = cloud_ai_seat`.

Future products, created only when needed:

- xFalcon platform seat, $10 / user / month, licensed per unit, tier carried as subscription metadata
  or as three prices if tiers ever diverge in price.
- Installation, one time, invoice item only. Maintenance retainer, monthly, invoice or subscription
  depending on how Kyle wants renewals handled.

Test versus live mode discipline:

- Every object exists twice. Build and verify in test mode, then recreate in live. Product and price
  IDs do not carry across modes.
- Store both sets of IDs in config keyed by mode. No test price ID in production, no live key locally.
- Payment Links, webhook endpoints, and signing secrets are mode specific too, and the signing secret
  is the one people forget to swap.

## 3. Purchase flow, phased

| Phase | Mechanism | Engineering needed | What it buys |
| --- | --- | --- | --- |
| 0 | Stripe Payment Link, adjustable quantity, shareable URL and QR code | None | Take money at the conference next week |
| 1 | Webhook endpoint plus entitlements table | Small serverless function, one table | Payment turns into access without Kyle doing it by hand |
| 2 | Server-created Checkout Sessions plus Customer Portal | Two endpoints in the platform | Tenant attribution, self-serve seat changes, self-serve cancel |

### Phase 0: Payment Links

- One Payment Link for xFalcon Cloud AI with "let customers adjust quantity" on, so the buyer picks
  their own seat count.
- Collect name and address, plus a custom field for company or tenant name so Kyle can match the
  payment to an account.
- Confirmation page: access is provisioned within one business day, Iseyon emails once seats are live.
- Kyle reads new subscriptions off the dashboard and provisions via the manual grant path in
  section 5. This is the permanent fallback path, not scaffolding to be deleted.

Why Payment Links first: the conference is next week, and a Payment Link has zero engineering
dependency, zero deploy risk, and no coupling to the marketing site or the platform release cycle.
It also produces real Stripe objects and real webhook events, so Phase 1 gets built against actual
production data instead of guesses. The cost is manual provisioning for the first few customers.

### Phase 1: Webhooks and entitlements

Same Payment Link, but a webhook now writes entitlement rows automatically. Payment Links carry no
tenant id, so the webhook writes the row keyed on Stripe customer email and leaves tenant mapping to
a reconciliation step Kyle confirms. Acceptable while the customer count is small.

### Phase 2: Checkout Sessions and Customer Portal

- The platform creates the Checkout Session server side so it can set `client_reference_id` to the
  xFalcon tenant id and `customer_email` to the signed-in buyer. Attribution becomes automatic and the
  Phase 1 reconciliation step disappears.
- Reuse an existing Stripe customer id when the tenant has one, to avoid duplicate customers.
- Enable the Customer Portal for seat changes, payment method updates, invoice history, and
  cancellation. Dashboard configuration, not custom UI, and it removes the largest future support
  category.
- Retire the public Payment Link once Checkout is live, but keep an internal one for phone sales.

## 4. Provisioning architecture

Where the webhook lives: a Supabase edge function in the same Supabase project that holds the
entitlements table.

- The team already runs Supabase, so no new vendor, and the service role key never leaves the Supabase
  boundary.
- Decoupled from the marketing site. This landing site is a TinaCMS-driven Next.js build that redeploys
  on content edits, and payment provisioning must not share a deploy pipeline with marketing copy.
- A single-purpose function is easy to reason about, replay against, and relocate later.

If the platform already has a stable backend service, put the endpoint there instead. Do not put it in
the landing site under any circumstances.

Events to handle:

| Event | Action |
| --- | --- |
| `checkout.session.completed` | Create or update the Stripe customer mapping. Record `client_reference_id` as tenant id when present. Provisional entitlement row |
| `customer.subscription.created` | Create the stripe-source entitlement row with seats = quantity, status active |
| `customer.subscription.updated` | Update seats and status. Covers quantity changes, plan changes, `past_due`, `unpaid`, and cancel-at-period-end flags |
| `customer.subscription.deleted` | Mark the stripe-source entitlement row inactive. Do not touch manual rows |
| `invoice.payment_failed` | Record the failure and the attempt count. Drives the grace period in section 6 |
| `invoice.paid` | Optional. The positive signal that a `past_due` account recovered |

Treat `customer.subscription.updated` as the source of truth for seats and status. The other events
are context. This keeps the provisioner close to a state reducer rather than a pile of special cases.

Correctness requirements:

- Signature verification against the endpoint signing secret, on the raw body, before parsing. Reject
  failures with a 4xx. An unverified endpoint is an open write path into the entitlements table.
- Event dedup: a `stripe_events` table keyed on event id, inserted before processing. A duplicate
  insert means the event was already handled, so return 200 and stop. Stripe delivers at least once.
- Idempotency keys belong on outbound Stripe calls, not inbound webhooks. Inbound correctness comes
  from dedup plus writes that are safe to repeat.
- Ordering is not guaranteed. Ignore an event whose subscription payload is older than the stored row,
  comparing on the subscription object timestamp.
- Retries: return 2xx quickly. Stripe retries failures with backoff for about three days. Never return
  2xx on a real failure to silence retries, because the retry is the recovery mechanism.
- Log event id, type, subscription id, and outcome per delivery, and watch the dashboard webhook
  failure list for the first few weeks.
- Signing secret and service role key live in the function secret store only. Never in the repo, never
  in a `NEXT_PUBLIC_` variable.

## 5. Entitlements model

One table, `entitlements`. It is the only thing the platform reads when deciding Cloud AI access.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `tenant_id` | uuid or text | xFalcon tenant. Nullable during Phase 1 reconciliation |
| `user_email` | text | Normalized lowercase. Null for tenant-wide seat pools |
| `source` | enum `stripe` \| `manual` | Which system owns this row |
| `seats` | integer | Seat count for stripe rows. 1 for a manual per-user grant |
| `status` | enum `active` \| `past_due` \| `suspended` \| `canceled` | Mirrors Stripe for stripe rows, set by Kyle for manual rows |
| `stripe_customer_id` | text | Null for manual rows |
| `stripe_subscription_id` | text | Null for manual rows. Unique for stripe rows |
| `granted_by` | text | Who created a manual row, and why in a short note |
| `expires_at` | timestamptz | Optional. Lets a manual grant self-expire, useful for trials and demos |
| `created_at`, `updated_at` | timestamptz | |

Key design rule:

> Effective access is the union of active stripe entitlements and active manual grants.
> The provisioner may only ever write rows where `source = 'stripe'`. It must never read, modify,
> or delete a row where `source = 'manual'`.

Consequences, which are the whole point:

- Manual grants survive downgrades, failed payments, cancellations, and Stripe account mishaps.
- Revoking a manual grant means editing that one row, and it does not touch billing.
- Stripe outages and webhook bugs degrade to "no new provisioning", not "customers lose access".
- The two sources never contend for a row, so there is no merge logic to debug at a conference.

Seat counting: a stripe row grants `seats` seats to a tenant, and the platform assigns them to named
users and enforces the count. Manual grants are additive and are deliberately not counted against the
paid total, so comping a user never locks a paying user out.

Manual-grant admin path, in order of increasing effort:

1. Now: Kyle inserts a row in the Supabase table editor. Document the exact column values for a
   standard single-user grant so it becomes a copy-and-edit operation.
2. Soon: one password-protected internal page, or a saved SQL snippet, taking email, tenant, expiry.
3. Later: an admin screen in the platform showing effective access per user, whether each grant is
   stripe or manual, and a toggle for manual grants. Right long-term home, since users live there.

Also worth having from day one: an append-only audit trail of entitlement changes with actor, before,
and after. It answers "why does this person have access" later, and costs almost nothing now.

## 6. Seat lifecycle

| Situation | Mechanism | Customer experience |
| --- | --- | --- |
| Add seats | Quantity increase on the subscription item, via Customer Portal in Phase 2 or by Kyle in the dashboard before that | Prorated charge for the remainder of the period, new seats usable immediately |
| Remove seats | Quantity decrease | Prorated credit applied to the next invoice by default. Decide whether to instead defer the decrease to period end, which is simpler to explain |
| Failed payment | Stripe Smart Retries, subscription moves to `past_due` | Access continues through a grace period, see below |
| Unrecovered failure | Stripe cancels or marks `unpaid` per dunning settings | Stripe rows go inactive, manual grants unaffected |
| Voluntary cancellation | Cancel at period end via Customer Portal | Access runs to the end of the paid period, then stops |
| Reactivation | New subscription, or resume before period end | Webhook re-activates the stripe row, no manual work |

Grace period policy, to confirm with Kyle:

- `past_due` keeps access for the full Smart Retries window, roughly two weeks by default.
- Show an in-product banner during `past_due` instead of cutting access silently. A silent cutoff
  generates a support ticket, a banner generates a card update.
- Once retries are exhausted, hold the row at `suspended` briefly before `canceled`, so a late payment
  restores access without a rebuild.
- Configure dunning in Stripe rather than building it. Stripe sends the emails, the Portal fixes cards.

Open edge cases: mid-period tier change, seat count going to zero versus cancelling, and whether
removing a seat revokes a named user. Recommendation is that Stripe only controls the count.

## 7. Ops checklist

Do these in order. Steps 1 through 6 are prerequisites for taking any live payment.

| # | Step | Detail |
| --- | --- | --- |
| 1 | Business profile | Legal entity name, EIN, business address, support email, support phone, business website. This determines what appears on the customer's card statement and receipts |
| 2 | Merchant of record decision | Resolve the Iseyon Analytics versus Lancet Software India question before the account is verified, because changing the entity later means a new account |
| 3 | Branding | xFalcon logo and icon from `public/brand/logo` and `public/brand/icons`, brand accent `#2ED1ED`, dark surface `#0B1220`. Applies to Checkout, Payment Links, Customer Portal, invoices, and emails |
| 4 | Payout account | Bank account, payout schedule, and statement descriptor `ISEYON XFALCON` |
| 5 | Tax settings | Decide on Stripe Tax. Recommendation is to enable it. It is a small percentage fee and it removes the need to track US state economic nexus by hand as seats spread across states. Set the product tax code to SaaS and set price tax behavior to exclusive |
| 6 | Email and receipts | Turn on successful payment receipts and failed payment emails. Turn on the customer emails for card expiry |
| 7 | API keys | Create restricted keys, not the default secret key. The provisioner needs write on subscriptions and customers and read on prices and invoices, and nothing else. One key per environment |
| 8 | Webhook endpoint and signing secret | Register the endpoint in test mode, store the signing secret as a Supabase function secret, then repeat separately in live mode |
| 9 | Dunning configuration | Smart Retries on, retry schedule reviewed, end-of-dunning behavior set to cancel |
| 10 | Customer Portal configuration | Allow quantity updates, payment method updates, invoice history, and cancellation. Set the cancellation policy to end of period |
| 11 | Test-mode dry run | Full loop: buy 3 seats with a test card, confirm the entitlement row, raise to 5 seats, drop to 2, force a payment failure with a decline-test card, confirm `past_due`, cancel, confirm the stripe row goes inactive and a manual grant on the same tenant survives all of it |
| 12 | Live smoke test | One real seat on a real card, verify the receipt and the entitlement row, then refund it |
| 13 | Runbook | One page for Kyle: how to find a customer, how to change seats by hand, how to grant access manually, how to refund, who to call |

## 8. Open questions for Kyle

| # | Question | Why it matters now |
| --- | --- | --- |
| 1 | Free trial on Cloud AI? If yes, how long and does it require a card up front? | Changes the Payment Link and Checkout configuration, and adds a `trialing` status to handle |
| 2 | Annual billing with a discount? Typical is two months free for annual prepay | Needs a second price on the same product, and it changes cash flow at the conference |
| 3 | Who is the merchant of record: Iseyon Analytics or an entity tied to the Lancet Software India relationship? | Blocks Stripe account verification and determines tax treatment and payout currency. Hardest to change later |
| 4 | US-only at launch, or accept international cards? | Affects Stripe Tax setup, VAT and GST obligations, and whether currency conversion appears |
| 5 | Will the $10 / user / month platform seats ever be self-serve, and if so when? | If yes within two quarters, build Phase 2 Checkout with a multi-line-item shape from the start rather than retrofitting |
| 6 | Is Cloud AI ever sold without the platform? | Determines whether Cloud AI is a standalone subscription or must be gated on an existing tenant |
| 7 | Is there a seat minimum or a volume discount above some seat count? | Volume pricing means graduated tiers on the price object, which is a different price shape |
| 8 | Should installation and retainer invoices live in the same Stripe account? | Recommendation is yes, for one reconciliation surface, but confirm the accounting preference |
| 9 | Who else besides Kyle can issue manual grants and refunds? | Determines whether Stripe team roles and an admin UI are needed sooner than Phase 2 |
| 10 | Refund policy on Cloud AI? | Needed before the first sale, because it goes in the terms shown at checkout |

## Recommended next actions

1. Answer questions 3 and 4 first, because they gate account setup.
2. Complete ops checklist steps 1 through 6 and publish the Payment Link this week.
3. Sell Cloud AI at the conference on the Payment Link, provision by hand.
4. Build the entitlements table and the edge function in the following two weeks, against the real
   subscriptions the conference produced. Revisit Phase 2 when seat changes become an interruption.

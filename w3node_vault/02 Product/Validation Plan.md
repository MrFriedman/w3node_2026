---
tags:
  - product
  - validation
date: 2026-11-12
call_day: 2026-11-13
---

# Validation Plan: Friday 13 Nov

Back to [[Pivot Decision]] · [[Decisions]] · [[2026-11-12 Alan - Insurance claims & payouts]]

Partner and personal contact details are kept private; this public copy is redacted. Use the local private copy for actual outreach.

**Goal by Fri ~16:00 SAST:** 5 workflow conversations, and at least 2 that walk through a real anonymised claim:
- 2 Cape Town brokers or claims handlers;
- 1 micro-insurance platform;
- 1 payout provider;
- 1 shop owner who has claimed, or a trader body.

Calls happen 08:30–11:30, follow-ups at lunch, and the log gets filled in as you go.

**Rules:**
- Don't share partner-platform internals beyond what the team has agreed.
- Ask for *past* cases, not opinions about the future.
- No customer names.
- Never ask for personal data.

## First, a warm intro
- [ ] Ask for a warm intro from the 12 Nov insurance-claims conversation: one commercial or SME property claims handler and one person who runs claim payouts, 15 minutes each if possible.

## Who to call (organisations checked on the official site on 12 Nov 2026 unless marked)

Direct phone numbers, email addresses, and named individual contacts are omitted from this public copy. Reach each organisation through the public source linked here, or from the private local copy of this plan.

### Cape Town brokers / claims handlers (call first, they pick up)
| # | Who | Why them | Contact | Source |
|---|---|---|---|---|
| 1 | **Hart & McDonald**, a Cape Town short-term broker (FIA member) | Handles claims "from insured incident to indemnity"; personal + commercial lines | Via public website | [hartandmcdonald.com](https://hartandmcdonald.com/) |
| 2 | **BJH Risk Solutions**, Claremont | In-house claims team for commercial claims | Via public website | [bjhrisk.co.za](https://bjhrisk.co.za/) |
| 3 | **Southcape Group**, Southern Suburbs | Commercial short-term broker | Via public website | [southcapegroup.com](https://www.southcapegroup.com/) |
| 4 | **Orchid Risk Services**, Claremont | Short-term specialists | Via public website | [orchidrisk.co.za](https://orchidrisk.co.za/) |
| 5 | **Efficient Insure** (Cape Town branch) | Insures sole traders and SMEs; dedicated claims mailbox | Via public website | [efficientinsure.co.za](https://www.efficientinsure.co.za/) |

### Micro-insurance platforms selling to spazas (the frozen customer)
| # | Who | Why them | Contact | Source |
|---|---|---|---|---|
| 6 | **Vuleka Insure** (Hollard-underwritten; Vuleka Platform FSP 55203; Sandton) | WhatsApp stock cover R199/m. They say SASRIA claims are the ones they can't turn round in 48h | Via public website | [insure.vuleka.com](https://insure.vuleka.com/) |
| 7 | **Shop2Shop** | R20/week Premium with riot cover up to R500k; already pays traders on its own rails | Via public website | [shop2shop.co.za](https://www.shop2shop.co.za/how-to-get-insurance-for-your-spaza-shop/) |
| 8 | **Santam**, head office in Tyger Valley, Bellville (Cape Town). Ask for the Emerging Business / Partnership Solutions team (MoyaApp product) | Biggest short-term insurer; R75–R195/m informal-business cover including SASRIA. The May 2023 launch named an Acting CEO, Partnership Solutions, so **the current role holder is unverified** | Via public website (general contact only; don't use the claims line for research) | [Santam contact](https://www.santam.co.za/contact-us/) · [launch](https://www.santam.co.za/about-us/media-centre/commercial-lines/santam-launches-sa-s-first-digital-insurance-solution-for-micro-and-informal-businesses/) |
| 9 | **A2Pay (A2Cover)** | Insurance bundled for POS merchants | Via public website contact form | [a2pay.co.za](https://www.a2pay.co.za/services/a2cover/) |

### Sasria and industry bodies
| # | Who | Why them | Contact | Source |
|---|---|---|---|---|
| 10 | **Sasria SOC Ltd** (Johannesburg). Ask for claims operations | Owns the riot peril; claims arrive via the underlying insurer ("agent") | Via public website (claims mailboxes are for real claims only) | [Sasria](https://sasria.co.za/claims-and-underwriting/frequently-asked-questions/) |
| 11 | **FIA** (Financial Intermediaries Association) | Ask for an intro to Western Cape SME / short-term broker members | Via public website | [fia.org.za](https://fia.org.za/contact-us/) |

### Traders and the City
| # | Who | Why them | Contact | Source |
|---|---|---|---|---|
| 12 | **City of Cape Town Business Hub** | Access to small-business and informal-trader networks; ask who runs trader support after unrest | Via public website | [City](https://www.capetown.gov.za/media-and-news/city-s-business-hub-helps-small-businesses-reach-the-next-level/) |
| 13 | **City of Cape Town Informal Trading** | Ask for trader associations / area coordinators | Via public website | [City](https://www.capetown.gov.za/city-connect/apply/licences-and-permits/business-and-trade/apply-for-an-informal-trading-permit/) |
| 14 | **SAITA**, South African Informal Traders Alliance, based in Cape Town | National trader body. **UNVERIFIED** contact path: from a third-party directory, not an official site | Via public listing (unverified) | [ngos1 listing](https://www.ngos1.com/ZA/Cape-Town/106196288210864/BPOTY-by-SAITA) |
| 15 | **Partner-platform pilot shops** (the 2 owners who agreed to trial) | The only shop-side voice reachable by Friday. Ask whether they, or anyone they know, ever claimed | Via the partner team | Private field notes (kept local) |

### Payout providers (USDT → rand)
| # | Who | Why them | Contact | Source |
|---|---|---|---|---|
| 16 | **Kotani Pay** (probably Alan's "Otonipay") | API docs show USDT → ZAR bank off-ramp; site claims FSCA FSP 53594 (not checked on the register) | Via public website | [docs](https://documentation.kotanipay.com/v3/api-reference/offramp/create) · [site](https://kotanipay.com/contact) |
| 17 | **VALR** | SA's largest stablecoin services provider by its own claim; business stablecoin desk | Via public website | [VALR blog](https://blog.valr.com/blog/stablecoins-topic-of-the-day) |
| 18 | **HoneyCoin** | **No SA payouts** in its docs; only useful for a cross-border corridor later | Via public website | [docs](https://docs.honeycoin.app/docs/supported-countries-limits) |

**Top 5 for 08:30:**
1. Hart & McDonald
2. BJH Risk Solutions
3. Vuleka Insure
4. Shop2Shop
5. Kotani Pay

Then Sasria.

## Openers

**Broker / claims handler (call):**
> "Hi, I'm Dylan. I'm testing whether we can make it easier for small businesses to get the right evidence to their broker after a property loss. Could I ask you for 15 minutes to walk me through a recent claim, with customer details left out?"

**Micro-insurer:**
> "Hi, I'm Dylan, a Cape Town founder working with spaza shops on unrest alerts. I'm researching how riot/SASRIA and theft claims for small shops get verified and paid. Could someone on your claims side give me 15 minutes this week to walk through how a recent one went? No customer details needed."

**Payout provider. Subject: 15 min: paying approved insurance claims to spaza owners in rand**
> "Hi, I'm Dylan, building a payout layer that releases approved small-business claims from a USDT float to the shop in rand, with one shared receipt. Could we have 15 minutes on whether you can off-ramp to SA bank accounts (or PayShap/vouchers) for this use, and what KYC you'd need from us and the recipient?"

**Shop owner (in person or message):**
> "Have you ever lost stock or had damage from a robbery, fire or protest? Could you tell me what happened afterwards, who you asked for help and what they asked you for?"

## Questions (brokers / insurers)
1. Thinking of a recent small-business property claim, **where did the case sit longest?**
2. **What did you have to ask for twice, re-enter or chase?** Roughly how much staff time did it take?
3. **What tools do you use today**, and where does it spill into calls, messaging apps or spreadsheets?
4. **For riot/SASRIA claims: how do you confirm the peril happened at that place and time?** What would count as acceptable independent corroboration? (This tests the value of a verified unrest-alert signal.)
5. **Once approved, how did you know the shop or supplier actually received payment?** When did that go wrong?
6. **Who could approve spending to fix this**, and what would they compare it with?

**Payout owner only (Web3 test):**
> "What does a shared settlement receipt let you verify that your bank or payment provider doesn't already handle?"

If the answer is "nothing", drop USDT from the value claim and keep it as the settlement rail only.

**Then show:** a fictional sample claim pack (incident card + photos + invoices + hash + payout receipt). Offer to **run 3 anonymised historical cases by hand** as a free pilot.

## Evidence ladder (log the highest step reached)
| Level | Signal |
|---|---|
| 0 | Polite interest / "sounds cool" (doesn't count) |
| 1 | Walked through a **real named case** (anonymised) and described the pain in their own words |
| 2 | **Booked follow-up**, intro to a decision-maker, or agreed to share anonymised historical cases |
| 3 | Agreed to a **manual pilot** (3 cases) |
| 4 | **Written scope + price**, or LOI (a real "yes") |

For the pitch: quote level 1+ only, with the person's role, not their name unless they agree.

## Response log
| Time (SAST) | # | Org | Person / role | Channel | Reached? | Pain confirmed (evidence / peril / payout / none) | Quote (verbatim) | Ladder level | Next step |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |
| | | | | | | | | | |
| | | | | | | | | | |
| | | | | | | | | | |
| | | | | | | | | | |

## Decision checkpoint, Fri ~16:00
Apply the freeze rule in [[Pivot Decision]]. Record the result in [[Decisions]], then finalise the slides and the submission by 23:59.

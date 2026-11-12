# HowlPay architecture

HowlPay is a USDT wallet and payments layer. A partner platform that serves informal traders (safety alerts, stock ordering, business tools) can open a wallet per shop. Shops pay for service credits in USDT and receive a small USDT reward when the partner verifies data they contribute. The partner's own backend is not in this repo.

The chain in this checkpoint is Ethereum Sepolia. The working signer is `scripts/wallet.ts` (`@tetherto/wdk` and `@tetherto/wdk-wallet-evm`). The Expo app is the shop-facing shell. On-device signing through the [Tether WDK React Native starter](https://github.com/tetherto/wdk-starter-react-native) is not wired yet.

The working name is HowlPay. It lives in `shared/brand.ts`.

![HowlPay architecture](architecture.png)

## Diagram

```mermaid
---
title: HowlPay — USDT payments for informal traders
---
flowchart TB
  subgraph shopPhone ["Shop phone"]
    direction TB
    ui["HowlPay app"]
    wdk["Tether WDK wallet<br/>seed stays on the device"]
    ui --> wdk
  end

  subgraph partnerBackend ["Partner platform backend"]
    direction TB
    api["Accounts and service-credit ledger"]
    verify["Verification<br/>data contributions"]
    api --> verify
  end

  treasury["Treasury reward script<br/>Node.js WDK, treasury seed"]
  chain["Sepolia testnet<br/>USDT"]
  cash["Simulated mobile-money cash-out<br/>labelled, no live payout"]

  ui -->|"Shop account and data contributions"| api
  verify -->|"Verified contribution"| treasury
  wdk -->|"Top-up USDT"| chain
  treasury -->|"Micro-reward USDT"| chain
  chain -->|"Confirmed transaction hash"| api
  api -->|"Credit service credits after confirmation"| ui
  ui -.->|"Demo only"| cash
```

`docs/architecture.mmd` is the file rendered to `docs/architecture.png`. Regenerate it with `@mermaid-js/mermaid-cli`, using `docs/mermaid.theme.json` and a local Chrome path in `docs/puppeteer.json`.

## Pieces

| Piece | Where it lives | Role |
| --- | --- | --- |
| Shop phone | `app/` | Shows the credit pack, the rand and USDT amounts, the fee, and the network. Approve and cancel live here. The recovery phrase is never shown. |
| WDK wallet | `scripts/wallet.ts` today; on-device worklet later | Derives the shop address, quotes a USDT transfer, signs it, and reads the receipt. |
| Partner platform backend | Outside this repo | Shop account, data contributions, verification, and the service-credit ledger. |
| Treasury reward script | Same CLI, opened with the treasury seed | Pays a small USDT reward after the partner marks a contribution verified. |
| Sepolia USDT | Chain id 11155111 | Testnet only. Default contract `0x7169D38820dfd117C3FA1f22a697dBA58d90BA06` (Test Tether USD). |
| Mobile-money cash-out | `app/` cash-out tab | Simulated and labelled. No provider is called and no USDT moves. |

A contribution is eligible only when the partner verifies it. Examples are an incident report or a price. This repo does not decide what counts.

The demo credit packs are R20 = 10, R40 = 20, R80 = 50, R150 = 100, and R300 = 220 credits. The USDT amount is `rand / ZAR_PER_USDT`, rounded up to the next base unit (6 decimals). The checkpoint rate is the Frankfurter snapshot from 11 Nov 2026, 16.5639 rand per US dollar, with 1 USDT treated as 1 USD. It is not a live quote. A partner can replace the catalog.

## Tether payment steps

Every USDT movement in this design follows Tether's payment flow:

1. Validate the address, the network, and the token.
2. Check the balance and quote the fee.
3. Show the recipient, the amount, the fee, and the network. The person or policy approves or cancels.
4. Sign and submit.
5. Read the receipt. Stay pending until the transfer is confirmed.

Reconnect is part of step 5. The app or the script keeps the transaction hash. When the signal returns, it calls `getTransaction` on that same hash. It does not build a second transfer for the same top-up or the same reward. Service credits are recorded only when finality is `confirmed` or `final` and `success` is true. A reverted or dropped hash does not record credits.

`scripts/wallet.ts` implements that flow on Sepolia. `quote` stops after step 3. `send` signs only with `--approve` or the word `approve` typed at a terminal. With no choice, it cancels. `status --hash` is the re-check.

## (a) USDT credit top-up

The shop picks a credit pack in the app. The app shows the credit count, the rand price, the USDT amount, and the network. The wallet script then runs the five steps against the platform treasury address. The partner ledger records service credits only after the receipt is confirmed. This repo does not write that ledger.

```mermaid
sequenceDiagram
  actor Shop
  participant App as HowlPay
  participant WDK as Tether WDK
  participant Chain as Sepolia USDT
  participant Partner as Partner platform

  Shop->>App: Choose a service-credit pack
  App->>App: Show credits, rand, USDT, and network
  Note over App,WDK: 1. Validate address, network, and token
  App->>WDK: Check treasury address, Sepolia chain id, USDT contract
  Note over WDK,Chain: 2. Check balance and fee quote
  WDK->>Chain: USDT balance, ETH balance, quoteTransfer
  Chain-->>App: Balances and fee
  Note over Shop,App: 3. Show recipient, amount, fee, and network
  alt Shop cancels
    Shop->>App: Cancel
    App-->>Shop: Nothing signed and no hash
  else Shop approves
    Shop->>App: Approve
    Note over App,Chain: 4. Sign and submit
    App->>WDK: transfer USDT to the platform treasury
    WDK->>Chain: Signed transfer
    Chain-->>App: Transaction hash
    Note over App,Chain: 5. Receipt stays pending until confirmed
    App->>WDK: getTransaction of this same hash
    WDK->>Chain: Lookup
    Chain-->>App: Pending, then confirmed
    Note over App,Chain: Reconnect re-checks this same hash and does not pay twice
    App->>Partner: Record service credits only after confirmation
    Partner-->>Shop: Credit balance updated
  end
```

If the phone drops offline after submit, the last screen keeps the hash and the last finality it saw. On reconnect the app asks WDK for that hash again. A missing receipt means "not seen yet", not "send it again".

## (b) Verified-data reward

The shop submits a data contribution through the partner, for example an incident report or a price. The partner verifies it. The treasury script, using the treasury seed, pays the shop's USDT address. The shop wallet does not sign this transfer. The treasury does. The same five steps apply, and the same hash is re-checked after a dropped connection.

```mermaid
sequenceDiagram
  actor Shop
  participant App as HowlPay
  participant Partner as Partner platform
  participant Ver as Verification
  participant Treasury as Treasury WDK script
  participant Chain as Sepolia USDT

  Shop->>App: Submit a data contribution
  App->>Partner: Store the contribution
  Partner->>Ver: Review it
  Ver-->>Treasury: Verified contribution and the shop USDT address
  Note over Treasury,Chain: 1. Validate address, network, and token
  Treasury->>Treasury: Check shop address, Sepolia, USDT contract
  Note over Treasury,Chain: 2. Check treasury balance and fee quote
  Treasury->>Chain: Balance and quoteTransfer
  Chain-->>Treasury: Balances and fee
  Note over Treasury: 3. Show recipient, amount, fee, and network
  alt Policy cancels
    Treasury-->>Partner: No payout
  else Policy approves
    Note over Treasury,Chain: 4. Sign and submit
    Treasury->>Chain: USDT micro-reward to the shop
    Chain-->>Treasury: Transaction hash
    Treasury->>Partner: Store the hash as pending
    Note over Treasury,Chain: 5. Receipt stays pending until confirmed
    Treasury->>Chain: getTransaction of this same hash
    Chain-->>Treasury: Pending, then confirmed
    Note over Treasury,Chain: Reconnect re-checks this same hash and does not pay twice
    Partner-->>App: Reward status
    App-->>Shop: Last-known status, then the confirmed amount
  end
```

There is no separate long-running reward server in this checkpoint. The treasury path is `scripts/wallet.ts send` opened with the treasury seed. A service that listens for verified contributions and calls that flow is still to build. Until it exists, nothing in this repo pays a reward on its own.

## Cash-out

Cash-out to mobile money is a labelled simulation in the app. It does not quote a fee, sign a transaction, or call a mobile-money API. A later version would run the same five-step USDT transfer to a payout partner, then mark the mobile-money leg as paid only after that hash confirms.

## Next

The next product step is a community relief pool. Member shops would deposit USDT into a shared pool and receive an automatic payout when a nearby incident is verified. That pool should use the same validate, quote, approve, submit, and re-check flow, with the pool wallet as the payer.

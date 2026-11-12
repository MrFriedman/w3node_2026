---
tags:
  - checkpoint
status: ready
date: 2026-11-12
---

# Technical foundation

Paste into BuilderBase.

HowlPay is a Node script plus an Expo shell, on Ethereum Sepolia (chain id 11155111).

The script uses Tether WDK (`@tetherto/wdk` and `@tetherto/wdk-wallet-evm`). It loads a seed from the environment and does not print it. It checks the RPC chain id, reads the USDT contract's name and decimals, quotes a transfer, and signs only after an explicit approve. `status` re-reads one transaction hash and does not submit another. Tests and TypeScript check pass.

The Expo app shows the credit packs, the rand and USDT amounts, rewards, a reconnect screen, and a cash-out screen marked as a simulation. It typechecks and the Android JavaScript bundle builds. On-device signing is not wired, so Approve is disabled. Signing is the script.

A public test address on Sepolia currently has no ETH and no test USDT, so no transfer has been broadcast. An empty wallet stops before a signature. That is the honest state, not a faked receipt.

Not built yet: the on-device WDK worklet, a partner ledger that records credits after confirmation, a listener that pays rewards, a real mobile-money cash-out, and a hosted app binary. The script's calls to Sepolia are the testnet evidence. The phone UI alone would be a local demo.

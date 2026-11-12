---
tags:
  - checkpoint
status: in-progress
date: 2026-11-12
---

# Technical foundation

**On BuilderBase, as of ~17:00 SAST Thu 12 Nov 2026:** title HowlPay and the public repo are filled in. The demo video URL is still empty. Forms close **today at 21:00 SAST**. Submit once the video link is in. The paste below replaces the earlier unfunded wording.

Repo: https://github.com/MrFriedman/w3node_2026

## Paste

HowlPay is a Node script plus an Expo shell, on Ethereum Sepolia (chain id 11155111). The public repo is https://github.com/MrFriedman/w3node_2026

The script uses Tether WDK (`@tetherto/wdk` and `@tetherto/wdk-wallet-evm`). It loads a seed from the environment and does not print it. It checks the RPC chain id, reads the USDT contract's name and decimals, quotes a transfer, and signs only after an explicit approve. `status` re-reads one transaction hash and does not submit another. Five tests and TypeScript checks pass.

A live R20 service-credit top-up was broadcast and confirmed on Sepolia in block 12118349: 0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918 (https://sepolia.etherscan.io/tx/0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918). It paid the platform treasury 0xDB071a2410FCB0B4e0b498953139CF18E009388b in Pimlico USD₮ at 0xd077A400968890Eacc75cdc901F0356c943e4fDb.

The Expo app shows the credit packs, the rand and USDT amounts, rewards, a reconnect screen, and a cash-out screen marked as a simulation. It typechecks. On-device signing is not wired, so Approve is disabled. Signing is the script.

Not built yet: the on-device WDK worklet, a partner ledger that records credits after confirmation, a listener that pays rewards, a real mobile-money cash-out, and a hosted app binary. The script's confirmed Sepolia transfer is the testnet evidence. The phone UI alone would be a local demo.

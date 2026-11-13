---
tags:
  - build
  - testnet
status: active
date: 2026-11-12
---

# Testnet

Ethereum Sepolia, chain id `11155111`. Balances last checked on chain at 22:16 SAST, Thu 12 Nov 2026. Balances move; re-check on chain before a demo.

Do not open, print, or log `.env` or `.env.treasury`. Those files are gitignored and mode 600. Never read `.env.treasury`.

## Token, treasury, FX

- Token used in the local `.env`: Pimlico USD₮ at [`0xd077A400968890Eacc75cdc901F0356c943e4fDb`](https://sepolia.etherscan.io/address/0xd077A400968890Eacc75cdc901F0356c943e4fDb) (6 decimals).
- `.env.example` still defaults to Tether's wdk-examples Test Tether USD at `0x7169D38820dfd117C3FA1f22a697dBA58d90BA06`.
- Platform treasury: [`0xDB071a2410FCB0B4e0b498953139CF18E009388b`](https://sepolia.etherscan.io/address/0xDB071a2410FCB0B4e0b498953139CF18E009388b)
- FX snapshot: `ZAR_PER_USDT=16.5639` (Frankfurter, 11 Nov 2026). 1 USDT is treated as 1 USD.
- RPC: publicnode Sepolia, as in `.env.example`.

## Wallets

- Shop (this machine's test wallet): [`0x55306B77Fb0A34f1253F3c78Ac734a9dBC5FFfab`](https://sepolia.etherscan.io/address/0x55306B77Fb0A34f1253F3c78Ac734a9dBC5FFfab)
  - **0.029999999983828525 Sepolia ETH** and **798.792554 USD₮** after the 22:16 SAST treasury fund (was about 0.05 ETH and 998.79 USD₮ after the faucets and the R20 top-up).
- Treasury: [`0xDB071a2410FCB0B4e0b498953139CF18E009388b`](https://sepolia.etherscan.io/address/0xDB071a2410FCB0B4e0b498953139CF18E009388b)
  - **0.02 Sepolia ETH** and **201.207446 USD₮** after the same fund (had 0 ETH and 1.207446 USD₮ from the R20 top-up, R20 ÷ 16.5639).

## Transactions

- Google faucet ETH to the shop: [`0xd63e629d7bf1aa5733f4bf9fbf9d90ef918eef6a23fbfd24802e5cad92530c53`](https://sepolia.etherscan.io/tx/0xd63e629d7bf1aa5733f4bf9fbf9d90ef918eef6a23fbfd24802e5cad92530c53)
- Pimlico USD₮ to the shop: [`0xaf9e3e145cf4948539fbadec15c2d9a14a32a8e5e878b0ad91be28f04ea8259f`](https://sepolia.etherscan.io/tx/0xaf9e3e145cf4948539fbadec15c2d9a14a32a8e5e878b0ad91be28f04ea8259f)
- Live R20 top-up, shop → treasury, confirmed in block **12118349**: [`0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918`](https://sepolia.etherscan.io/tx/0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918)
- Treasury gas fund, shop → treasury, 0.02 ETH, confirmed in block **12121155** at 22:16 SAST: [`0xd06514d9944eae05e2583099f27957394ceb802efb8ec8584d8c2b13f31801bd`](https://sepolia.etherscan.io/tx/0xd06514d9944eae05e2583099f27957394ceb802efb8ec8584d8c2b13f31801bd)
- Treasury USD₮ fund, shop → treasury, 200 USD₮, confirmed in block **12121156** at 22:16 SAST: [`0x8e60bd1716f6b7aee107fac8584218bacbd49f12025a0622ebcff124247c46f6`](https://sepolia.etherscan.io/tx/0x8e60bd1716f6b7aee107fac8584218bacbd49f12025a0622ebcff124247c46f6)

Re-check the top-up without sending again:

```bash
cd scripts
npm run wallet -- status --hash 0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918
```

A new `send` is a new payment. Use `--approve --wait` only when you mean to spend again.

The 22:16 SAST fund used `scripts/fund-treasury.ts` (quote first, then `--approve`). It loads the shop seed from `.env` and does not read `.env.treasury`.

- ClaimEscrow deployed on Sepolia at [0x59F1586F0A624CC8b13B7128420B0842aA1AB56d](https://sepolia.etherscan.io/address/0x59F1586F0A624CC8b13B7128420B0842aA1AB56d) in [0x1b40b91c40242e25ccae73aab458a93b91a670043b36ed80c4dfe26a2c728646](https://sepolia.etherscan.io/tx/0x1b40b91c40242e25ccae73aab458a93b91a670043b36ed80c4dfe26a2c728646).
- Demo claim #1 opened and reserved 12.074452 test USD₮ in [block 12124722](https://sepolia.etherscan.io/tx/0xdb7bc760e7223c93f5e36eb33703e0c6e37a21f3324343f91b8989f132951afb).
- Demo claim #1 released 12.074452 test USD₮ to the shop in [block 12124728](https://sepolia.etherscan.io/tx/0xbcd5da34f3b3b022601fa8c3996bea009c2ce34ca6f5ff140eac6ced7ee0f185). At the checkpoint FX snapshot this corresponds to R200. Rand delivery is simulated.

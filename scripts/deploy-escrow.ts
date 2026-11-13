import { ContractFactory, JsonRpcProvider } from 'ethers'
import { appendFileSync } from 'node:fs'
import { compileEscrow } from './compile-escrow.mjs'
import { openSession } from './wallet-session.ts'
import { formatUnits } from '../shared/money.ts'

const token = '0xd077A400968890Eacc75cdc901F0356c943e4fDb'
const shop = '0x55306B77Fb0A34f1253F3c78Ac734a9dBC5FFfab'

async function main() {
  const session = await openSession(token)
  const provider = new JsonRpcProvider(session.rpcUrl)
  try {
    if ((await session.account.getAddress()).toLowerCase() !== shop.toLowerCase()) {
      throw new Error('The configured signer must be the demo shop wallet.')
    }
    const artifact = compileEscrow()['ClaimEscrow.sol'].ClaimEscrow
    const { data } = await new ContractFactory(artifact.abi, '0x' + artifact.evm.bytecode.object).getDeployTransaction(token)
    const tx = { data, value: 0n }
    const fee = (await session.account.quoteSendTransaction(tx)).fee
    if (fee > await session.account.getBalance()) throw new Error('Insufficient Sepolia ETH.')
    console.log('Ethereum Sepolia · ClaimEscrow · maximum fee', formatUnits(fee, 18), 'ETH')
    if (!process.argv.includes('--approve') || process.argv.includes('--cancel')) return
    const { hash } = await session.account.sendTransaction(tx)
    console.log('Deployment submitted', hash)
    const receipt = await provider.waitForTransaction(hash, 1, 90000)
    const address = receipt?.contractAddress
    if (!address || receipt.status !== 1 || await provider.getCode(address) === '0x') {
      throw new Error('Deployment unconfirmed. Re-check the submitted hash before retrying.')
    }
    appendFileSync(new URL('../w3node_vault/03 Build/Testnet.md', import.meta.url),
      `\n- ClaimEscrow deployed on Sepolia at [${address}](https://sepolia.etherscan.io/address/${address}) in [${hash}](https://sepolia.etherscan.io/tx/${hash}).\n`)
    console.log('Escrow deployed', address)
  } finally {
    provider.destroy()
    session.wdk.dispose()
  }
}

main().catch(() => {
  console.error('Escrow deployment failed. Check the Sepolia RPC, signer, and any submitted hash before retrying.')
  process.exitCode = 1
})

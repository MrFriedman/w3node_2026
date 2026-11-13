import { readFileSync } from 'node:fs'
import solc from 'solc'

export function compileEscrow(includeTestToken = false) {
  const sources = {
    'ClaimEscrow.sol': { content: readFileSync(new URL('../contracts/ClaimEscrow.sol', import.meta.url), 'utf8') },
  }
  if (includeTestToken) {
    sources['MockToken.sol'] = { content: readFileSync(new URL('../contracts/test/MockToken.sol', import.meta.url), 'utf8') }
  }
  const output = JSON.parse(solc.compile(JSON.stringify({
    language: 'Solidity', sources,
    settings: { optimizer: { enabled: true, runs: 200 }, evmVersion: 'cancun', outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } } },
  })))
  const errors = output.errors?.filter(({ severity }) => severity === 'error')
  if (errors?.length) throw new Error(errors.map(({ formattedMessage }) => formattedMessage).join('\n'))
  return output.contracts
}

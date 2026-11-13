import type { InterfaceAbi } from 'ethers'
export function compileEscrow(includeTestToken?: boolean): Record<string, Record<string, {
  abi: InterfaceAbi
  evm: { bytecode: { object: string } }
}>>

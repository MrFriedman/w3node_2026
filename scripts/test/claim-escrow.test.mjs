import assert from 'node:assert/strict'
import { test } from 'node:test'
import { BrowserProvider, ContractFactory, id } from 'ethers'
import hardhat from 'hardhat'
import { compileEscrow } from '../compile-escrow.mjs'

const artifacts = compileEscrow(true)
const provider = new BrowserProvider(hardhat.network.provider, undefined, { cacheTimeout: -1 })
const pack = id('sample pack')
const wait = async (transaction) => (await transaction).wait()

async function fixture() {
  const owner = await provider.getSigner(0)
  const payee = await provider.getSigner(1)
  const platform = await provider.getSigner(2)
  const deploy = async (name, args = []) => {
    const artifact = artifacts[name + '.sol'][name]
    return (await new ContractFactory(artifact.abi, '0x' + artifact.evm.bytecode.object, owner).deploy(...args)).waitForDeployment()
  }
  const token = await deploy('MockToken')
  const escrow = await deploy('ClaimEscrow', [await token.getAddress()])
  await wait(escrow.setInsurer(owner.address))
  await wait(escrow.setPlatform(platform.address))
  await wait(token.approve(await escrow.getAddress(), 100))
  await wait(escrow.deposit(100))
  return { escrow, token, payee, platform }
}

test('reserves float, then pays the intended recipient and records Paid', async () => {
  const { escrow, token, payee, platform } = await fixture()
  await wait(escrow.connect(platform).openClaim(pack, payee.address, 70))
  assert.equal(await escrow.availableFloat(), 30n)
  assert.equal(await escrow.reservedFloat(), 70n)
  await wait(escrow.approveAndRelease(1))
  assert.equal((await escrow.claims(1)).state, 2n)
  assert.equal(await token.balanceOf(payee.address), 70n)
  assert.equal(await escrow.reservedFloat(), 0n)
  assert.equal(await token.balanceOf(await escrow.getAddress()), 30n)
})

test('rejects duplicate opens and repeat payouts', async () => {
  const { escrow, payee } = await fixture()
  await wait(escrow.openClaim(pack, payee.address, 20))
  await assert.rejects(escrow.openClaim(pack, payee.address, 20))
  await wait(escrow.approveAndRelease(1))
  await assert.rejects(escrow.approveAndRelease(1))
})

test('requires the correct caller', async () => {
  const { escrow, payee } = await fixture()
  const outsider = escrow.connect(payee)
  await assert.rejects(outsider.openClaim(pack, payee.address, 20))
  await wait(escrow.openClaim(pack, payee.address, 20))
  await assert.rejects(outsider.deposit(1))
  await assert.rejects(outsider.approveAndRelease(1))
  await assert.rejects(outsider.reject(1))
})

test('cannot overcommit float and rejection frees the reservation', async () => {
  const { escrow, payee, token } = await fixture()
  await wait(escrow.openClaim(pack, payee.address, 70))
  await assert.rejects(escrow.openClaim(id('second'), payee.address, 31))
  await wait(escrow.reject(1))
  assert.equal((await escrow.claims(1)).state, 3n)
  assert.equal(await escrow.availableFloat(), 100n)
  assert.equal(await token.balanceOf(payee.address), 0n)
  await assert.rejects(escrow.approveAndRelease(1))
})

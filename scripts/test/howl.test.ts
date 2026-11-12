import assert from 'node:assert/strict'
import { test } from 'node:test'
import { resolveApproval } from '../../shared/approval.ts'
import {
  ALERT_BUNDLES,
  bundleById,
  formatUnits,
  isEvmAddress,
  isTxHash,
  parseTokenAmount,
  usdtBaseUnitsForZar,
} from '../../shared/money.ts'
import { CHECKPOINT_ZAR_PER_USDT } from '../../shared/network.ts'

test('alert bundles match Howl shop prices', () => {
  assert.deepEqual(
    ALERT_BUNDLES.map((bundle) => [bundle.id, bundle.zar, bundle.tokens]),
    [
      ['r20', 20, 10],
      ['r40', 40, 20],
      ['r80', 80, 50],
      ['r150', 150, 100],
      ['r300', 300, 220],
    ],
  )
  assert.equal(bundleById('R80')?.tokens, 50)
  assert.equal(bundleById('nope'), undefined)
})

test('bundle USDT is rounded up from the checkpoint FX snapshot', () => {
  assert.equal(usdtBaseUnitsForZar(20, CHECKPOINT_ZAR_PER_USDT), 1_207_446n)
  assert.equal(usdtBaseUnitsForZar(300, CHECKPOINT_ZAR_PER_USDT), 18_111_677n)
  assert.equal(formatUnits(1_207_446n, 6), '1.207446')
})

test('token amounts reject extra precision and zero', () => {
  assert.equal(parseTokenAmount('1.5', 6), 1_500_000n)
  assert.throws(() => parseTokenAmount('1.0000001', 6), /decimal places/)
  assert.throws(() => parseTokenAmount('0', 6), /greater than zero/)
  assert.throws(() => usdtBaseUnitsForZar(20, '0'), /greater than zero|positive/)
})

test('address and hash checks reject blanks and the zero address', () => {
  assert.equal(isEvmAddress('0x70997970C51812dc3A010C7d01b50e0d17dc79C8'), true)
  assert.equal(isEvmAddress('0x0000000000000000000000000000000000000000'), false)
  assert.equal(isEvmAddress('0x1234'), false)
  assert.equal(isTxHash(`0x${'ab'.repeat(32)}`), true)
  assert.equal(isTxHash(`0x${'ab'.repeat(31)}`), false)
})

test('approval defaults to cancel unless the operator approves', () => {
  assert.equal(resolveApproval({ approve: false, cancel: false }), 'cancel')
  assert.equal(resolveApproval({ approve: true, cancel: false }), 'approve')
  assert.equal(resolveApproval({ approve: false, cancel: true }), 'cancel')
  assert.equal(resolveApproval({ approve: false, cancel: false, typed: 'approve' }), 'approve')
  assert.equal(resolveApproval({ approve: false, cancel: false, typed: 'no' }), 'cancel')
  assert.throws(() => resolveApproval({ approve: true, cancel: true }), /only one/)
})

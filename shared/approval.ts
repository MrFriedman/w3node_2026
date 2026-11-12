export type Approval = 'approve' | 'cancel'

/**
 * Tether step 3. A transfer is signed only after an explicit approve.
 * Omitting a choice cancels. Cancel is the non-interactive default.
 */
export function resolveApproval(input: {
  approve: boolean
  cancel: boolean
  typed?: string
}): Approval {
  if (input.approve && input.cancel) {
    throw new Error('Pass only one of --approve or --cancel.')
  }
  if (input.cancel) return 'cancel'
  if (input.approve) return 'approve'
  const typed = input.typed?.trim().toLowerCase()
  if (typed === undefined || typed === '' || typed === 'cancel' || typed === 'n' || typed === 'no') {
    return 'cancel'
  }
  if (typed === 'approve' || typed === 'y' || typed === 'yes') return 'approve'
  throw new Error('Type approve or cancel.')
}

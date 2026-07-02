import { describe, it, expect } from 'vitest'
import { subscriptionSplits, type SharedSubInput } from '../splitData'

function sub(overrides: Partial<SharedSubInput>): SharedSubInput {
  return {
    id: 'a',
    name: 'Netflix',
    cat: 'streaming',
    cost: 20,
    period: 'monthly',
    day: 15,
    renewM: undefined,
    shared: true,
    paused: false,
    cancelPending: false,
    ...overrides,
  }
}

describe('subscriptionSplits', () => {
  it('emits a 50/50 "you"-paid entry for a shared monthly sub in every month', () => {
    const jan = subscriptionSplits([sub({})], 2026, 0)
    const jul = subscriptionSplits([sub({})], 2026, 6)
    expect(jan).toHaveLength(1)
    expect(jul).toHaveLength(1)
    expect(jan[0]).toMatchObject({
      amount: 20,
      payer: 'you',
      splitYou: 50,
      splitThem: 50,
      source: 'subscription',
      cat: 'entertainment',
    })
  })

  it('gives each derived entry a stable, month-scoped id', () => {
    const [e] = subscriptionSplits([sub({ id: 'x' })], 2026, 3)
    expect(e.id).toBe('sub:x:2026-3')
    expect(e.date).toBe('2026-04-15')
  })

  it('excludes non-shared, paused, and cancel-pending subs', () => {
    expect(subscriptionSplits([sub({ shared: false })], 2026, 0)).toHaveLength(0)
    expect(subscriptionSplits([sub({ paused: true })], 2026, 0)).toHaveLength(0)
    expect(subscriptionSplits([sub({ cancelPending: true })], 2026, 0)).toHaveLength(0)
  })

  it('only emits an annual sub in its renewal month', () => {
    const annual = sub({ period: 'annual', cost: 120, renewM: 8 })
    expect(subscriptionSplits([annual], 2026, 8)).toHaveLength(1)
    expect(subscriptionSplits([annual], 2026, 7)).toHaveLength(0)
    expect(subscriptionSplits([annual], 2026, 0)).toHaveLength(0)
  })

  it('emits a semiannual sub in its renewal month and six months later', () => {
    const semi = sub({ period: 'semiannual', renewM: 2 })
    expect(subscriptionSplits([semi], 2026, 2)).toHaveLength(1)
    expect(subscriptionSplits([semi], 2026, 8)).toHaveLength(1)
    expect(subscriptionSplits([semi], 2026, 5)).toHaveLength(0)
  })

  it('emits a quarterly sub every three months from its anchor', () => {
    const q = sub({ period: 'quarterly', renewM: 1 })
    expect(subscriptionSplits([q], 2026, 1)).toHaveLength(1)
    expect(subscriptionSplits([q], 2026, 4)).toHaveLength(1)
    expect(subscriptionSplits([q], 2026, 10)).toHaveLength(1)
    expect(subscriptionSplits([q], 2026, 2)).toHaveLength(0)
  })

  it('clamps the charge day to the length of the month', () => {
    const [e] = subscriptionSplits([sub({ day: 31 })], 2026, 1) // Feb 2026
    expect(e.date).toBe('2026-02-28')
  })
})

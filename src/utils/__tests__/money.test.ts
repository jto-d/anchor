import { describe, it, expect } from 'vitest'
import { roundCents, sumCents } from '../money'

describe('roundCents', () => {
  it('leaves clean cent values untouched', () => {
    expect(roundCents(12.34)).toBe(12.34)
    expect(roundCents(0)).toBe(0)
    expect(roundCents(100)).toBe(100)
  })

  it('rounds sub-cent precision to two decimals', () => {
    expect(roundCents(12.346)).toBe(12.35)
    expect(roundCents(12.344)).toBe(12.34)
    expect(roundCents(0.1 + 0.2)).toBe(0.3) // float drift collapsed
  })

  it('handles negative amounts', () => {
    expect(roundCents(-1.234)).toBe(-1.23)
    expect(roundCents(-5.006)).toBe(-5.01)
  })
})

describe('sumCents', () => {
  it('sums a simple list of amounts', () => {
    expect(sumCents([{ amount: 1.1 }, { amount: 2.2 }, { amount: 3.3 }], (x) => x.amount)).toBe(6.6)
  })

  it('returns 0 for an empty list', () => {
    expect(sumCents([], (x: { amount: number }) => x.amount)).toBe(0)
  })

  it('avoids float drift that plain reduce() accumulates', () => {
    // 0.1 + 0.2 + ... repeated 10x is the classic float-drift case: plain reduce
    // lands on 3.0000000000000004, not 3.
    const rows = Array.from({ length: 10 }, () => ({ amount: 0.1 })).concat(
      Array.from({ length: 10 }, () => ({ amount: 0.2 }))
    )
    const plainReduceResult = rows.reduce((s, r) => s + r.amount, 0)
    expect(plainReduceResult).not.toBe(3)
    expect(sumCents(rows, (r) => r.amount)).toBe(3)
  })

  it('rounds each term to the nearest cent before summing', () => {
    expect(sumCents([{ amount: 1.006 }, { amount: 1.006 }], (x) => x.amount)).toBe(2.02)
  })

  it('supports a resolver over a derived (non-property) value', () => {
    const perks = [{ totalAmount: 10 }, { totalAmount: 25.5 }]
    expect(sumCents(perks, (p) => p.totalAmount * 2)).toBe(71)
  })
})

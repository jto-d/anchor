import { describe, it, expect } from 'vitest'
import { roundCents } from '../money'

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

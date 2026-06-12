import { describe, it, expect } from 'vitest'
import {
  annualValue,
  cycleWindow,
  capturedInCycle,
  capturedYTD,
  capturedThisMonth,
  perkPct,
  perkStatus,
} from '../perk'
import type { Perk } from '../types'

// Minimal shape satisfying the Perk type at runtime (all non-perkCredit fields are unused by these functions).
type TestPerk = {
  period: string
  resetType: string
  totalAmount: string
  perkCredits: Array<{ id: string; amount: string; date: string; description?: string | null; createdAt: string }>
}

const p = (fields: Partial<TestPerk> & Pick<TestPerk, 'period' | 'totalAmount'>): Perk =>
  ({ resetType: 'CALENDAR', perkCredits: [], ...fields } as unknown as Perk)

const credit = (date: string, amount: string) => ({
  id: 'c1',
  amount,
  date,
  description: null,
  createdAt: date,
})

// Fixed "now" for deterministic tests: 2026-06-12 (Q2, H1)
const NOW = new Date(2026, 5, 12) // June 12 2026

describe('annualValue', () => {
  it('annualizes monthly perk by 12', () => {
    expect(annualValue(p({ period: 'MONTHLY', totalAmount: '25' }))).toBe(300)
  })
  it('annualizes quarterly perk by 4', () => {
    expect(annualValue(p({ period: 'QUARTERLY', totalAmount: '100' }))).toBe(400)
  })
  it('annualizes semi-annual perk by 2', () => {
    expect(annualValue(p({ period: 'SEMI_ANNUAL', totalAmount: '150' }))).toBe(300)
  })
  it('annual perk is 1× its amount', () => {
    expect(annualValue(p({ period: 'ANNUAL', totalAmount: '300' }))).toBe(300)
  })
  it('annualizes quadrennial perk by 0.25', () => {
    expect(annualValue(p({ period: 'QUADRENNIAL', totalAmount: '400' }))).toBe(100)
  })
})

describe('cycleWindow — calendar reset', () => {
  it('MONTHLY: June 12 → Jun 1 – Jul 1', () => {
    const { start, end } = cycleWindow({ period: 'MONTHLY', resetType: 'CALENDAR' }, null, NOW)
    expect(start).toEqual(new Date(2026, 5, 1))
    expect(end).toEqual(new Date(2026, 6, 1))
  })

  it('MONTHLY: December wraps to Jan 1 next year', () => {
    const dec = new Date(2026, 11, 15)
    const { start, end } = cycleWindow({ period: 'MONTHLY', resetType: 'CALENDAR' }, null, dec)
    expect(start).toEqual(new Date(2026, 11, 1))
    expect(end).toEqual(new Date(2027, 0, 1))
  })

  it('QUARTERLY: June is in Q2 (Apr 1 – Jul 1)', () => {
    const { start, end } = cycleWindow({ period: 'QUARTERLY', resetType: 'CALENDAR' }, null, NOW)
    expect(start).toEqual(new Date(2026, 3, 1))
    expect(end).toEqual(new Date(2026, 6, 1))
  })

  it('QUARTERLY: December is in Q4 (Oct 1 – Jan 1)', () => {
    const dec = new Date(2026, 11, 1)
    const { start, end } = cycleWindow({ period: 'QUARTERLY', resetType: 'CALENDAR' }, null, dec)
    expect(start).toEqual(new Date(2026, 9, 1))
    expect(end).toEqual(new Date(2027, 0, 1))
  })

  it('SEMI_ANNUAL: June is in H1 (Jan 1 – Jul 1)', () => {
    const { start, end } = cycleWindow({ period: 'SEMI_ANNUAL', resetType: 'CALENDAR' }, null, NOW)
    expect(start).toEqual(new Date(2026, 0, 1))
    expect(end).toEqual(new Date(2026, 6, 1))
  })

  it('SEMI_ANNUAL: August is in H2 (Jul 1 – Jan 1)', () => {
    const aug = new Date(2026, 7, 1)
    const { start, end } = cycleWindow({ period: 'SEMI_ANNUAL', resetType: 'CALENDAR' }, null, aug)
    expect(start).toEqual(new Date(2026, 6, 1))
    expect(end).toEqual(new Date(2027, 0, 1))
  })

  it('ANNUAL: full calendar year', () => {
    const { start, end } = cycleWindow({ period: 'ANNUAL', resetType: 'CALENDAR' }, null, NOW)
    expect(start).toEqual(new Date(2026, 0, 1))
    expect(end).toEqual(new Date(2027, 0, 1))
  })

  it('QUADRENNIAL: 2026 is in the 2024–2028 cycle', () => {
    const { start, end } = cycleWindow({ period: 'QUADRENNIAL', resetType: 'CALENDAR' }, null, NOW)
    expect(start).toEqual(new Date(2024, 0, 1))
    expect(end).toEqual(new Date(2028, 0, 1))
  })

  it('QUADRENNIAL: 2028 starts the 2028–2032 cycle', () => {
    const y2028 = new Date(2028, 6, 1)
    const { start, end } = cycleWindow({ period: 'QUADRENNIAL', resetType: 'CALENDAR' }, null, y2028)
    expect(start).toEqual(new Date(2028, 0, 1))
    expect(end).toEqual(new Date(2032, 0, 1))
  })
})

describe('cycleWindow — anniversary reset', () => {
  const openedMar15 = '2022-03-15'

  it('ANNUAL: before anniversary is still on prior year cycle', () => {
    const feb = new Date(2026, 1, 1)
    const { start, end } = cycleWindow({ period: 'ANNUAL', resetType: 'ANNIVERSARY' }, openedMar15, feb)
    expect(start).toEqual(new Date(2025, 2, 15))
    expect(end).toEqual(new Date(2026, 2, 15))
  })

  it('ANNUAL: after anniversary starts new cycle', () => {
    const apr = new Date(2026, 3, 1)
    const { start, end } = cycleWindow({ period: 'ANNUAL', resetType: 'ANNIVERSARY' }, openedMar15, apr)
    expect(start).toEqual(new Date(2026, 2, 15))
    expect(end).toEqual(new Date(2027, 2, 15))
  })

  it('MONTHLY always uses calendar month regardless of resetType', () => {
    const { start, end } = cycleWindow({ period: 'MONTHLY', resetType: 'ANNIVERSARY' }, openedMar15, NOW)
    expect(start).toEqual(new Date(2026, 5, 1))
    expect(end).toEqual(new Date(2026, 6, 1))
  })
})

describe('capturedInCycle', () => {
  it('returns 0 with no credits', () => {
    expect(capturedInCycle(p({ period: 'ANNUAL', totalAmount: '300' }), null, NOW)).toBe(0)
  })

  it('sums credits within the current annual cycle', () => {
    const perk = p({
      period: 'ANNUAL',
      totalAmount: '300',
      perkCredits: [credit('2026-03-01', '100'), credit('2026-05-15', '75')],
    })
    expect(capturedInCycle(perk, null, NOW)).toBe(175)
  })

  it('excludes credits from a previous year', () => {
    const perk = p({
      period: 'ANNUAL',
      totalAmount: '300',
      perkCredits: [credit('2025-12-31', '50'), credit('2026-01-01', '100')],
    })
    expect(capturedInCycle(perk, null, NOW)).toBe(100)
  })

  it('sums credits within the current monthly cycle', () => {
    const perk = p({
      period: 'MONTHLY',
      totalAmount: '25',
      perkCredits: [credit('2026-06-05', '10'), credit('2026-06-10', '15'), credit('2026-05-30', '99')],
    })
    expect(capturedInCycle(perk, null, NOW)).toBe(25)
  })
})

describe('capturedYTD', () => {
  it('sums all credits in the current calendar year', () => {
    const perk = p({
      period: 'MONTHLY',
      totalAmount: '25',
      perkCredits: [
        credit('2026-01-10', '25'),
        credit('2026-03-15', '25'),
        credit('2025-12-31', '25'),
      ],
    })
    expect(capturedYTD(perk, NOW)).toBe(50)
  })
})

describe('capturedThisMonth', () => {
  it('sums only credits in the current month', () => {
    const perk = p({
      period: 'MONTHLY',
      totalAmount: '25',
      perkCredits: [credit('2026-06-01', '10'), credit('2026-05-31', '15')],
    })
    expect(capturedThisMonth(perk, NOW)).toBe(10)
  })
})

describe('perkPct', () => {
  it('returns 0 with no credits', () => {
    expect(perkPct(p({ period: 'ANNUAL', totalAmount: '100' }), null, NOW)).toBe(0)
  })

  it('returns 0.5 at half captured', () => {
    const perk = p({
      period: 'ANNUAL',
      totalAmount: '100',
      perkCredits: [credit('2026-03-01', '50')],
    })
    expect(perkPct(perk, null, NOW)).toBe(0.5)
  })

  it('caps at 1 when over-captured', () => {
    const perk = p({
      period: 'ANNUAL',
      totalAmount: '100',
      perkCredits: [credit('2026-03-01', '200')],
    })
    expect(perkPct(perk, null, NOW)).toBe(1)
  })

  it('returns 0 when totalAmount is 0', () => {
    expect(perkPct(p({ period: 'ANNUAL', totalAmount: '0' }), null, NOW)).toBe(0)
  })
})

describe('perkStatus', () => {
  it('returns captured when fully used', () => {
    const perk = p({
      period: 'ANNUAL',
      totalAmount: '100',
      perkCredits: [credit('2026-03-01', '100')],
    })
    expect(perkStatus(perk, null, NOW).key).toBe('captured')
  })

  it('returns open when nothing captured', () => {
    expect(perkStatus(p({ period: 'ANNUAL', totalAmount: '100' }), null, NOW).key).toBe('open')
  })

  it('returns partial when partially captured', () => {
    const perk = p({
      period: 'ANNUAL',
      totalAmount: '100',
      perkCredits: [credit('2026-01-01', '50')],
    })
    expect(perkStatus(perk, null, NOW).key).toBe('partial')
  })

  it('returns expiring for MONTHLY perk with no credits this month', () => {
    const perk = p({
      period: 'MONTHLY',
      totalAmount: '25',
      perkCredits: [credit('2026-05-15', '25')],
    })
    expect(perkStatus(perk, null, NOW).key).toBe('expiring')
  })

  it('returns partial for MONTHLY perk with some credits this month', () => {
    const perk = p({
      period: 'MONTHLY',
      totalAmount: '25',
      perkCredits: [credit('2026-06-01', '10')],
    })
    expect(perkStatus(perk, null, NOW).key).toBe('partial')
  })
})

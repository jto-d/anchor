import { PERIOD_META } from './constants'
import { toAmount } from './format'
import type { Perk, StatusKey } from './types'

export type CycleWindow = { start: Date; end: Date }

export function annualValue(perk: Perk): number {
  const meta = PERIOD_META[perk.period as keyof typeof PERIOD_META]
  return toAmount(perk.totalAmount) * (meta?.per ?? 1)
}

// ── Cycle window helpers ──────────────────────────────────────────────────────

function dateOnly(year: number, month: number /* 1-12 */, day: number): Date {
  return new Date(year, month - 1, day)
}

function calendarCycleWindow(period: string, now: Date): CycleWindow {
  const y = now.getFullYear()
  const m = now.getMonth() + 1 // 1-12

  switch (period) {
    case 'MONTHLY': {
      const start = dateOnly(y, m, 1)
      const end = m === 12 ? dateOnly(y + 1, 1, 1) : dateOnly(y, m + 1, 1)
      return { start, end }
    }
    case 'QUARTERLY': {
      const qStart = m <= 3 ? 1 : m <= 6 ? 4 : m <= 9 ? 7 : 10
      const end = qStart + 3 > 12 ? dateOnly(y + 1, 1, 1) : dateOnly(y, qStart + 3, 1)
      return { start: dateOnly(y, qStart, 1), end }
    }
    case 'SEMI_ANNUAL': {
      const start = m < 7 ? dateOnly(y, 1, 1) : dateOnly(y, 7, 1)
      const end   = m < 7 ? dateOnly(y, 7, 1) : dateOnly(y + 1, 1, 1)
      return { start, end }
    }
    case 'QUADRENNIAL': {
      // 4-year cycles anchored at 2024
      const EPOCH = 2024
      const cycleYear = EPOCH + Math.floor((y - EPOCH) / 4) * 4
      return { start: dateOnly(cycleYear, 1, 1), end: dateOnly(cycleYear + 4, 1, 1) }
    }
    default: // ANNUAL
      return { start: dateOnly(y, 1, 1), end: dateOnly(y + 1, 1, 1) }
  }
}

function anniversaryCycleWindow(period: string, openedDateStr: string, now: Date): CycleWindow {
  const opened = new Date(openedDateStr + 'T00:00:00')
  const annMonth = opened.getMonth() + 1 // 1-12
  const annDay   = opened.getDate()
  const openedYear = opened.getFullYear()
  const y = now.getFullYear()
  const m = now.getMonth() + 1

  if (period === 'MONTHLY') return calendarCycleWindow('MONTHLY', now)

  if (period === 'ANNUAL') {
    const thisAnn = dateOnly(y, annMonth, annDay)
    if (now >= thisAnn) return { start: thisAnn, end: dateOnly(y + 1, annMonth, annDay) }
    return { start: dateOnly(y - 1, annMonth, annDay), end: thisAnn }
  }

  if (period === 'QUARTERLY') {
    // 3-month cycles anchored at anniversary month
    const mOffset = (m - annMonth + 12) % 12
    const qNum = Math.floor(mOffset / 3)
    let cycleStartMonth = ((annMonth - 1 + qNum * 3) % 12) + 1
    let cycleStartYear  = cycleStartMonth > m ? y - 1 : y
    const start = dateOnly(cycleStartYear, cycleStartMonth, 1)
    const nextM = cycleStartMonth + 3
    const end   = nextM > 12
      ? dateOnly(cycleStartYear + 1, nextM - 12, 1)
      : dateOnly(cycleStartYear, nextM, 1)
    return { start, end }
  }

  if (period === 'SEMI_ANNUAL') {
    // 6-month cycles anchored at anniversary month
    const mOffset = (m - annMonth + 12) % 12
    const halfNum = Math.floor(mOffset / 6)
    let cycleStartMonth = ((annMonth - 1 + halfNum * 6) % 12) + 1
    let cycleStartYear  = cycleStartMonth > m ? y - 1 : y
    const start = dateOnly(cycleStartYear, cycleStartMonth, 1)
    const nextM = cycleStartMonth + 6
    const end   = nextM > 12
      ? dateOnly(cycleStartYear + 1, nextM - 12, 1)
      : dateOnly(cycleStartYear, nextM, 1)
    return { start, end }
  }

  if (period === 'QUADRENNIAL') {
    // 4-year cycles from the card open date
    const yearsOpen  = y - openedYear
    const cycleNum   = Math.floor(yearsOpen / 4)
    const cycleStart = dateOnly(openedYear + cycleNum * 4, annMonth, annDay)
    if (now >= cycleStart) return { start: cycleStart, end: dateOnly(openedYear + (cycleNum + 1) * 4, annMonth, annDay) }
    const prev = dateOnly(openedYear + (cycleNum - 1) * 4, annMonth, annDay)
    return { start: prev, end: cycleStart }
  }

  return calendarCycleWindow(period, now)
}

export function cycleWindow(
  perk: { period: string; resetType: string },
  cardOpenedDate?: string | null,
  now = new Date()
): CycleWindow {
  if (perk.resetType === 'ANNIVERSARY' && cardOpenedDate) {
    return anniversaryCycleWindow(perk.period, cardOpenedDate, now)
  }
  return calendarCycleWindow(perk.period, now)
}

export function nextResetDate(
  perk: { period: string; resetType: string },
  cardOpenedDate?: string | null,
  now = new Date()
): Date {
  return cycleWindow(perk, cardOpenedDate, now).end
}

// ── Credit aggregation ────────────────────────────────────────────────────────

export function capturedInCycle(perk: Perk, cardOpenedDate?: string | null, now = new Date()): number {
  const { start, end } = cycleWindow(perk, cardOpenedDate, now)
  return perk.perkCredits
    .filter((c) => {
      const d = new Date(c.date + 'T00:00:00')
      return d >= start && d < end
    })
    .reduce((s, c) => s + toAmount(c.amount), 0)
}

// Sum of credits in the current calendar year — used for the monthly perk annual-rollup bar.
export function capturedYTD(perk: Perk, now = new Date()): number {
  const y = now.getFullYear()
  return perk.perkCredits
    .filter((c) => new Date(c.date + 'T00:00:00').getFullYear() === y)
    .reduce((s, c) => s + toAmount(c.amount), 0)
}

export function capturedThisMonth(perk: Perk, now = new Date()): number {
  const y = now.getFullYear()
  const m = now.getMonth()
  return perk.perkCredits
    .filter((c) => {
      const d = new Date(c.date + 'T00:00:00')
      return d.getFullYear() === y && d.getMonth() === m
    })
    .reduce((s, c) => s + toAmount(c.amount), 0)
}

// ── Derived status ────────────────────────────────────────────────────────────

export function perkPct(perk: Perk, cardOpenedDate?: string | null, now = new Date()): number {
  const perPeriod = toAmount(perk.totalAmount)
  if (perPeriod === 0) return 0
  return Math.min(1, capturedInCycle(perk, cardOpenedDate, now) / perPeriod)
}

export function perkStatus(
  perk: Perk,
  cardOpenedDate?: string | null,
  now = new Date()
): { key: StatusKey; label: string } {
  const pct = perkPct(perk, cardOpenedDate, now)
  if (pct >= 1) return { key: 'captured', label: 'Captured' }
  if (perk.period === 'MONTHLY' && capturedThisMonth(perk, now) === 0) return { key: 'expiring', label: 'Resets soon' }
  if (pct === 0) return { key: 'open', label: 'Available' }
  return { key: 'partial', label: 'In progress' }
}

export function periodLabel(period: string): string {
  return PERIOD_META[period as keyof typeof PERIOD_META]?.label ?? period
}

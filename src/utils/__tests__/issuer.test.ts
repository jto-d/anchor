import { describe, it, expect } from 'vitest'
import { issuerShort } from '../issuer'

describe('issuerShort', () => {
  it('maps American Express to Amex regardless of case', () => {
    expect(issuerShort('American Express')).toBe('Amex')
    expect(issuerShort('AMERICAN EXPRESS')).toBe('Amex')
  })

  it('maps Bank of America to BofA', () => {
    expect(issuerShort('Bank of America')).toBe('BofA')
  })

  it('falls back to the first word for other issuers', () => {
    expect(issuerShort('Chase')).toBe('Chase')
    expect(issuerShort('Capital One')).toBe('Capital')
    expect(issuerShort('Wells Fargo')).toBe('Wells')
  })
})

/** Issuer name → short label (e.g. for compact card chips). */
export function issuerShort(issuer: string): string {
  const lower = issuer.toLowerCase()
  if (lower.includes('american express')) return 'Amex'
  if (lower.includes('bank of america')) return 'BofA'
  return issuer.split(' ')[0]
}

import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/lib/urql'

export const metadata: Metadata = {
  title: 'Anchor',
  description: 'Personal finance — credit card perk tracking',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

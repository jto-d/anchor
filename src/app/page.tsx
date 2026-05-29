import { AccountsList } from './accounts-list'

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Ledger</h1>
      <AccountsList />
    </main>
  )
}

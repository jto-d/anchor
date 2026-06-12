import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { MeView } from './me-view'

export default async function Home() {
  const session = await auth()
  if (!session?.userId) {
    redirect('/login')
  }
  return <MeView />
}

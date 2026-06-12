import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'

declare module 'next-auth' {
  interface Session {
    userId?: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile?.email) {
        const user = await prisma.user.upsert({
          where: { email: profile.email },
          update: {},
          create: { email: profile.email },
          select: { id: true },
        })
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.userId = token.userId as string
      return session
    },
  },
})

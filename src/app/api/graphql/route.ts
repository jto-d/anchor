import { createYoga } from 'graphql-yoga'
import { schema } from '@/graphql/schema'
import { getToken } from 'next-auth/jwt'

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
  // Read the JWT straight off the incoming request. auth() relies on Next's
  // headers() async-context, which Yoga's request handling doesn't reliably
  // preserve — getToken({ req }) reads the session cookie directly instead.
  context: async ({ request }) => {
    // Yoga's request URL is the internal http:// container address; force secureCookie so getToken finds the __Secure-prefixed cookie Auth.js sets in production.
    const secureCookie = process.env.NODE_ENV === 'production'
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET, secureCookie })
    if (!token?.userId) throw new Error('Unauthorized')
    return { userId: token.userId as string }
  },
})

async function handler(request: Request): Promise<Response> {
  return yoga.handle(request, {})
}

export { handler as GET, handler as POST, handler as OPTIONS }

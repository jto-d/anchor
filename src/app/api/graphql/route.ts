import { createYoga } from 'graphql-yoga'
import { schema } from '@/graphql/schema'

// todo: replace this with actual auth
const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
  context: () => ({ userId: 'cmq1jgc5k0000e1syg2x09643' }),
})

async function handler(request: Request): Promise<Response> {
  return yoga.handle(request, {})
}

export { handler as GET, handler as POST, handler as OPTIONS }

import { createYoga } from 'graphql-yoga'
import { schema } from '@/graphql/schema'

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
  context: () => ({ userId: 'cmpt6lg7p0000zjqo2zdnhywr' }),
})

async function handler(request: Request): Promise<Response> {
  return yoga.handle(request, {})
}

export { handler as GET, handler as POST, handler as OPTIONS }

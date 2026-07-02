import { graphql } from '@/gql'

export const SubscriptionsDocument = graphql(`
  query Subscriptions {
    subscriptions {
      id
      name
      cat
      icon
      cost
      period
      day
      renewM
      cardId
      plan
      paused
      cancelPending
      shared
    }
  }
`)

export const AddSubscriptionDocument = graphql(`
  mutation AddSubscription(
    $name: String!
    $cat: String!
    $icon: String!
    $cost: Float!
    $period: String!
    $day: Int!
    $renewM: Int
    $cardId: String!
    $plan: String
    $shared: Boolean
  ) {
    addSubscription(
      name: $name
      cat: $cat
      icon: $icon
      cost: $cost
      period: $period
      day: $day
      renewM: $renewM
      cardId: $cardId
      plan: $plan
      shared: $shared
    ) {
      id
      name
      cat
      icon
      cost
      period
      day
      renewM
      cardId
      plan
      paused
      shared
    }
  }
`)

export const RemoveSubscriptionDocument = graphql(`
  mutation RemoveSubscription($id: String!) {
    removeSubscription(id: $id)
  }
`)

export const UpdateSubscriptionDocument = graphql(`
  mutation UpdateSubscription($id: String!, $name: String, $cost: Float, $paused: Boolean, $cancelPending: Boolean, $shared: Boolean) {
    updateSubscription(id: $id, name: $name, cost: $cost, paused: $paused, cancelPending: $cancelPending, shared: $shared) {
      id
      name
      cost
      paused
      cancelPending
      shared
    }
  }
`)

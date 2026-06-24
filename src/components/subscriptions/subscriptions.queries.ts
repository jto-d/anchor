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
    }
  }
`)

export const AddSubscriptionDocument = graphql(`
  mutation AddSubscription(
    $name: String!
    $cat: String!
    $icon: String!
    $cost: String!
    $period: String!
    $day: Int!
    $renewM: Int
    $cardId: String!
    $plan: String
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
    }
  }
`)

export const RemoveSubscriptionDocument = graphql(`
  mutation RemoveSubscription($id: String!) {
    removeSubscription(id: $id)
  }
`)

export const UpdateSubscriptionDocument = graphql(`
  mutation UpdateSubscription($id: String!, $name: String, $cost: String, $paused: Boolean, $cancelPending: Boolean) {
    updateSubscription(id: $id, name: $name, cost: $cost, paused: $paused, cancelPending: $cancelPending) {
      id
      name
      cost
      paused
      cancelPending
    }
  }
`)

import { graphql } from '@/gql'

export const SplitDataDocument = graphql(`
  query SplitData {
    splitPartner {
      id
      name
    }
    splitExpenses {
      id
      year
      month
      date
      desc
      amount
      payer
      cat
      splitYou
      splitThem
      createdAt
    }
    splitSettlements {
      id
      year
      month
      date
      amount
      fromPayer
      createdAt
    }
    subscriptions {
      id
      name
      cat
      cost
      period
      day
      renewM
      paused
      cancelPending
      shared
    }
    subscriptionSplitExclusions {
      id
      subscriptionId
      year
      month
    }
  }
`)

export const ExcludeSubscriptionSplitDocument = graphql(`
  mutation ExcludeSubscriptionSplit($subscriptionId: String!, $year: Int!, $month: Int!) {
    excludeSubscriptionSplit(subscriptionId: $subscriptionId, year: $year, month: $month)
  }
`)

export const RestoreSubscriptionSplitDocument = graphql(`
  mutation RestoreSubscriptionSplit($subscriptionId: String!, $year: Int!, $month: Int!) {
    restoreSubscriptionSplit(subscriptionId: $subscriptionId, year: $year, month: $month)
  }
`)

export const SetSplitPartnerDocument = graphql(`
  mutation SetSplitPartner($name: String!) {
    setSplitPartner(name: $name) {
      id
      name
    }
  }
`)

export const AddSplitExpenseDocument = graphql(`
  mutation AddSplitExpense(
    $year: Int!
    $month: Int!
    $date: String
    $desc: String!
    $amount: Float!
    $payer: String!
    $cat: String!
    $splitYou: Int!
    $splitThem: Int!
  ) {
    addSplitExpense(
      year: $year
      month: $month
      date: $date
      desc: $desc
      amount: $amount
      payer: $payer
      cat: $cat
      splitYou: $splitYou
      splitThem: $splitThem
    ) {
      id
      year
      month
      date
      desc
      amount
      payer
      cat
      splitYou
      splitThem
      createdAt
    }
  }
`)

export const UpdateSplitExpenseDocument = graphql(`
  mutation UpdateSplitExpense(
    $id: String!
    $date: String
    $desc: String
    $amount: Float
    $payer: String
    $cat: String
    $splitYou: Int
    $splitThem: Int
  ) {
    updateSplitExpense(
      id: $id
      date: $date
      desc: $desc
      amount: $amount
      payer: $payer
      cat: $cat
      splitYou: $splitYou
      splitThem: $splitThem
    ) {
      id
      year
      month
      date
      desc
      amount
      payer
      cat
      splitYou
      splitThem
      createdAt
    }
  }
`)

export const RemoveSplitExpenseDocument = graphql(`
  mutation RemoveSplitExpense($id: String!) {
    removeSplitExpense(id: $id)
  }
`)

export const AddSplitSettlementDocument = graphql(`
  mutation AddSplitSettlement(
    $year: Int!
    $month: Int!
    $date: String
    $amount: Float!
    $fromPayer: String!
  ) {
    addSplitSettlement(
      year: $year
      month: $month
      date: $date
      amount: $amount
      fromPayer: $fromPayer
    ) {
      id
      year
      month
      date
      amount
      fromPayer
      createdAt
    }
  }
`)

export const RemoveSplitSettlementDocument = graphql(`
  mutation RemoveSplitSettlement($id: String!) {
    removeSplitSettlement(id: $id)
  }
`)

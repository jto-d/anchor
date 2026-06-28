import { graphql } from '@/gql'

export const ListAccountsDocument = graphql(`
  query ListAccounts {
    listAccounts {
      id
      nick
      inst
      type
      source
      balance
      isEmergencyFund
      balanceUpdatedAt
      createdAt
    }
  }
`)

export const CreatePlaidLinkTokenDocument = graphql(`
  mutation CreatePlaidLinkToken {
    createPlaidLinkToken
  }
`)

export const ExchangePlaidTokenDocument = graphql(`
  mutation ExchangePlaidToken($publicToken: String!, $institutionId: String!, $institutionName: String!) {
    exchangePlaidToken(publicToken: $publicToken, institutionId: $institutionId, institutionName: $institutionName) {
      id
      nick
      inst
      type
      source
      balance
      isEmergencyFund
      balanceUpdatedAt
      createdAt
    }
  }
`)

export const AddManualAccountDocument = graphql(`
  mutation AddManualAccount($type: String!, $nick: String!, $inst: String!, $balance: String!, $isEmergencyFund: Boolean) {
    addManualAccount(type: $type, nick: $nick, inst: $inst, balance: $balance, isEmergencyFund: $isEmergencyFund) {
      id
      nick
      inst
      type
      source
      balance
      isEmergencyFund
      balanceUpdatedAt
      createdAt
    }
  }
`)

export const UpdateAccountDocument = graphql(`
  mutation UpdateAccount($id: String!, $nick: String, $type: String, $isEmergencyFund: Boolean) {
    updateAccount(id: $id, nick: $nick, type: $type, isEmergencyFund: $isEmergencyFund) {
      id
      nick
      inst
      type
      source
      balance
      isEmergencyFund
      balanceUpdatedAt
      createdAt
    }
  }
`)

export const RemoveAccountDocument = graphql(`
  mutation RemoveAccount($id: String!) {
    removeAccount(id: $id)
  }
`)

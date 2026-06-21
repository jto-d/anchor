import { graphql } from '@/gql'

export const MeDocument = graphql(`
  query Me {
    me {
      id
      email
      creditCards {
        id
        name
        issuer
        lastFour
        openedDate
        design
        perks {
          id
          name
          totalAmount
          period
          resetType
          enrollmentRequired
          notes
          perkCredits {
            id
            amount
            date
            description
          }
        }
      }
    }
  }
`)

export const LogPerkCreditDocument = graphql(`
  mutation LogPerkCredit($perkId: String!, $amount: Float!, $date: String!, $description: String) {
    logPerkCredit(perkId: $perkId, amount: $amount, date: $date, description: $description) {
      id
      amount
      date
      description
    }
  }
`)

export const RemoveCardDocument = graphql(`
  mutation RemoveCard($cardId: String!) {
    removeCard(cardId: $cardId)
  }
`)

export const AddCardDocument = graphql(`
  mutation AddCard($catalogKey: String!, $lastFour: String, $openedDate: String) {
    addCard(catalogKey: $catalogKey, lastFour: $lastFour, openedDate: $openedDate) {
      id
      name
      issuer
      lastFour
      openedDate
      design
      perks {
        id
        name
        totalAmount
        period
        notes
        perkCredits {
          id
          amount
          date
          description
        }
      }
    }
  }
`)

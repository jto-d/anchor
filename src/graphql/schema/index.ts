import { builder } from './builder'
import './user'
import './account'
import './transaction'
import './query'

export const schema = builder.toSchema()

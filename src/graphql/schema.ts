import { builder } from './builder'

import './user/type'
import './user/queries'
import './creditCard/type'

export const schema = builder.toSchema()

import { builder } from './builder'

import './user/type'
import './user/queries'
import './creditCard/type'
import './creditCard/queries'
import './perk/type'
import './perk/queries'
import './perkCredit/type'

export const schema = builder.toSchema()

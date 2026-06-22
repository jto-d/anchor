import { builder } from './builder'

import './user/type'
import './user/queries'
import './creditCard/type'
import './creditCard/queries'
import './creditCard/mutations'
import './perk/type'
import './perk/queries'
import './perkCredit/type'
import './perkCredit/mutations'
import './budget/types'
import './budget/queries'
import './budget/mutations'
import './surplus/mutations'

export const schema = builder.toSchema()

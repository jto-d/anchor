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

export const schema = builder.toSchema()

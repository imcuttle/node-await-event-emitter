/**
 * @file helper
 */

import * as nps from 'path'

function fixture(...argv: string[]) {
  return nps.join.apply(nps, [__dirname, 'fixture'].concat(argv))
}

export { fixture }

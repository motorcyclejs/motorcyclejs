import cuid = require('cuid')

import { Uid } from '../model'

export const createUid: () => Uid = cuid

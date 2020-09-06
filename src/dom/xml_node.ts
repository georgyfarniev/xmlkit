/**
 * This is base code for different XML elements. Note that this library doesn't
 * have representation of xml attribute and xml test, as it is stored with
 * element node for convenience.
 */

import { XmlNodeType } from '../common'

export interface XmlNode {
  toString(indent: number): string
  type: XmlNodeType
}

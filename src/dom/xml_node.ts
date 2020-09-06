/**
 * This is base code for different XML elements. Note that this library doesn't
 * have representation of xml attribute and xml test, as it is stored with
 * element node for convenience.
 */

import { XmlNodeType } from '../common'
import { XmlElement } from './xml_element'

export class XmlNode {
  toString(indent?: number): string {
    return 'not implemented'
  }

  type: XmlNodeType = null
  public parent: XmlElement = null;
}
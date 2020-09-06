import { XmlNode } from './xml_node'
import { XmlSerializer, XmlNodeType } from '../common'

export class XmlComment extends XmlNode {
  public readonly type = XmlNodeType.Comment

  constructor(public comment: string) {
    super()
  }

  public toString(indent = 0) {
    return XmlSerializer.comment(this.comment, { indent })
  }
}

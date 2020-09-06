import { XmlNode } from './xml_node'
import { XmlSerializer, XmlNodeType } from '../common'

export class XmlComment implements XmlNode {
  public readonly type = XmlNodeType.Comment

  constructor(public comment: string) {}

  public toString(indent = 0) {
    return XmlSerializer.comment(this.comment, { indent })
  }
}

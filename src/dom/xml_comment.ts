import { XmlNode, XmlNodeType } from './xml_node'

export class XmlComment implements XmlNode {
  public readonly type = XmlNodeType.Comment

  constructor(public comment: string) {}

  public toString(indent = 0) {
    const pad = ' '.repeat(indent)
    return `${pad}<!-- ${this.comment} -->\n`
  }
}

import { XmlNode, XmlNodeType } from './xml_node'
import { XmlSerializer } from '../common'

export class XmlCDATA implements XmlNode {
  public readonly type = XmlNodeType.CDATA

  constructor(public data: string) {}

  public toString() {
    return XmlSerializer.CDATA(this.data)
  }
}

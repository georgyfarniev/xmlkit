import { XmlNode } from './xml_node'
import { XmlSerializer, XmlNodeType } from '../common'

export class XmlCDATA implements XmlNode {
  public readonly type = XmlNodeType.CDATA

  constructor(public data: string) {}

  public toString() {
    return XmlSerializer.CDATA(this.data)
  }
}

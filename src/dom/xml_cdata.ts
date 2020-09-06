import { XmlNode } from './xml_node'
import { XmlSerializer, XmlNodeType } from '../common'

export class XmlCDATA extends XmlNode {
  public readonly type = XmlNodeType.CDATA

  constructor(public data: string) {
    super()
  }

  public toString() {
    return XmlSerializer.CDATA(this.data)
  }
}

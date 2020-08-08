import { XmlNode, XmlNodeType } from './xml_node'

export class XmlCDATA implements XmlNode {
  public readonly type = XmlNodeType.CDATA;

  constructor(public data: string) { }

  public toString(indent = 0) {
    const pad = ' '.repeat(indent);
    return `${pad}<![CDATA[${this.data}]]>\n`;
  }
}

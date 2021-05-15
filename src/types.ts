
export enum XmlTokenType {
  ElementOpen = 'element_open',
  ElementClose = 'element_close',
  Text = 'text',
  Comment = 'comment',
  PI = 'pi',
  CDATA = 'cdata'
}

export interface Attrs {
  [k: string]: string
}

export interface IXmlNode {
  type: XmlTokenType
}

export interface IXmlOpenTag extends IXmlNode {
  name: string
  attrs: Attrs
  selfClosing: boolean
}

export interface IXmlCloseTag  extends IXmlNode {
  name: string
}

export interface IXmlText  extends IXmlNode {
  text: string
}

export interface IXmlCData  extends IXmlNode {
  text: string
}

export interface IXmlComment  extends IXmlNode {
  text: string
}

export type XmlToken = IXmlOpenTag | IXmlCloseTag | IXmlText | IXmlCData | IXmlComment

export interface BaseParser {
  getTokens(string): XmlToken[]
}

export enum XmlNodeType {
  Element = 'element',
  Comment = 'comment',
  PI = 'pi',
  CDATA = 'cdata'
}

export interface Attrs {
  [k: string]: string
}

export interface XmlElementOptions {
  attrs?: Attrs
  text?: string
  cdata?: boolean
  selfClosing?: boolean
}

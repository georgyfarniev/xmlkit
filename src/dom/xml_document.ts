import { Stack, XmlSerializer } from '../common'
import { XmlElement } from './xml_element'
import { XmlComment } from "./xml_comment"
import { XmlSax } from '../xml_sax'

export class XmlDocument {
  private readonly stack = new Stack<XmlElement>()
  public root?: XmlElement

  constructor(
    public version: string = '1.0',
    public encoding: string = 'UTF-8'
  ) {}

  public static createFromString(xml: string) {
    const doc = new XmlDocument()
    doc.parse(xml)
    return doc
  }

  private parse(xml: string) {
    const sax = new XmlSax()

    sax.on('opentag', this.beginElement)
    sax.on('closetag', this.endElement)
    sax.on('text', this.onText)
    sax.on('comment', this.onComment)
    sax.on('cdata', this.onCDATA)

    sax.feed(xml)

    this.stack.clear()
  }

  public toString(): string {
    const header = XmlSerializer.header(this.version, this.encoding)
    return `${header}\n${this?.root?.toString() ?? ''}`
  }

  //#region handlers
  private beginElement = (tag: any) => {
    const elt = new XmlElement(tag.name, {
      attrs: tag.attrs,
      text: undefined,
      selfClosing: tag.isSelfClosing
    })

    if (!this.root) {
      this.root = elt
    } else {
      this.stack.top.appendChild(elt)
    }

    this.stack.push(elt)
  }

  private endElement = () => {
    this.stack.pop()
  }

  private onText = (text: string) => {
    // Do not add text if cdata inside
    if (!this.stack.empty && !this.stack.top.cdata) {
      this.stack.top.text = text
    }
  }

  private onComment = (text: string) => {
    if (!this.stack.empty) {
      this.stack.top.appendChild(new XmlComment(text))
    }
  }

  private onCDATA = (cdata: string) => {
    if (!this.stack.empty) {
      this.stack.top.text = cdata
      this.stack.top.cdata = true
    }
  }
  //#endregion
}

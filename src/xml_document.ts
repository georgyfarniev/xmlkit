import sax from 'sax'
import { XmlElement } from './xml_element'
import { Stack } from './util'
import { XmlComment } from "./xml_comment"

export class XmlDocument {
  private readonly stack = new Stack<XmlElement>()
  public root?: XmlElement

  constructor(xml?: string) {
    if (xml) this.parse(xml)
  }

  private parse(xml: string) {
    const parser = sax.parser(true)

    parser.onopentag = this.beginElement;
    parser.onclosetag = this.endElement;
    parser.ontext = this.onText;
    parser.oncomment = this.onComment;
    parser.oncdata = this.onCDATA;

    parser.write(xml);

    this.stack.clear();
  }

  public toString(): string {
    const v = '<?xml version="1.0" encoding="UTF-8"?>'
    return v + '\n' + this.root.toString()
  }

  //#region handlers
  private beginElement = (tag: any) => {
    const elt = new XmlElement(tag.name, {
      attrs: tag.attributes,
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

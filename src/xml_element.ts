import { XmlNode, XmlNodeType } from './xml_node'
import { StringBuilder, Stack } from './util'

interface Attrs {
  [k: string]: string
}

export interface XmlElementOptions {
  attrs?: Attrs
  text?: string
  cdata?: boolean
  selfClosing?: boolean
}

export class XmlElement implements XmlNode {
  public readonly type = XmlNodeType.Element
  private children = new Array<XmlNode>();

  constructor(public name: string, private opts?: XmlElementOptions) { }

  //#region data
  public get attrs() {
    return this.opts?.attrs || {}
  }

  public get text() {
    return this.opts?.text || ''
  }

  public set text(text: string) {
    this.opts.text = text
  }

  public get cdata() {
    return this.opts?.cdata ?? false
  }

  public set cdata(cdata: boolean) {
    this.opts.cdata = cdata
  }

  public get selfClosing() {
    return this.opts?.selfClosing ?? false
  }
  //#endregion

  public query(path: string): XmlElement {
    const stack = new Stack<string>()

    const rfind = (elt: XmlElement): any => {
      stack.push(elt.name)

      if (stack.toArray().join('.') === path) {
        return elt
      }

      for (const child of elt) {
        const ret = rfind(child)

        if (ret) {
          return ret
        }
      }

      stack.pop()
    }

    for (const child of this) {
      const ret = rfind(child)
      if (ret) {
        return ret
      }
    }
  }

  public get childrenLength() {
    return this.children.length
  }

  public appendChild(child: XmlNode) {
    this.children.push(child)
    return this
  }

  //#region serialization
  private attributesToString(elt: XmlElement): string {
    if (!elt.attrs || Object.keys(elt.attrs).length < 1) {
      return ''
    }

    const sb = new StringBuilder()

    if (Object.keys(elt.attrs).length > 0) {
      sb.append(' ')
    }

    for (const [k, v] of Object.entries(elt.attrs)) {
      sb.append(`${k}="${v}" `)
    }

    return sb.toString().trimRight()
  }

  private elementToString(elt: XmlElement, indent = 0) {
    const pad = ' '.repeat(indent)

    const attrs = this.attributesToString(elt)
    const text = elt.text ? elt.text.trim() : ''

    const inputText = (elt.cdata  && text.length > 0)
      ? `<![CDATA[${text}]]>`
      : text

    if (elt.selfClosing) {
      return `${pad}<${elt.name}${attrs} />\n`
    }

    let buf = `${pad}<${elt.name}${attrs}>${inputText}`

    if (elt.childrenLength > 0) {
      buf += '\n'
    }

    for (const child of elt) {
      const depth = indent + 2
      if (child.type === XmlNodeType.Element) {
        buf += this.elementToString(child, depth)
      } else {
        buf += child.toString(depth)
      }
    }

    if (elt.childrenLength > 0) {
      buf += pad
    }

    buf += `</${elt.name}>\n`

    return buf
  }

  public toString(indent = 0) {
    return this.elementToString(this, indent)
  }

  //#endregion

  //#region iteration
  public createIterator(types?: XmlNodeType[]) {
    let index = 0

    return {
      next: () => {
        const skip = (elt: XmlNode) => {
          return index < this.children.length &&
            types &&
            types.length > 0 &&
            !types.includes(elt.type)
        }

        while (skip(this.children[index])) {
          index++
        }

        if (index >= this.children.length) {
          return { value: undefined, done: true }
        }

        return { value: this.children[index++], done: false }
      }
    }
  }

  public get childNodes() {
    return {
      [Symbol.iterator]: () => this.createIterator([XmlNodeType.Element]) as any
    }
  }

  public [Symbol.iterator](): Iterator<XmlElement> {
    return this.createIterator([ XmlNodeType.Element ]) as any
  }
  //#endregion
}

import { XmlSax } from './xml_sax'
import { XmlElement } from './xml_element'
import { Stack } from './util'
import { Transform } from 'stream'

export class XmlStream extends Transform {
  public chunk?: XmlElement
  private buf: any[] = []
  private readonly sax:  XmlSax;
  private readonly stack = new Stack<XmlElement>()

  constructor(private readonly query: string) {
    super({ objectMode: true, highWaterMark: 1 })
    this.sax = new XmlSax()

    this.sax.on('opentag', this.onopentag);
    this.sax.on('closetag', this.onclosetag);
    this.sax.on('text', this.ontext);
    this.sax.on('cdata', this.oncdata);
  }

  public async _transform(chunk: any, _enc: any, cb: any) {
    for (const item of this.getNodes(chunk)) this.push(item)
    cb()
  }

  private get path(): string {
    return this.stack.empty
      ? ''
      : this.stack.toArray().map((e) => e.name).join('.')
  }

  private onopentag = ({ name, attrs, isSelfClosing }: any) => {
    const elt = new XmlElement(name, {
      attrs,
      text: undefined,
      selfClosing: isSelfClosing
    })
    const p = this.path + '.' + name

    if (p === this.query) {
      this.chunk = elt
    } else if (!this.stack.empty) {
      this.stack.top.appendChild(elt)
    }

    this.stack.push(elt)
  }

  private onclosetag = (name: string) => {
    if (
      this.path === this.query &&
      !this.stack.empty &&
      name === this.stack.top.name
    ) {
      this.buf.push(this.chunk)
    }

    this.stack.pop()
  }

  private ontext = (text: string) => {
    // Do not add text if cdata inside
    if (!this.stack.empty && !this.stack.top.cdata) {
      this.stack.top.text = text
    }
  }

  private oncdata = (cdata: string) => {
    if (!this.stack.empty) {
      this.stack.top.text = cdata
      this.stack.top.cdata = true
    }
  }

  public getNodes(data: string) {
    this.buf = []
    this.sax.feed(data)
    return this.buf
  }
}

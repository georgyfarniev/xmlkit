import { XmlSax } from './xml_sax'
import { XmlElement } from './dom'
import { Stack, XmlSerializer } from './common'
import { Transform } from 'stream'

let c  = 0;
let o = 0;


export class XmlStream extends Transform {
  public chunk?: string
  private buf: string[] = []

  private readonly sax:  XmlSax;
  private readonly stack = new Stack<XmlElement>()

  constructor(private readonly query: string) {
    super({ objectMode: true, highWaterMark: 1 })
    this.sax = new XmlSax()

    this.sax.on('opentag', this.beginElement)
    this.sax.on('closetag', this.endElement)
    this.sax.on('text', this.onText)
    this.sax.on('cdata', this.onCDATA)
  }

  public async _transform(chunk: any, _enc: any, cb: any) {
    for (const item of this.getNodes(chunk)) this.push(item)
    cb()
  }

  private get path(): string {
    return this.stack.empty
      ? ''
      : this.stack.toArray().join('.')
  }

  private beginElement = ({ name, attrs, isSelfClosing }: any) => {

    
    const p = this.path + '.' + name
    // console.log(p)

    // console.log('open: ', name);

    if (p === this.query) {
      console.log('inside searching path:', p, c++)
      this.chunk = XmlSerializer.elementStart(name, { attrs });
    } else if (!this.stack.empty) {
      this.chunk += XmlSerializer.elementStart(name, { attrs });
    }

    this.stack.push(name)
  }

  private endElement = (name: string) => {
    this.chunk += XmlSerializer.elementEnd(name);

    if (this.path === this.query) {
      this.buf.push(this.chunk)
    }

    this.stack.pop()
  }

  private onText = (text: string) => {
    this.chunk += text;
  }

  private onCDATA = (cdata: string) => {
    this.chunk += XmlSerializer.CDATA(cdata);
  }

  public getNodes(data: string) {
    this.buf = []
    this.sax.feed(data)
    return this.buf
  }
}

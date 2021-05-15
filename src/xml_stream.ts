import { XmlSax } from './xml_sax'
import { Stack } from './common'
import { Transform, TransformCallback } from 'stream'

export class XmlStream extends Transform {
  public chunk?: string = ''
  private buf: string[] = []

  private readonly sax:  XmlSax;
  private readonly stack = new Stack<string>()

  constructor(private readonly query: string) {
    super({ objectMode: true, highWaterMark: 1 })
    this.sax = new XmlSax()

    this.sax.on('opentag', this.beginElement)
    this.sax.on('closetag', this.endElement)
    this.sax.on('text', this.onText)
    this.sax.on('cdata', this.onCDATA)
    this.sax.on('comment', this.onComment)
  }

  public _transform(chunk: string, _: string, cb: TransformCallback): void {
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
    const attrss = Object.entries(attrs || [])
      .reduce((acc, [k, v]) => `${acc}${k}="${v}" `, ' ')
      .trimRight()

    const sc = isSelfClosing ? '/' : ''
    const s = `<${name}${attrss}${sc}>`

    if (p.startsWith(this.query)) this.chunk += s;

    this.stack.push(name)
  }

  private endElement = (name: string) => {
    this.chunk += `</${name}>`

    if (this.path === this.query) {
      this.buf.push(this.chunk)
      this.chunk = ''
    }

    this.stack.pop()
  }

  private onText = (text: string) => {
    this.chunk += text.trim();
  }

  private onCDATA = (text: string) => {
    this.chunk += `<![CDATA[${text}]]>`;
  }

  private onComment = (text: string) => {
    this.chunk += `<!-- ${text} -->`;
  }

  public getNodes(data: string): string[] {
    this.buf = []
    this.sax.feed(data)
    return this.buf
  }
}

import { XmlSax, XmlTokenType, XmlToken, IXmlOpenTag, IXmlCloseTag } from './xml_sax2'
import { Stack } from './common'
import { Transform, TransformCallback } from 'stream'

export class XmlStream extends Transform {
  private readonly sax: XmlSax;

  constructor(private readonly query: string) {
    super({ objectMode: true, highWaterMark: 1 })
    this.sax = new XmlSax()
  }

  public _transform(text: string, _: string, cb: TransformCallback): void {
    // for (const item of this.getNodes(chunk)) this.push(item)

    const tokens = this.sax.getTokens(text);
    const chunks = this.tokensToChunks(tokens, this.query);

    // console.dir(tokens)

    for (const chunk of chunks) {
      this.push(chunk)
    }

    cb()
  }

  private tokensToChunks(tokens: XmlToken[], query) {
    let chunk = '';
    const buf: string[] = [];
    const stack = new Stack<string>();

    for (const token of tokens) {
      const path = stack.toArray().join('.');

      switch (token.type) {
        case XmlTokenType.ElementOpen: {
          const { name, attrs, selfClosing } = token as IXmlOpenTag;

          const attrss = Object.entries(attrs || [])
            .reduce((acc, [k, v]) => `${acc}${k}="${v}" `, ' ')
            .trimRight()

          const sc = selfClosing ? '/' : ''
          const s = `<${name}${attrss}${sc}>`

          const p = path + '.' + name

          console.log(p)

          if (p.startsWith(query)) chunk += s;

          console.log('pushing', name)
          stack.push(name)

          break;
        }
        case XmlTokenType.ElementClose: {
          const { name } = token as IXmlCloseTag;

          chunk += `</${name}>`

          if (path === query) {
            buf.push(chunk)
            chunk = ''
          }

          console.log('closing at', path, stack.toArray())

          stack.pop()
          break;
        }
        // case XmlTokenType.Text:
        //   chunk += (token as any).text.trim()
        //   break;
        // case XmlTokenType.Comment:
        //   chunk +=  `<!-- ${(token as any).text.trim()} -->`;
        //   break;
        // case XmlTokenType.CDATA:
        //   chunk += `<![CDATA[${(token as any).text.trim()}]]>`;
        //   break;
      }
    }

    return buf;
  }
}

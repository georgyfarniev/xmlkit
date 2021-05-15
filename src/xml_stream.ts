import {
  XmlSax,
  XmlTokenType,
  XmlToken,
  IXmlOpenTag,
  IXmlCloseTag,
  IXmlCData,
  IXmlComment,
  IXmlText
} from './xml_sax2'
import { Stack } from './common'
import { Transform, TransformCallback } from 'stream'

export class XmlStream extends Transform {
  private readonly sax: XmlSax;
  private readonly stack = new Stack<string>();

  constructor(private readonly query: string) {
    super({ objectMode: true, highWaterMark: 1 })
    this.sax = new XmlSax()
  }

  public _transform(xml: string, _: string, cb: TransformCallback): void {
    const tokens = this.sax.getTokens(xml);
    const chunks = this.tokensToChunks(tokens, this.query);

    for (const chunk of chunks) this.push(chunk);
    cb();
  }

  private getOpenTagText(tag: IXmlOpenTag) {
    const attrs = Object.entries(tag.attrs || [])
      .reduce((acc, [k, v]) => `${acc}${k}="${v}" `, ' ')
      .trimRight();

    const sc = tag.selfClosing ? '/' : '';
    return `<${tag.name}${attrs}${sc}>`;
  }

  private tokensToChunks(tokens: XmlToken[], query) {
    let chunk = '';
    const buf: string[] = [];

    const getPath = () => this.stack.toArray().join('.');

    for (const token of tokens) {
      switch (token.type) {
        case XmlTokenType.ElementOpen: {
          const { name } = token as IXmlOpenTag;

          this.stack.push(name);

          const path = getPath()

          if (path.startsWith(query)) {
            chunk += this.getOpenTagText(token as IXmlOpenTag);
          }

          break;
        }
        case XmlTokenType.ElementClose: {
          const { name } = token as IXmlCloseTag;
          const path = getPath();

          chunk += `</${name}>`

          if (path === query) {
            buf.push(chunk)
            chunk = ''
          }

          this.stack.pop()
          break;
        }
        case XmlTokenType.Text: {
          const { text } = token as IXmlText;
          chunk += text.trim()
          break;
        }
        case XmlTokenType.Comment: {
          const { text } = token as IXmlComment;
          chunk +=  `<!-- ${text.trim()} -->`;
          break;
        }
        case XmlTokenType.CDATA: {
          const { text } = token as IXmlCData;
          chunk += `<![CDATA[${text}]]>`;
          break;
        }
      }
    }

    return buf;
  }
}

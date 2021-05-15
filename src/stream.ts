import { Transform, TransformCallback } from 'stream'
import { XmlSaxParser } from './parser';
import { Stack } from './stack'
import {
  XmlTokenType,
  XmlToken,
  IXmlOpenTag,
  IXmlCloseTag,
  IXmlCData,
  IXmlComment,
  IXmlText
} from './types'

export class XmlStream extends Transform {
  private chunk = '';
  private readonly sax: XmlSaxParser = new XmlSaxParser()
  private readonly stack = new Stack<string>();

  constructor(private readonly query: string) {
    super({ objectMode: true })
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

  private get path() {
    return this.stack.toArray().join('.');
  }

  private tokensToChunks(tokens: XmlToken[], query) {
    const buf: string[] = [];

    for (const token of tokens) {
      switch (token.type) {
        case XmlTokenType.ElementOpen: {
          const { name } = token as IXmlOpenTag;

          this.stack.push(name);

          const path = this.path

          if (path.startsWith(query)) {
            this.chunk += this.getOpenTagText(token as IXmlOpenTag);
          }

          break;
        }
        case XmlTokenType.ElementClose: {
          const { name } = token as IXmlCloseTag;
          const path = this.path;

          this.chunk += `</${name}>`

          if (path === query) {
            buf.push(this.chunk)
            this.chunk = ''
          }

          this.stack.pop()
          break;
        }
        case XmlTokenType.Text: {
          const { text } = token as IXmlText;
          this.chunk += text
          break;
        }
        case XmlTokenType.Comment: {
          const { text } = token as IXmlComment;
          this.chunk +=  `<!-- ${text} -->`;
          break;
        }
        case XmlTokenType.CDATA: {
          const { text } = token as IXmlCData;
          this.chunk += `<![CDATA[${text}]]>`;
          break;
        }
      }
    }

    return buf;
  }
}

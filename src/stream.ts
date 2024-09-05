import { Transform, TransformCallback } from 'stream'
import { XmlSaxParser } from './parser';
import { XmlSerializer } from './serializer';
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

const EXCLUDE_OUTER_NODE_TYPES = [
  XmlTokenType.Text,
  XmlTokenType.Comment,
  XmlTokenType.CDATA
];

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

  private get path() {
    return this.stack.toArray().join('.');
  }

  private get isInside() {
    return this.path.startsWith(this.query)
  }

  private tokensToChunks(tokens: XmlToken[], query) {
    const buf: string[] = [];
    let isSelfClosing: boolean = false;

    for (const token of tokens) {
      if (!this.isInside && EXCLUDE_OUTER_NODE_TYPES.includes(token.type)) {
        continue;
      }

      switch (token.type) {
        case XmlTokenType.ElementOpen: {
          const { name } = token as IXmlOpenTag;

          this.stack.push(name);

          if (this.isInside) {
            const { name, attrs, selfClosing } = token as IXmlOpenTag
            this.chunk += XmlSerializer.openTag(name, attrs, selfClosing);
            isSelfClosing = selfClosing;
          }

          break;
        }
        case XmlTokenType.ElementClose: {
          const { name } = token as IXmlCloseTag;
          const path = this.path;

          const flush = () => {
            if (path === query) {
              buf.push(this.chunk)
              this.chunk = ''
            }

            this.stack.pop()
          }

          if (isSelfClosing) {
            isSelfClosing = false;
            flush()
            break;
          }

          if (this.isInside) {
              this.chunk += XmlSerializer.closeTag(name);
            }

          flush()
          break;
        }
        case XmlTokenType.Text: {
          const { text } = token as IXmlText;
          this.chunk += XmlSerializer.text(text);
          break;
        }
        case XmlTokenType.Comment: {
          const { text } = token as IXmlComment;
          this.chunk +=  XmlSerializer.comment(text);
          break;
        }
        case XmlTokenType.CDATA: {
          const { text } = token as IXmlCData;
          this.chunk += XmlSerializer.CDATA(text);
          break;
        }
      }
    }

    return buf;
  }
}

import sax from 'sax'
import type { Tag } from 'sax';
import {
  IXmlCData,
  IXmlCloseTag,
  IXmlComment,
  IXmlOpenTag,
  IXmlText,
  XmlToken,
  XmlTokenType,
  BaseParser
} from './types';


// Abstraction class to hide sax module behind and allow easy replacement
export class XmlSaxParser implements BaseParser {
  private tokens: XmlToken[] = [];

  constructor(private parser = sax.parser(true)) {
    parser.onopentag = this.beginElement
    parser.onclosetag = this.endElement
    parser.ontext = this.onText
    parser.oncomment = this.onComment
    parser.oncdata = this.onCDATA
  }
 
  //#region  handlers
  private beginElement = (tag: Tag) => {
    const { name, attributes, isSelfClosing } = tag;
    const tok: IXmlOpenTag = {
      name, 
      attrs: attributes,
      selfClosing: isSelfClosing,
      type: XmlTokenType.ElementOpen
    };

    this.tokens.push(tok);
  }

  private endElement = (name: string) => {
    this.tokens.push({
      name,
      type: XmlTokenType.ElementClose
    } as IXmlCloseTag);
  }

  private onText = (text: string) => {
    this.tokens.push({
      text,
      type: XmlTokenType.Text
    } as IXmlText);
  }

  private onCDATA = (text: string) => {
    this.tokens.push({
      text,
      type: XmlTokenType.CDATA
    } as IXmlCData);
  }

  private onComment = (text: string) => {
    this.tokens.push({
      text,
      type: XmlTokenType.Comment
    } as IXmlComment);
  }
  //#endregion

  public getTokens(chunk: string): XmlToken[] {
    this.tokens = []
    this.parser.write(chunk)
    return this.tokens;
  }
}

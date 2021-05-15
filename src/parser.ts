import sax from 'sax'
import type { Tag } from 'sax';

export enum XmlTokenType {
  ElementOpen = 'element_open',
  ElementClose = 'element_close',
  Text = 'text',
  Comment = 'comment',
  PI = 'pi',
  CDATA = 'cdata'
}

export interface Attrs {
  [k: string]: string
}

interface IXmlNode {
  type: XmlTokenType
}

export interface IXmlOpenTag extends IXmlNode {
  name: string
  attrs: Attrs
  selfClosing: boolean
}

export interface IXmlCloseTag  extends IXmlNode {
  name: string
}

export interface IXmlText  extends IXmlNode {
  text: string
}

export interface IXmlCData  extends IXmlNode {
  text: string
}

export interface IXmlComment  extends IXmlNode {
  text: string
}

export type XmlToken = IXmlOpenTag | IXmlCloseTag | IXmlText | IXmlCData | IXmlComment

// Abstraction class to hide sax module behind and allow easy replacement
export class XmlSax {
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
    const tok: IXmlCloseTag = {
      name,
      type: XmlTokenType.ElementClose
    };

    this.tokens.push(tok);
  }

  private onText = (text: string) => {
    const tok: IXmlText = {
      text,
      type: XmlTokenType.Text
    };

    this.tokens.push(tok);
  }

  private onCDATA = (text: string) => {
    const tok: IXmlCData = {
      text,
      type: XmlTokenType.CDATA
    };

    this.tokens.push(tok);
  }

  private onComment = (text: string) => {
    const tok: IXmlComment = {
      text,
      type: XmlTokenType.Comment
    };

    this.tokens.push(tok);
  }
  //#endregion

  public getTokens(chunk: string): XmlToken[] {
    this.tokens = []
    this.parser.write(chunk)
    return this.tokens;
  }
}

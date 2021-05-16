import { Attrs } from './types';

export class XmlSerializer {
  public static openTag(
    name: string,
    attrs: Attrs = {},
    selfClosing = false
  ): string {
    const aStr = Object.entries(attrs || [])
      .reduce((acc, [k, v]) => `${acc}${k}="${v}" `, ' ')
      .trimRight();

    const sc = selfClosing ? '/' : '';
    return `<${name}${aStr}${sc}>`;
  }

  public static closeTag(name: string): string {
    return `</${name}>`;
  }

  public static text(text: string): string {
    return text;
  }

  public static comment(text: string): string {
    return `<!-- ${text} -->`
  }

  public static CDATA(text: string): string {
    return `<![CDATA[${text}]]>`
  }
}
// TODO: move generic data types to separate file
import { Attrs } from '../dom'

interface BaseOpts {
  indent?: number
  indentChar?: string
  eol?: string
}

interface ElementStartOpts extends BaseOpts {
  selfClosing?: boolean
  text?: string
  cdata?: boolean
  attrs?: Attrs
}

const DEFAULT_OPTS: BaseOpts = {
  indent: 0,
  indentChar: ' ',
  eol: '\n'
}

/**
 * Stateless XML serialization helper
 */
export class XmlSerializer {
  /**
   * Serialzie closing XML header
   * @param version version
   * @param encoding encoding
   */
  public static header(version: string, encoding: string) {
    return `<?xml version="${version}" encoding="${encoding}"?>`
  }

  /**
   * Serialize opening XML tag
   * @param name tag name
   * @param options options
   */
  public static elementStart(name: string, options: ElementStartOpts) {
    const {
      indent,
      indentChar,
      eol,

      attrs = {},
      selfClosing = false
    } = { ...DEFAULT_OPTS, ...options }

    const pad = indentChar.repeat(indent)
    const elt = `${pad}<${name}${this.attributes(attrs)}`
    return selfClosing ? `${elt} />${eol}` : `${elt}>${eol}`
  }

  /**
   * Serialzie closing XML tag
   * @param name tag name
   * @param options options
   */
  public static elementEnd(name: string, options?: BaseOpts) {
    const { indent, indentChar, eol } = {...DEFAULT_OPTS, ...options }
    const pad = indentChar.repeat(indent)
    return `${pad}</${name}>${eol}`
  }

  /**
   * Serialzie closing XML comment
   * @param content content
   * @param options options
   */
  public static comment(content: string, options?: BaseOpts) {
    const { indent, indentChar, eol } = {...DEFAULT_OPTS, ...options }
    const pad = indentChar.repeat(indent)
    return `${pad}<!-- ${content} -->${eol}`
  }

  /**
   * Serialize XML CDATA
   * @param content CDATA content
   */
  public static CDATA(content: string) {
    return `<![CDATA[${content}]]>`
  }

  /**
   * Serialize XML attributes
   * @param attrs attributes
   */
  private static attributes(attrs: Attrs) {
    return Object.entries(attrs || [])
    .reduce((acc, [k, v]) => `${acc}${k}="${v}" `, ' ')
    .trimRight()
  }
}

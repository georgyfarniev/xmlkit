// TODO: move generic data types to separate file
import { Attrs } from './xml_element'

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
    } = {... DEFAULT_OPTS, ...options }

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

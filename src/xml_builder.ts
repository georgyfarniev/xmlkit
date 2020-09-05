import { XmlSerializer } from './xml_serializer'
import { Stack } from './util'

interface Options {
  pretty?: boolean
}

export class XmlBuilder {
  private chunks: string[] = []
  private indent = 0

  // Indicates whether opening tag is closed (after attributes and other stuff)
  // private isClosed = true

  constructor(private readonly options: Options) {}

  private elements = new Stack<string>()

  public elt(name: string, attrs: any, self = false) {
    this.chunks.push(
      XmlSerializer.elementStart(name, {
        attrs,
        selfClosing: self,
        indent: this.indent,
        eol: ''
      })
    )

    if (self) return this
    this.elements.push(name)
    this.indent += 2
    return this
  }

  public text(text: string) {
    this.chunks.push(text)
    return this
  }

  public close() {
    this.chunks.push(
      XmlSerializer.elementEnd(this.elements.top)
    )
    this.elements.pop()
    this.indent -= 2
    return this
  }

  public clear() {
    this.chunks = []
  }

  public toString() {
    return this.chunks.join('')
  }
}

export default function builder(options?: Options) {
  return new XmlBuilder(options)
}
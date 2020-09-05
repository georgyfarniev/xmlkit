export class XmlBuilder {
  // private buf = ''
  private chunks: string[] = []
  private currentElt?: string = null
  private indent = 0

  // Indicates whether opening tag is closed (after attributes and other stuff)
  // private isClosed = true


  public elt(name: string, attrs: object, self = false) {
    this.indent += 2
    const pad = ' '.repeat(this.indent)

    const attrText = Object.entries(attrs || [])
      .reduce((acc, [k, v]) => acc += `${k}="${v}" `, ' ')
      .trimRight()

    const cap = self ? ' />' : '>'

    this.chunks.push(
      `${pad}<${name}${attrText}${cap}`
    )

    if (self) this.indent -= 2
    else this.currentElt = name

    return this
  }

  public text(text: string) {
    this.chunks.push(text)
    return this
  }

  public comment(text: string) {
    return this
  }

  public cdata(body: string) {
    return this
  }

  public close() {
    const pad = ' '.repeat(this.indent)
    this.indent -= 2
    this.chunks.push(`${pad}<${this.currentElt}/>`)
    return this
  }

  public toString() {
    return this.chunks.join('')
  }
}

export default function builder() {
  return new XmlBuilder()
}
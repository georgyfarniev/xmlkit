import { XmlBuilder } from './xml_builder'
import { Readable } from 'stream'

export class XmlStreamBuilder extends Readable {
  private readonly builder = new XmlBuilder({})

  public _read() {
    this.push(this.builder.toString())
    this.builder.clear()
  }

  public elt(name: string, attrs: any, self = false) {
    this.builder.elt(name, attrs, self)
    return this
  }

  public text(text: string) {
    this.builder.text(text)
    return this
  }

  public close() {
    this.builder.close()
    return this
  }
}

export default function builder() {
  return new XmlStreamBuilder()
}
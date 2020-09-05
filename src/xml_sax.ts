import sax from 'sax'
import { EventEmitter } from 'events'

interface Attrs {
  [k: string]: string
}

export interface Tag {
  name: string
  attrs: Attrs
  isSelfClosing: boolean
}

// Abstraction class to hide sax module behind and allow easy replacement
export class XmlSax extends EventEmitter {
  constructor(private parser = sax.parser(true)) {
    super()

    parser.onopentag = ({ ns, isSelfClosing, name, attributes}) =>
      this.emit('opentag', { ns, name, isSelfClosing, attrs: attributes })

    parser.onclosetag = (name: string) => this.emit('closetag', name)
    parser.ontext = (text: string) => this.emit('text', text)
    parser.oncomment = (comment: string) => this.emit('comment', comment)
    parser.oncdata = (cdata: string) => this.emit('cdata', cdata)
  }

  public feed(chunk: string) {
    this.parser.write(chunk)
  }
}

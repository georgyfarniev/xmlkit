import { XmlDocument, XmlElement } from '../dom'

async function main() {
  const doc = new XmlDocument()

  doc.root = new XmlElement('Root')

  doc.root
    .appendChild(
      new XmlElement('Child1', { attrs: { foo: 'bar' }, text: 'Text1' })
    )
    .appendChild(
      new XmlElement('Child2', { attrs: { fiz: 'buz' }, text: 'Text2' })
    ).appendChild(
      new XmlElement('Child3', { selfClosing: true })
    )

  console.log(doc.toString())
}

if (require.main === module) {
  main()
}

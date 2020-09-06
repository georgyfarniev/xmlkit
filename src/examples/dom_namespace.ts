import { XmlDocument } from '../dom'
import fs from 'fs'

const XML_TEXT = fs.readFileSync(__dirname + '/../../src/examples/ns.xml')
  .toString()

async function main() {
  const doc = new XmlDocument(XML_TEXT)

  console.log(doc.toString())

  // for (const child of doc.root) {
  //   console.log(child.name)

  //   for (const subchild of child) {
  //     console.log(`\t${subchild.name}`)
  //   }
  // }
}

if (require.main === module) {
  main()
}

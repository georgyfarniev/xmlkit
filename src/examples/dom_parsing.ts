import { XmlDocument } from '../dom'
import fs from 'fs'

const XML_TEXT = fs.readFileSync(__dirname + '/../../src/examples/sample.xml')
  .toString()

async function main() {
  const doc = new XmlDocument(XML_TEXT)

  for (const child of doc.root) {
    console.log(child.name)

    for (const subchild of child) {
      console.log(`\t${subchild.name}`)
    }
  }
}

if (require.main === module) {
  main()
}

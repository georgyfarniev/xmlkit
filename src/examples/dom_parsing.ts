import { XmlDocument } from '../dom'
import fs from 'fs'
import { XmlNodeType } from '../common'

const XML_TEXT = fs.readFileSync(__dirname + '/../../src/examples/sample.xml')
  .toString()

async function main() {
  const doc = new XmlDocument(XML_TEXT)

  // Iterate only elements
  for (const child of doc.root) {
    console.log(child.name)

    for (const subchild of child) {
      console.log(`\t${subchild.name}`, subchild.attrs)
    }
  }

  console.log('-'.repeat(50))

  // Iterating all node types
  for (const node of doc.root.childNodes) {
    if (node.type === XmlNodeType.Element) console.log(node.name)
    else if (node.type === XmlNodeType.Comment) console.log(node.comment)
  }

  console.log('-'.repeat(50))

  // Querying
  const elt = doc.root.query('Child1.Grandchild1')
  console.log(elt.name, elt.text, elt.attrs)
}

if (require.main === module) {
  main()
}

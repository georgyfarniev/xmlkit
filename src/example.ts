import { XmlDocument } from './xml_document'

const XML_TEXT = `
<?xml version="1.0" encoding="UTF-8"?>
<Root>
  <Child1 foo="bar">Text</Child1>
  <Child2>Text</Child2>
  <Child2>
    <!-- Comment2! -->
    <Grandchild1 fiz="buz" foo="123">Text3</Grandchild1>
    <Grandchild2>Text4</Grandchild2>
  </Child2>
  <Child3/>
  <Child4>
    <LastChild>Text</LastChild>
  </Child4>
  <!-- Comment! -->
</Root>`

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

import { XmlStream } from '../xml_stream'
import { TestStream } from './test_stream'
import XmlDoc from 'xmldoc'

async function main() {
  const stream = new TestStream(5)
  const xml = stream.pipe(new XmlStream('root.item'))

  for await (const chunk of xml) {
    // console.log(item.attrs.foo)

    // const doc = new XmlDoc.XmlDocument(chunk);
    // const doc = new XmlDoc(chunk);


    // doc.

    console.log('chunk -------------:\n')
    // console.log(chunk)
    console.log(chunk);
  }
}

if (require.main === module) {
  main()
}

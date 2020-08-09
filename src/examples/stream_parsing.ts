import { XmlStream } from '../xml_stream'
import { TestStream } from './test_stream'

async function main() {
  const stream = new TestStream(50)
  const xml = stream.pipe(new XmlStream('root.item'))

  for await (const item of xml) {
    console.log(item.attrs.foo)
  }
}

if (require.main === module) {
  main()
}

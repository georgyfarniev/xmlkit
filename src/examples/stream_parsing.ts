import { XmlStream } from '../xml_stream'
import { TestStream } from './test_stream'

async function main() {
  const stream = new TestStream(5)
  const xml = stream.pipe(new XmlStream('root.item'))

  for await (const chunk of xml) {
    console.log(chunk);
  }
}

if (require.main === module) {
  main()
}

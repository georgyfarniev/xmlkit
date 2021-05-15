import { XmlStream } from './stream'
import { TestStream } from './helpers'

async function main() {
  const stream = new TestStream(5)
  const xml = stream.pipe(new XmlStream('root.item'))

  // Async iterable
  for await (const chunk of xml)
    console.log(chunk);

  // Stream interface
  xml.on('data', (data) => console.log('--->', data))
}

if (require.main === module) {
  main()
}

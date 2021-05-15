import { XmlStream } from './stream'
import { TestStream } from './helpers'

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

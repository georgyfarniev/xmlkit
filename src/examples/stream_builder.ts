import { XmlStreamBuilder } from '../xml_stream_builder'

async function main() {
  const sb = new XmlStreamBuilder()
  sb.pipe(process.stdout)

  sb.elt('Root', { foo: 'bar' })
    .elt('Child', { fiz: 'buzz' }).text('test').close()
    .close()
}

if (require.main === module) {
  main()
}

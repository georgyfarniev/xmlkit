import builder from '../xml_builder'


async function main() {
  const text = builder()
    .elt('Root', { foo: 'bar' }).text('test')
      .elt('Child', { fiz: 'buzz' }, true)
    .close()

    .toString()
  console.log(text)
}

if (require.main === module) {
  main()
}

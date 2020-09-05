import builder from '../xml_builder'


async function main() {
  const text = builder()
    .elt('Root', { foo: 'bar' })
      .elt('Child', { fiz: 'buzz' }).text('test').close()
    .close()
    .toString()

  console.log(text)
}

if (require.main === module) {
  main()
}

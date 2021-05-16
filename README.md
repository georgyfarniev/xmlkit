# xmlkit - xml tools
<a href="https://www.npmjs.com/package/xmlkit" alt="Downloads">
  <img src="https://img.shields.io/npm/dm/xmlkit" />
</a>

<a href="https://www.npmjs.com/package/xmlkit">
  <img src="https://img.shields.io/npm/v/xmlkit" />
</a>

## Motivation
Sometimes you need to parse large XML files to extract some repetitive element
and process each of them sequentially as a NodeJS Stream. Existing solutions
are either too complex, using native libraries or too low-level, so I made this 
one for those who need pretty simple stream-based XML parsing. For now, it's based
on [sax](https://github.com/isaacs/sax-js) module and allows you to simply specify
path to elements that you would like to extract via simple dot notation (not XPath!)

Use it if you don't need extra performance and don't want to deal with low-level
details of using sax library.

If you need something more complicated, consider using [sax](https://github.com/isaacs/sax-js)
or something else directly

## Features
1. Based on NodeJS Transform stream, so easy to use with existing solutions
2. Stream emits chunks of text containing XML definition of the queried element
3. Extremely simple, so you can use your favorite xml library to parse each element,
 such as [xmldoc](https://github.com/nfarina/xmldoc) or [xmldoc](https://github.com/Leonidas-from-XIV/node-xml2js)
4. Only one external dependency without nested dependencies - [sax](https://github.com/isaacs/sax-js)
5. Typescript types out of the box

## Usage example
Imagine you have a large XML with following structure and you want to process
each **elt** sequentially:

```xml
<root>
  <elt foo="1">First element</elt>
  <elt foo="2">Second element</elt>
  <elt foo="3">Third element</elt>
  <!-- Several more million of the rows -->
</root>
```

```js
const fs = require('fs');
const { XmlStream } = require('xmlkit');


(async function () {
  // Create stream pipeline
  const input = fs.createReadStream('./10gbfile.xml');
  const parser = new XmlStream('root.elt');
  const xml = input.pipe(parser);

  // Iterate using async iterable
  for await (const chunk of xml) {
    // each chunk will contain an xml string representing current elt node
    console.log(chunk);
  }

  // Or iterate using stream interface
  xml
    .on('data', (chunk) => console.log(chunk))
    .on('end', () => console.log('all xml loaded'));

  // Or just pipe to other file
  xml.pipe(fs.createWriteStream('./result.xml'));
})();
```

## API

### XmlStream class

##### XmlStream.constructor(selector: string)
A constructor that creates parser instance.
Takes a string specifying selector for extracting elements in dot notation as a
first parameter, example: `root.elt`. **root** and **elt** is an en element name
ONLY this, simple format is supported, this is NOT an XPath, so only element
selectors is supported.

##### XmlStream.on('data', (chunk: string))
Event emitted for each of the extracted nodes specified by selector passed in
constructor. Chunk is just a string containing XML data of the needed element,
which enables you to use any of your favorite XML parser to further process the
chunk.

## Afterwords
Working with XML is pain in NodeJS, so if this package gains any substantil amount
of popularity, I will consider adding other useful XML tools here, since package
name is very flexible and fits for anything related to XML.

Feel free to create discussion or file PR

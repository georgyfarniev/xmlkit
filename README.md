# xmlkit - supercharged xml library

<a href="https://www.npmjs.com/package/xmlkit" alt="Downloads">
  <img src="https://img.shields.io/npm/dm/xmlkit" />
</a>

<a href="https://www.npmjs.com/package/xmlkit">
  <img src="https://img.shields.io/npm/v/xmlkit" />
</a>

Collection of tools for working with XML, including processing of large XML 
files using stream.

Currently WIP, but stable version will be released.

## Capabilities
1. DOM parsing, modifying or creating and iteration of XML documents
2. Parse stream to fetch specific node by path using async iterables
3. Only one dependency - sax library which doesn't have other deps. Even this 
   dependency will be eliminated by rewriting sax module on typescript and 
   inluding it.

## TODO:
1. Namespaces support
2. builder + stream builder
3. xpath support
4. Own sax parser implementation
5. More tests
6. Better documentation

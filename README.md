# xmlkit - tools for xml operations

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
2. Own sax parser implementation
3. More tests
4. Better documentation

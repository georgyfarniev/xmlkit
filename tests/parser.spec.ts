import 'jest';
import { XmlSaxParser } from '../src/parser';

describe('XmlSaxParser', () => {
  test('simple', () => {
    const parser = new XmlSaxParser();
    const xml = '<root><element>text</element></root>'
    expect(parser.getTokens(xml)).toMatchSnapshot();
  });

  test('complex', () => {
    const parser = new XmlSaxParser();
    const xml = '<root><element foo="bar">text<inner fiz="buzz"/></element></root>'
    expect(parser.getTokens(xml)).toMatchSnapshot();
  });
});

import 'jest';
import { XmlSerializer } from '../src/serializer';

describe('XmlSerializer', () => {
  test('open tag simple', async () => {
    const text = XmlSerializer.openTag('element');
    expect(text).toBe('<element>');
  });

  test('open tag complex', async () => {
    const text = XmlSerializer.openTag('element', { foo: 'bar' }, true);
    expect(text).toBe('<element foo="bar"/>');
  });

  test('close tag', async () => {
    const text = XmlSerializer.closeTag('element');
    expect(text).toBe('</element>');
  });

  test('comment', async () => {
    const text = XmlSerializer.comment('test text');
    expect(text).toBe('<!-- test text -->');
  });

  test('CDATA', async () => {
    const text = XmlSerializer.CDATA('text\n\ntext');
    expect(text).toBe('<![CDATA[text\n\ntext]]>');
  });

  test('text', async () => {
    const text = XmlSerializer.text('test\n\ntest');
    expect(text).toBe('test\n\ntest');
  });
});

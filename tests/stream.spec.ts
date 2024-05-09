import fs from 'node:fs'
import path from 'node:path'
import { XmlStream } from '../src/stream';

const readResult = async (file: string, ps: string) => {
  const input = fs.createReadStream(
    path.join(__dirname, file)
  );

  const parser = new XmlStream(ps);
  const xml = input.pipe(parser);

  let result = '';
  for await (const chunk of xml) {
    result += chunk;
  }

  return result;
}

describe('XmlStream', () => {
  test('complex example including self-closing elements', async () => {
    await expect(readResult('example.xml', 'root.example.item')).resolves.toMatchSnapshot()
  });
});

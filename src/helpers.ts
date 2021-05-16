import { Readable } from 'stream'

/**
 * Class to generate heavy xml payload for testing purposes.
 * Each value inside contains incremented value for ease of testing
 */
export class TestStream extends Readable {
  private index = 0

  constructor(private readonly total: number = 1 * 1000 * 1000) {
    super()
  }

  public _read(): void {
    const { index, total } = this

    if (index > total) {
      this.push(null)
      return
    }

    const buf = [
      index ? '' : '<root>',
      `<item foo="bar${index}">`,
      `<node1_${index}>text${index}`,
      `<subnode${index}>subtext${index}</subnode${index}>`,
      `</node1_${index}>`,
      '</item>',
      index === total ? '</root>' : ''
    ].join('\n')

    this.push(buf)
    this.index++
  }
}

import { Readable } from 'stream'
import { StringBuilder } from '../util'

/**
 * Class to generate heavy xml payload for testing purposes.
 * Each value inside contains incremented value for ease of testing
 */
export class TestStream extends Readable {
  private index = 0

  constructor(private readonly total: number = 1 * 1000 * 1000) {
    super()
  }

  public _read() {
    if (this.index > this.total) {
      this.push(null)
      return
    }

    const sb = new StringBuilder()

    if (this.index === 0) {
      sb.appendLine('<root>')
    }

    sb.append(this.getFakeElementForIndex(this.index))

    if (this.index === this.total) {
      sb.appendLine('</root>')
    }

    this.push(sb.toString())
    this.index++
  }

  private getFakeElementForIndex(index: number) {
    const sb = new StringBuilder()

    sb.appendLine(`<item foo="bar${index}">`)
    sb.appendLine(`<node1_${index}>text${index}`)
    sb.appendLine(`<subnode${index}>subtext${index}</subnode${index}>`)
    sb.appendLine(`</node1_${index}>`)

    sb.appendLine('</item>')

    return sb.toString()
  }
}

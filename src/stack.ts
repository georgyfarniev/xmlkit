/**
 * Stack implementation
 */

export class Stack<T = unknown> {
  private readonly data: T[] = []

  public toArray(): T[] { return this.data }
  public push(elt: T): void { this.data.push(elt) }
  public pop(): T { return this.data.pop() }
  public clear(): void { this.data.length = 0 }
  public get length(): number { return this.data.length }
  public get empty(): boolean { return this.data.length === 0 }

  public get top() :T|undefined {
    return this.data.length ? this.data[this.data.length - 1] : undefined
  }
}

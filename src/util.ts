export class Stack<T = any> {
  private readonly data: T[] = []

  public toArray() { return this.data }
  public push(elt: T) { this.data.push(elt) }
  public pop(): T { return this.data.pop() }
  public clear() { this.data.length = 0 }
  public get empty() { return this.data.length === 0 }

  public get top() {
    return this.data.length ? this.data[this.data.length - 1] : undefined
  }
}

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

export class StringBuilder {
  private readonly chunks: string[] = []

  public clear() { this.chunks.length = 0 }
  public toString() { return this.chunks.join('') }
  public append(chunk: string) { this.chunks.push(chunk) }
  
  public appendLine(chunk: string, newline = '\n') {
    this.append(chunk + newline)
  }
}

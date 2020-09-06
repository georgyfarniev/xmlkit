/**
 * Stack implementation
 */
export class Stack<T = any> extends Array<T> {
  public clear() { this.length = 0 }
  public get empty() { return this.length === 0 }
  public get top() { return this?.[this.length] }
}

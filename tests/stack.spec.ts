import 'jest'
import { Stack } from '../src/stack'

describe('Stack', () => {
  test('general', async () => {
    const stack = new Stack<number>()

    stack.push(1)
    stack.push(2)
    stack.push(3)

    expect(stack).toHaveLength(3)

    expect(stack.top).toBe(3)
  })
})
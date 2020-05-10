import 'jest'
import { getMeaningOfLife } from '../'

describe('Index tests', () => {
  test('test', async () => {
    const ret = getMeaningOfLife()
    expect(ret).toBe(42)
  })
})
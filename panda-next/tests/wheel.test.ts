import { describe, it, expect } from 'vitest'
import { addDays } from 'date-fns'

describe('wheel cooldown logic', () => {
  it('calculates next allowed date as 7 days later', () => {
    const now = new Date('2025-09-25T12:00:00Z')
    const next = addDays(now, 7)
    expect(next.toISOString()).toBe(new Date('2025-10-02T12:00:00Z').toISOString())
  })
})

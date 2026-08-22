import { describe, expect, it } from 'vitest'
import { fmtEpa, parseYear } from '~/lib/format'

describe('parseYear', () => {
    it('accepts a plausible season and falls back to the current one otherwise', () => {
        expect(parseYear('2024')).toBe(2024)
        const current = new Date().getFullYear()
        expect(parseYear('1999')).toBe(current)
        expect(parseYear('abc')).toBe(current)
        expect(parseYear(null)).toBe(current)
    })
})

describe('fmtEpa', () => {
    it('signs positives and marks missing values', () => {
        expect(fmtEpa(1.234)).toBe('+1.23')
        expect(fmtEpa(-0.5)).toBe('-0.50')
        expect(fmtEpa(null)).toBe('—')
    })
})

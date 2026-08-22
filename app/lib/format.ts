/** Client-safe formatting helpers for the stats tables. */
export const fmtEpa = (n: number | null | undefined) =>
    n == null ? '—' : `${n > 0 ? '+' : ''}${n.toFixed(2)}`

export const fmtDate = (iso: string | null | undefined) => (iso ? iso.slice(0, 10) : '—')

/** Validate a ?year= style input; falls back to the current season. */
export function parseYear(raw: string | null | undefined) {
    const year = Number(raw)
    return Number.isInteger(year) && year >= 2000 && year <= 2100 ? year : new Date().getFullYear()
}

export const SEASONS = Array.from(
    { length: new Date().getFullYear() - 2023 + 1 },
    (_, i) => new Date().getFullYear() - i,
)

/** Zones in reading order: short row then deep row, each left -> middle -> right. */
export const ZONES = [
    ['SHORT', 'LEFT'],
    ['SHORT', 'MIDDLE'],
    ['SHORT', 'RIGHT'],
    ['DEEP', 'LEFT'],
    ['DEEP', 'MIDDLE'],
    ['DEEP', 'RIGHT'],
] as const

export const zoneLabel = (depth: string, direction: string) =>
    `${depth === 'SHORT' ? 'Short' : 'Deep'} ${direction[0]}`

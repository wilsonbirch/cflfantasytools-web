/** Client-safe formatting helpers for the stats tables. */
export const fmtEpa = (n: number | null | undefined) =>
    n == null ? '—' : `${n > 0 ? '+' : ''}${n.toFixed(2)}`

export const fmtDate = (iso: string | null | undefined) => (iso ? iso.slice(0, 10) : '—')

/** Validate a ?year= style input; falls back to the current season. */
export function parseYear(raw: string | null | undefined) {
    const year = Number(raw)
    return Number.isInteger(year) && year >= 2000 && year <= 2100 ? year : new Date().getFullYear()
}

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

/**
 * Order receiver slots strong side first, then weak side, each outside-in
 * (1S, 2S, 3S, 1WK, 2WK, ...). Labels the regex does not know sort last, as printed.
 */
export function alignmentOrder(position: string) {
    const m = /^(\d+)(S|WK)$/.exec(position)
    return m ? (m[2] === 'S' ? 0 : 100) + Number(m[1]) : 1000
}

/** Fantasy points to one decimal. */
export const fmtPts = (n: number | null | undefined) => (n == null ? '—' : n.toFixed(1))

/** Game Zone salaries are whole dollars. */
export const fmtSalary = (n: number | null | undefined) =>
    n == null ? '—' : `$${n.toLocaleString('en-CA')}`

/** Signed salary change; zero prints as a dash so the eye skips it. */
export const fmtDelta = (n: number | null | undefined) =>
    n == null || n === 0 ? '—' : `${n > 0 ? '+' : '−'}$${Math.abs(n).toLocaleString('en-CA')}`

export const POSITION_LABEL: Record<string, string> = {
    QUARTERBACK: 'QB',
    RUNNING_BACK: 'RB',
    WIDE_RECEIVER: 'WR',
    OTHER: '—',
}

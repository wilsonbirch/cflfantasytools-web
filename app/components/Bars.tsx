type Bar = { label: string; value: number | null | undefined; title?: string }

/**
 * Points-per-week as CSS bars: SSR, no chart library. Heights are relative to
 * the largest value; null weeks (DNP / not yet played) render as an empty slot.
 */
export function Bars({ bars, ariaLabel }: { bars: Bar[]; ariaLabel: string }) {
    const max = Math.max(1, ...bars.map((b) => b.value ?? 0))
    return (
        <ol className="bars" aria-label={ariaLabel}>
            {bars.map((b) => (
                <li
                    key={b.label}
                    className="bars__item"
                    title={b.title ?? `${b.label}: ${b.value ?? '—'}`}
                >
                    <span className="bars__value">{b.value == null ? '—' : b.value}</span>
                    <span
                        className={`bars__bar ${b.value == null ? 'bars__bar--empty' : ''}`}
                        style={{ height: `${Math.round(((b.value ?? 0) / max) * 100)}%` }}
                    />
                    <span className="bars__label">{b.label}</span>
                </li>
            ))}
        </ol>
    )
}

import type { ReactNode } from 'react'

type Props = {
    label: string
    value: ReactNode
    /** Small line under the value: a unit, a delta, a date. */
    hint?: ReactNode
    className?: string
}

/** One number with its label. Lay several out in a `.stat-tiles` grid. */
export function StatTile({ label, value, hint, className = '' }: Props) {
    return (
        <div className={`stat-tile ${className}`.trim()}>
            <span className="stat-tile__label">{label}</span>
            <span className="stat-tile__value">{value}</span>
            {hint != null && <span className="stat-tile__hint">{hint}</span>}
        </div>
    )
}

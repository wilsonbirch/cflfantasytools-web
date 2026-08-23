import type { ReactNode } from 'react'
import { Link } from 'react-router'

export type Column<T> = {
    key: string
    label: ReactNode
    /** Right-aligned tabular numerals. */
    num?: boolean
    /** Long form of an abbreviated header, shown on hover. */
    title?: string
    cell: (row: T) => ReactNode
    /** Extra class on the cell — team colour accents go here (`team-${slug}`). */
    cellClass?: (row: T) => string | undefined
    /** The header becomes a sort link when `sort` is given. */
    sortable?: boolean
}

type Props<T> = {
    columns: Column<T>[]
    rows: T[]
    rowKey: (row: T) => string | number
    rowClass?: (row: T) => string | undefined
    /** Screen-reader caption; every data table has one. */
    caption: string
    /** Current sort key and a GET href for each sortable key. Server-side, so it works without JS. */
    sort?: { key: string | null; href: (key: string) => string }
    /** Shown instead of the table when there are no rows. */
    empty?: ReactNode
}

/**
 * The one compact, read-only table: sticky header inside a scrolling wrap,
 * right-aligned tabular-nums numerics, optional link-sorting. SSR-rendered
 * <table> — the stats surfaces are read-only, so a client grid buys nothing.
 */
export function DataTable<T>({ columns, rows, rowKey, rowClass, caption, sort, empty }: Props<T>) {
    if (rows.length === 0) return <p className="text-default-500">{empty ?? 'Nothing to show.'}</p>
    return (
        <div className="table-wrap">
            <table className="data-table">
                <caption className="sr-only">{caption}</caption>
                <thead>
                    <tr>
                        {columns.map((c) => {
                            const sorted = sort?.key === c.key
                            return (
                                <th
                                    key={c.key}
                                    scope="col"
                                    className={c.num ? 'num' : undefined}
                                    title={c.title}
                                    aria-sort={sorted ? 'descending' : undefined}
                                >
                                    {sort && c.sortable ? (
                                        <Link to={sort.href(c.key)} className="hover:underline">
                                            {c.label}
                                            {sorted ? ' ↓' : ''}
                                        </Link>
                                    ) : (
                                        c.label
                                    )}
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={rowKey(row)} className={rowClass?.(row)}>
                            {columns.map((c) => (
                                <td
                                    key={c.key}
                                    className={[c.num ? 'num' : '', c.cellClass?.(row) ?? '']
                                        .join(' ')
                                        .trim()}
                                >
                                    {c.cell(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

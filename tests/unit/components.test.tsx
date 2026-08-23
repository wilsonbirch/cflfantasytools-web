import { render, screen } from '@testing-library/react'
import { createRoutesStub } from 'react-router'
import { describe, expect, it } from 'vitest'
import { type Column, DataTable } from '~/components/DataTable'
import { PageHeader } from '~/components/PageHeader'
import { StatTile } from '~/components/StatTile'

type Row = { name: string; pts: number; slug: string }
const rows: Row[] = [
    { name: 'A', pts: 10, slug: 'bc-lions' },
    { name: 'B', pts: 5, slug: 'ottawa-redblacks' },
]
const columns: Column<Row>[] = [
    { key: 'name', label: 'Player', cell: (r) => r.name, cellClass: (r) => `team-${r.slug}` },
    { key: 'pts', label: 'Pts', title: 'Points', num: true, sortable: true, cell: (r) => r.pts },
]

/** DataTable renders <Link>, which needs a router. */
const inRouter = (ui: React.ReactElement) => {
    const Stub = createRoutesStub([{ path: '/', Component: () => ui }])
    return render(<Stub initialEntries={['/']} />)
}

describe('DataTable', () => {
    it('renders a caption, numeric columns, team accents and the sort state', () => {
        inRouter(
            <DataTable
                caption="Leaders"
                columns={columns}
                rows={rows}
                rowKey={(r) => r.name}
                sort={{ key: 'pts', href: (k) => `?sort=${k}` }}
            />,
        )
        expect(screen.getByText('Leaders')).toHaveClass('sr-only')
        const pts = screen.getByRole('columnheader', { name: /Pts/ })
        expect(pts).toHaveAttribute('aria-sort', 'descending')
        expect(pts).toHaveClass('num')
        expect(pts).toHaveAttribute('title', 'Points')
        expect(screen.getByRole('link', { name: /Pts/ })).toHaveAttribute('href', '/?sort=pts')
        // Non-sortable headers stay plain text.
        expect(screen.queryByRole('link', { name: 'Player' })).toBeNull()
        expect(screen.getByText('A')).toHaveClass('team-bc-lions')
        expect(screen.getByText('10')).toHaveClass('num')
    })

    it('shows the empty state instead of a table', () => {
        inRouter(
            <DataTable
                caption="Leaders"
                columns={columns}
                rows={[]}
                rowKey={(r) => r.name}
                empty="No games."
            />,
        )
        expect(screen.getByText('No games.')).toBeInTheDocument()
        expect(screen.queryByRole('table')).toBeNull()
    })
})

describe('PageHeader', () => {
    it('puts title, context, description and actions in one heading block', () => {
        render(
            <PageHeader title="Games" context={2026} actions={<button>Go</button>}>
                Parsed games only.
            </PageHeader>,
        )
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Games2026')
        expect(screen.getByText('Parsed games only.')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument()
    })
})

describe('StatTile', () => {
    it('renders label, value and hint', () => {
        render(<StatTile label="Stale" value={2} hint="of 5" />)
        expect(screen.getByText('Stale')).toBeInTheDocument()
        expect(screen.getByText('2')).toHaveClass('stat-tile__value')
        expect(screen.getByText('of 5')).toBeInTheDocument()
    })
})

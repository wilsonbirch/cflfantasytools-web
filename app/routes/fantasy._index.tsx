import type { Route } from './+types/fantasy._index'
import { PageHeader } from '~/components/PageHeader'

export const meta: Route.MetaFunction = () => [{ title: 'Fantasy — 3 Down Fantasy' }]

/** Placeholder until the phase-3 fantasy contract lands: salaries, projections, value. */
export default function Fantasy() {
    return (
        <div className="flex flex-col gap-4">
            <PageHeader title="Fantasy">
                A companion to CFL Game Zone: salaries, projections and value per player, and a
                lineup suggestion you enter on Game Zone yourself. Coming with the next api release.
            </PageHeader>
        </div>
    )
}

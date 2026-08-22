import { Link, useRouteLoaderData } from 'react-router'
import type { Route } from './+types/teams.$slug._index'
import type { loader as teamLoader } from './teams.$slug'

export default function TeamYears({ params }: Route.ComponentProps) {
    const years = useRouteLoaderData<typeof teamLoader>('routes/teams.$slug')?.years ?? []
    if (years.length === 0) return <p className="text-default-500">No depth charts yet.</p>
    return (
        <>
            <h2 className="text-lg font-medium">Seasons</h2>
            <ul className="flex flex-wrap gap-2">
                {years.map((year) => (
                    <li key={year}>
                        <Link to={`/teams/${params.slug}/${year}`} className="team-button">
                            {year}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}

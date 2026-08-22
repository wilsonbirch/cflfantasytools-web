import { Link } from 'react-router'
import type { Route } from './+types/_index'

export function meta(_: Route.MetaArgs) {
    return [
        { title: '3 Down Fantasy' },
        {
            name: 'description',
            content: 'CFL depth chart tracking, game-by-game stats and fantasy tools.',
        },
    ]
}

export default function Index() {
    return (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
            <h1 className="text-3xl font-semibold">3 Down Fantasy</h1>
            <p className="text-default-500">
                CFL depth charts, game-by-game stats and fantasy tools.
            </p>
            <nav aria-label="Sections" className="mt-4 flex gap-4">
                <Link to="/teams" className="underline">
                    Depth charts
                </Link>
                <Link to="/games" className="underline">
                    Games
                </Link>
                <Link to="/stats" className="underline">
                    Stats
                </Link>
            </nav>
        </div>
    )
}

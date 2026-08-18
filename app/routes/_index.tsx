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

// Placeholder shell. The ported routes (depth charts, auth, settings, admin)
// land in phase 5 once the api exposes the queries behind them.
export default function Index() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-8">
            <h1 className="text-3xl font-semibold">3 Down Fantasy</h1>
            <p className="text-default-500">
                CFL depth charts, game-by-game stats and fantasy tools.
            </p>
        </main>
    )
}

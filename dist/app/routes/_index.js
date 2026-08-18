import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
export function meta(_) {
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
    return _jsxs('main', {
        className: 'flex min-h-screen flex-col items-center justify-center gap-3 p-8',
        children: [
            _jsx('h1', { className: 'text-3xl font-semibold', children: '3 Down Fantasy' }),
            _jsx('p', {
                className: 'text-default-500',
                children: 'CFL depth charts, game-by-game stats and fantasy tools.',
            }),
        ],
    })
}

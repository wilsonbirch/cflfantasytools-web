import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import './styles/tailwind.css'
import './styles/main.css'
import './styles/teams/index.css'
export const links = () => [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
    },
]
export function Layout({ children }) {
    return _jsxs('html', {
        lang: 'en',
        className: 'dark',
        children: [
            _jsxs('head', {
                children: [
                    _jsx('meta', { charSet: 'utf-8' }),
                    _jsx('meta', {
                        name: 'viewport',
                        content: 'width=device-width, initial-scale=1',
                    }),
                    _jsx(Meta, {}),
                    _jsx(Links, {}),
                ],
            }),
            _jsxs('body', {
                className: 'bg-grain min-h-screen',
                children: [children, _jsx(ScrollRestoration, {}), _jsx(Scripts, {})],
            }),
        ],
    })
}
export default function App() {
    return _jsx(Outlet, {})
}
export function ErrorBoundary({ error }) {
    const message = isRouteErrorResponse(error)
        ? `${error.status} ${error.statusText}`
        : error instanceof Error
          ? error.message
          : 'Something went wrong'
    return _jsxs('main', {
        className: 'flex min-h-screen flex-col items-center justify-center gap-3 p-8',
        children: [
            _jsx('h1', { className: 'text-2xl font-semibold', children: 'Something went wrong' }),
            _jsx('p', { className: 'text-default-500', children: message }),
        ],
    })
}

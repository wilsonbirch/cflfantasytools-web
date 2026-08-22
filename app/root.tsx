import {
    data,
    Form,
    isRouteErrorResponse,
    Link,
    Links,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
    useRouteLoaderData,
} from 'react-router'
import type { Route } from './+types/root'
import { getViewer } from './lib/auth.server'
import './styles/tailwind.css'
import './styles/main.css'
import './styles/teams/index.css'

export const links: Route.LinksFunction = () => [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
    },
]

export async function loader({ request }: Route.LoaderArgs) {
    const { viewer, headers } = await getViewer(request)
    return data({ viewer }, { headers })
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded px-2 py-1 text-sm hover:underline ${isActive ? 'font-semibold underline' : ''}`

function Nav() {
    const viewer = useRouteLoaderData<typeof loader>('root')?.viewer ?? null
    return (
        <header className="border-b border-default-200">
            <nav
                aria-label="Main"
                className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-4 py-2"
            >
                <Link to="/" className="mr-4 font-semibold">
                    3 Down Fantasy
                </Link>
                <NavLink to="/teams" className={navLinkClass}>
                    Teams
                </NavLink>
                <NavLink to="/games" className={navLinkClass}>
                    Games
                </NavLink>
                <NavLink to="/stats" className={navLinkClass}>
                    Stats
                </NavLink>
                {viewer?.role === 'ADMIN' && (
                    <NavLink to="/admin" className={navLinkClass}>
                        Admin
                    </NavLink>
                )}
                <span className="ml-auto flex items-center gap-1">
                    {viewer ? (
                        <>
                            <NavLink to="/account" className={navLinkClass}>
                                Account
                            </NavLink>
                            <Form method="post" action="/logout">
                                <button type="submit" className="px-2 py-1 text-sm hover:underline">
                                    Log out
                                </button>
                            </Form>
                        </>
                    ) : (
                        <NavLink to="/login" className={navLinkClass}>
                            Log in
                        </NavLink>
                    )}
                </span>
            </nav>
        </header>
    )
}

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body className="bg-grain min-h-screen">
                <Nav />
                <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}

export default function App() {
    return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    const message = isRouteErrorResponse(error)
        ? `${error.status} ${error.statusText}`
        : error instanceof Error
          ? error.message
          : 'Something went wrong'

    return (
        <div className="flex flex-col items-center gap-3 p-8">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="text-default-500">{message}</p>
        </div>
    )
}

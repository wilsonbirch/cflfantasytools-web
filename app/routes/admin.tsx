import { data, NavLink, Outlet } from 'react-router'
import type { Route } from './+types/admin'
import { requireAdmin } from '~/lib/auth.server'

export const meta: Route.MetaFunction = () => [{ title: 'Admin — 3 Down Fantasy' }]

// Child loaders run in parallel with this one, so each child guards itself too.
export async function loader({ request }: Route.LoaderArgs) {
    const { headers } = await requireAdmin(request)
    return data(null, { headers })
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-2 py-1 text-sm hover:underline ${isActive ? 'font-semibold underline' : ''}`

export default function Admin() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Admin</h1>
            <nav aria-label="Admin" className="flex gap-2 border-b border-default-200 pb-2">
                <NavLink to="/admin" end className={linkClass}>
                    Scrapers
                </NavLink>
                <NavLink to="/admin/jobs" className={linkClass}>
                    Jobs
                </NavLink>
            </nav>
            <Outlet />
        </div>
    )
}

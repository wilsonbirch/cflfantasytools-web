import { data } from 'react-router'
import type { Route } from './+types/account'
import { requireUser } from '~/lib/auth.server'

export const meta: Route.MetaFunction = () => [{ title: 'Account — 3 Down Fantasy' }]

export async function loader({ request }: Route.LoaderArgs) {
    const { viewer, headers } = await requireUser(request)
    return data({ viewer }, { headers })
}

export default function Account({ loaderData: { viewer } }: Route.ComponentProps) {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Account</h1>
            <dl className="grid max-w-sm grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                <dt className="text-default-500">Email</dt>
                <dd>{viewer.email}</dd>
                <dt className="text-default-500">Role</dt>
                <dd>{viewer.role}</dd>
            </dl>
        </div>
    )
}

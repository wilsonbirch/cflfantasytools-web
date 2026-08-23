import { Button } from '@heroui/react'
import { Form } from 'react-router'

type Props = {
    year: number
    /** From Query.seasons, newest first. */
    seasons: number[]
    team: string
    teams: { slug: string; abbreviation: string; name: string }[]
}

/** GET form: year + team selects. Native selects keep it SSR-only and accessible. */
export function SeasonFilter({ year, seasons, team, teams }: Props) {
    // Keep the selected year visible even when the api has no games for it yet.
    const options = seasons.includes(year) ? seasons : [year, ...seasons]
    return (
        <Form method="get" className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col text-sm">
                <span className="text-default-500">Season</span>
                <select name="year" defaultValue={year} className="input input--primary">
                    {options.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </label>
            <label className="flex flex-col text-sm">
                <span className="text-default-500">Team</span>
                <select name="team" defaultValue={team} className="input input--primary">
                    <option value="">All teams</option>
                    {teams.map((t) => (
                        <option key={t.slug} value={t.slug}>
                            {t.name}
                        </option>
                    ))}
                </select>
            </label>
            <Button type="submit" variant="secondary" size="sm">
                Show
            </Button>
        </Form>
    )
}

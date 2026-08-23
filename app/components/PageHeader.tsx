import type { ReactNode } from 'react'

type Props = {
    title: ReactNode
    /** Season / week / date context, set beside the title: "2026 · Week 10". */
    context?: ReactNode
    /** Right-aligned controls: filters, subscribe button. */
    actions?: ReactNode
    /** One line under the title. */
    children?: ReactNode
}

/** Every page opens the same way: title, its season/week context, actions on the right. */
export function PageHeader({ title, context, actions, children }: Props) {
    return (
        <header className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold">
                    {title}
                    {context != null && (
                        <span className="ml-3 text-base font-normal text-default-500">
                            {context}
                        </span>
                    )}
                </h1>
                {actions}
            </div>
            {children && <p className="text-sm text-default-500">{children}</p>}
        </header>
    )
}

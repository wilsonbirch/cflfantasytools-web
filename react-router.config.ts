import type { Config } from '@react-router/dev/config'

// v8 passes the raw request to loaders and actions (the old
// `future.v8_passThroughRequests` behaviour, now the only one), so on client
// navigations `request.url` is the `/path.data?_routes=…` fetch. Read the
// location from the `url` arg instead.
export default {
    ssr: true,
} satisfies Config

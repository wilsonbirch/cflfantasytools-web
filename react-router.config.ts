import type { Config } from '@react-router/dev/config'

export default {
    ssr: true,
    future: {
        // v8's behaviour, adopted early: loaders and actions get the raw
        // request, so on client navigations `request.url` is the
        // `/path.data?_routes=…` fetch. Read the location from the `url` arg.
        // Delete this block in the v8 bump: v8 rejects the flag at startup.
        v8_passThroughRequests: true,
    },
} satisfies Config

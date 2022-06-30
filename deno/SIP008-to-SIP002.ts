import { encode } from 'https://deno.land/std@0.145.0/encoding/base64.ts'
import { isIPv6 } from 'https://esm.sh/is-ip@4.0.0'

export interface Config {
    version: number
    servers: Server[]
    [key: string]: unknown
}

export interface Server {
    id: string
    server: string
    server_port: number
    password: string
    method: string
    remarks?: string
    plugin?: string
    plugin_opts?: string
    [key: string]: unknown
}

export function convertServer(entry: Server): string {
    let { server, server_port, password, method, remarks } = entry
    if (isIPv6(server)) server = `[${server}]`
    return `ss://${encode(
        `${method}:${password}`
    )}@${server}:${server_port}#${remarks}`
}

if (import.meta.main) {
    const [url] = Deno.args
    const res = await fetch(url)
    const { servers }: Config = await res.json()
    console.log(servers.map(convertServer).join('\n'))
}

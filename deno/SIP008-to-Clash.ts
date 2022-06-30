import { Config, Server } from './SIP008-to-SIP002.ts'
import { generateConfig } from './utils/clash.ts'

export function convertServers(servers: Server[]) {
    const proxies = servers
        .map((server) => ({
            name: server.remarks,
            type: 'ss',
            server: server.server,
            port: server.server_port,
            cipher: server.method,
            password: server.password,
        }))
        .filter((i) => !i.cipher.startsWith('2022'))

    return {
        proxies,
        'proxy-groups': [
            {
                name: 'PROXY',
                type: 'select',
                proxies: proxies.map((proxy) => proxy.name),
            },
        ],
    }
}

if (import.meta.main) {
    const [url] = Deno.args
    const res = await fetch(url)
    const { servers }: Config = await res.json()
    const proxies = convertServers(servers)
    console.log(generateConfig(proxies))
}

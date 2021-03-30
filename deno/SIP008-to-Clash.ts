// @deno-types="https://cdn.jsdelivr.net/npm/ky@0.27.0/index.d.ts"
import ky from 'https://cdn.jsdelivr.net/npm/ky@0.27.0/index.js'
import { Config, Server } from './SIP008-to-SIP002.ts'
import { generateConfig } from './utils/clash.ts'

export function convertServers(servers: Server[]) {
  const proxies = servers.map(server => ({
    name: server.remarks,
    type: 'ss',
    server: server.server,
    port: server.server_port,
    cipher: server.method,
    password: server.password
  }))

  return {
    proxies,
    'proxy-groups': [{
      name: 'PROXY',
      type: 'select',
      proxies: proxies.map(proxy => proxy.name)
    }]
  }
}

if (import.meta.main) {
  const [url] = Deno.args
  const { servers } = await ky(url).json<Config>()
  const proxies = convertServers(servers)
  console.log(generateConfig(proxies))
}

import { join } from 'https://deno.land/std@0.91.0/path/mod.ts'
import { existsSync } from 'https://deno.land/std@0.91.0/fs/exists.ts'
// @deno-types="https://cdn.jsdelivr.net/npm/ky@0.27.0/index.d.ts"
import ky from 'https://cdn.jsdelivr.net/npm/ky@0.27.0/index.js'
import yaml from 'https://cdn.skypack.dev/js-yaml'
import { Config } from 'https://github.com/kidonng/cherry/raw/master/deno/SIP008-to-SIP002.ts'

export async function convertURL(url: string): Promise<string> {
  const { servers } = await ky(url).json<Config>()
  
  const proxies = servers.map(server => ({
    name: server.remarks,
    type: 'ss',
    server: server.server,
    port: server.server_port,
    cipher: server.method,
    password: server.password
  }))

  const config = join(Deno.env.get('HOME')!, '.config', 'clash', 'private.yaml')
  const rules = existsSync(config)
    ? yaml.load(Deno.readTextFileSync(config)).rules
    : [
      'GEOIP,CN,DIRECT',
      'MATCH,PROXY'
    ]

  return yaml.dump({
    proxies,
    'proxy-groups': [{
      name: 'PROXY',
      type: 'select',
      proxies: proxies.map(proxy => proxy.name)
    }],
    rules
  })
}

if (import.meta.main) console.log(await convertURL(Deno.args[0]))

import { join } from 'https://deno.land/std@0.91.0/path/mod.ts'
import { existsSync } from 'https://deno.land/std@0.91.0/fs/exists.ts'
import { decode } from 'https://deno.land/std@0.91.0/encoding/base64.ts'
// @deno-types="https://cdn.jsdelivr.net/npm/ky@0.27.0/index.d.ts"
import ky from 'https://cdn.jsdelivr.net/npm/ky@0.27.0/index.js'
import yaml from 'https://cdn.skypack.dev/js-yaml'

export async function convertURL(url: string): Promise<string> {
  const rawSub = await ky(url).text()
  const decodedSub = new TextDecoder().decode(decode(rawSub))

  const proxies = []
  for (const sub of decodedSub.split('\n')) {
    const url = new URL(sub)

    switch (url.protocol) {
      case 'vmess:':
        try {
          const decodedData = JSON.parse(new TextDecoder().decode(decode(url.hostname)))
          const proxy: Record<string, unknown> = {
            name: `${decodedData.ps} (VMESS)`,
            type: 'vmess',
            server: decodedData.add,
            port: decodedData.port,
            uuid: decodedData.id,
            alterId: decodedData.aid,
            cipher: 'auto'
          }
          if (decodedData?.tls === 'tls') proxy.tls = true
          if (decodedData?.net) proxy.network = decodedData.net
          if (decodedData?.path) proxy['ws-path'] = decodedData.path
          if (decodedData?.host) proxy['ws-headers'] = { Host: decodedData.host }
          proxies.push(proxy)
        } catch {}
        break
      case 'trojan:':
        proxies.push({
          name: `${decodeURIComponent(url.hash.slice(1))} (Trojan)`,
          type: 'trojan',
          server: url.hostname,
          port: Number(url.port),
          password: url.username
        })
        break
    }
  }

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

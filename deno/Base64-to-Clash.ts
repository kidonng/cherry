import { decode } from 'https://deno.land/std@0.91.0/encoding/base64.ts'
// @deno-types="https://cdn.jsdelivr.net/npm/ky@0.27.0/index.d.ts"
import ky from 'https://cdn.jsdelivr.net/npm/ky@0.27.0/index.js'
import { generateConfig } from './utils/clash.ts'

export function convertSub(rawSub: string) {
  const decodedSub = new TextDecoder().decode(decode(rawSub))

  const proxies = []
  for (const sub of decodedSub.split('\n')) {
    if (sub === '') return
    const url = new URL(sub)

    ;({
      'vmess:'() {
        try {
          const decodedData = JSON.parse(
            new TextDecoder().decode(decode(url.hostname))
          )
          const proxy: Record<string, unknown> = {
            name: `${decodedData.ps} (VMESS)`,
            type: 'vmess',
            server: decodedData.add,
            port: decodedData.port,
            uuid: decodedData.id,
            alterId: decodedData.aid,
            cipher: 'auto',
            'ws-opts': {},
          }
          if (decodedData?.tls === 'tls') proxy.tls = true
          if (decodedData?.net) proxy.network = decodedData.net
          if (decodedData?.path) proxy['ws-opts'].path = decodedData.path
          if (decodedData?.host)
            proxy['ws-opts'].headers = { Host: decodedData.host }
          proxies.push(proxy)
        } catch {}
      },
      'trojan:'() {
        proxies.push({
          name: `${decodeURIComponent(url.hash.slice(1))} (Trojan)`,
          type: 'trojan',
          server: url.hostname,
          port: Number(url.port),
          password: url.username,
        })
      },
    }[url.protocol]())
  }

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
  const rawSub = await ky(url).text()
  const proxies = convertSub(rawSub)
  console.log(generateConfig(proxies))
}
